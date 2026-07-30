import time
import numpy as np
import cv2
import onnxruntime as ort


class WeedPredictorONNX:
    def __init__(self, model_path: str, conf: float = 0.25, iou: float = 0.45, imgsz: int = 512):
        """
        ONNX-based YOLOv8-Seg predictor. No torch dependency.

        Args:
            model_path (str): Path to the .onnx model file
            conf (float): Confidence threshold
            iou (float): IoU threshold for NMS
            imgsz (int): Model input size (must match export imgsz)
        """
        self.session = ort.InferenceSession(
            model_path,
            providers=["CPUExecutionProvider"]
        )
        self.input_name = self.session.get_inputs()[0].name
        self.conf = conf
        self.iou = iou
        self.imgsz = imgsz

        # Try to read class names from model metadata (ultralytics embeds them)
        meta = self.session.get_modelmeta().custom_metadata_map
        if "names" in meta:
            import ast
            self.names = ast.literal_eval(meta["names"])
        else:
            self.names = {0: "weed"}  # fallback — adjust if you have multiple classes

    # ---------- Preprocessing ----------

    def _letterbox(self, image: np.ndarray):
        """Resize + pad image to square imgsz while preserving aspect ratio."""
        h, w = image.shape[:2]
        scale = self.imgsz / max(h, w)
        new_h, new_w = int(round(h * scale)), int(round(w * scale))

        resized = cv2.resize(image, (new_w, new_h))

        pad_h = self.imgsz - new_h
        pad_w = self.imgsz - new_w
        top, bottom = pad_h // 2, pad_h - pad_h // 2
        left, right = pad_w // 2, pad_w - pad_w // 2

        padded = cv2.copyMakeBorder(
            resized, top, bottom, left, right,
            cv2.BORDER_CONSTANT, value=(114, 114, 114)
        )
        return padded, scale, left, top

    def _preprocess(self, image: np.ndarray):
        padded, scale, pad_x, pad_y = self._letterbox(image)
        img = cv2.cvtColor(padded, cv2.COLOR_BGR2RGB)
        img = img.astype(np.float32) / 255.0
        img = img.transpose(2, 0, 1)  # HWC -> CHW
        img = np.expand_dims(img, axis=0)  # add batch dim
        return img, scale, pad_x, pad_y

    # ---------- Postprocessing ----------

    def _nms(self, boxes, scores, iou_threshold):
        """Simple NumPy NMS. Returns indices to keep."""
        if len(boxes) == 0:
            return []

        x1, y1, x2, y2 = boxes[:, 0], boxes[:, 1], boxes[:, 2], boxes[:, 3]
        areas = (x2 - x1) * (y2 - y1)
        order = scores.argsort()[::-1]

        keep = []
        while len(order) > 0:
            i = order[0]
            keep.append(i)

            xx1 = np.maximum(x1[i], x1[order[1:]])
            yy1 = np.maximum(y1[i], y1[order[1:]])
            xx2 = np.minimum(x2[i], x2[order[1:]])
            yy2 = np.minimum(y2[i], y2[order[1:]])

            w = np.maximum(0, xx2 - xx1)
            h = np.maximum(0, yy2 - yy1)
            inter = w * h
            iou = inter / (areas[i] + areas[order[1:]] - inter + 1e-6)

            order = order[1:][iou <= iou_threshold]

        return keep

    def _sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def predict(self, image: np.ndarray) -> dict:
        if image is None:
            raise ValueError("Input image is None.")
        if not isinstance(image, np.ndarray):
            raise TypeError("Input must be a NumPy ndarray.")

        start = time.perf_counter()

        orig_h, orig_w = image.shape[:2]
        input_tensor, scale, pad_x, pad_y = self._preprocess(image)

        outputs = self.session.run(None, {self.input_name: input_tensor})
        # output0: (1, 4 + num_classes + num_mask_coeffs, num_boxes) e.g. (1, 37, 8400) for 1 class + 32 mask coeffs
        # output1: (1, 32, 160, 160) mask prototypes
        preds = outputs[0][0]   # shape: (channels, num_boxes)
        proto = outputs[1][0]   # shape: (32, mh, mw)

        preds = preds.T  # (num_boxes, channels)

        num_classes = len(self.names)
        num_mask_coeffs = proto.shape[0]

        boxes_xywh = preds[:, :4]
        class_scores = preds[:, 4:4 + num_classes]
        mask_coeffs = preds[:, 4 + num_classes:4 + num_classes + num_mask_coeffs]

        class_ids = np.argmax(class_scores, axis=1)
        confidences = class_scores[np.arange(len(class_scores)), class_ids]

        # Filter by confidence threshold
        mask_filter = confidences > self.conf
        boxes_xywh = boxes_xywh[mask_filter]
        confidences = confidences[mask_filter]
        class_ids = class_ids[mask_filter]
        mask_coeffs = mask_coeffs[mask_filter]

        end = time.perf_counter()
        inference_time_ms = (end - start) * 1000

        if len(boxes_xywh) == 0:
            return {
                "original_image": image,
                "boxes": np.zeros((0, 4)),
                "scores": np.zeros((0,)),
                "class_ids": np.zeros((0,), dtype=int),
                "masks": np.zeros((0, orig_h, orig_w), dtype=np.uint8),
                "names": self.names,
                "inference_time_ms": round(inference_time_ms, 2)
            }

        # Convert xywh (center) -> xyxy, in letterboxed-image coordinates
        cx, cy, w, h = boxes_xywh[:, 0], boxes_xywh[:, 1], boxes_xywh[:, 2], boxes_xywh[:, 3]
        x1 = cx - w / 2
        y1 = cy - h / 2
        x2 = cx + w / 2
        y2 = cy + h / 2
        boxes_xyxy = np.stack([x1, y1, x2, y2], axis=1)

        keep = self._nms(boxes_xyxy, confidences, self.iou)
        boxes_xyxy = boxes_xyxy[keep]
        confidences = confidences[keep]
        class_ids = class_ids[keep]
        mask_coeffs = mask_coeffs[keep]

        # Undo letterbox padding/scaling to map boxes back to original image coords
        boxes_xyxy[:, [0, 2]] -= pad_x
        boxes_xyxy[:, [1, 3]] -= pad_y
        boxes_xyxy /= scale
        boxes_xyxy[:, [0, 2]] = np.clip(boxes_xyxy[:, [0, 2]], 0, orig_w)
        boxes_xyxy[:, [1, 3]] = np.clip(boxes_xyxy[:, [1, 3]], 0, orig_h)

        # Decode masks: mask_coeffs (N, 32) @ proto (32, mh*mw) -> (N, mh, mw)
        mh, mw = proto.shape[1], proto.shape[2]
        proto_flat = proto.reshape(num_mask_coeffs, -1)
        masks = self._sigmoid(mask_coeffs @ proto_flat).reshape(-1, mh, mw)

        # Resize each mask: proto space -> letterboxed input space -> original image space
        final_masks = np.zeros((len(masks), orig_h, orig_w), dtype=np.uint8)
        scale_x = mw / self.imgsz
        scale_y = mh / self.imgsz

        for i, m in enumerate(masks):
            # Crop the padding region out in proto space, then resize to original size
            crop_x1 = int(pad_x * scale_x)
            crop_y1 = int(pad_y * scale_y)
            crop_x2 = mw - crop_x1
            crop_y2 = mh - crop_y1
            cropped = m[crop_y1:crop_y2, crop_x1:crop_x2]
            resized = cv2.resize(cropped, (orig_w, orig_h))
            final_masks[i] = (resized > 0.5).astype(np.uint8)

        return {
            "original_image": image,
            "boxes": boxes_xyxy,
            "scores": confidences,
            "class_ids": class_ids,
            "masks": final_masks,
            "names": self.names,
            "inference_time_ms": round(inference_time_ms, 2)
        }
import cv2
import numpy as np


class Visualizer:
    def __init__(
        self,
        mask_color=(0, 255, 0),
        border_color=(0, 150, 0),
        alpha=0.6
    ):
        self.mask_color = mask_color
        self.border_color = border_color
        self.alpha = alpha

    def render(self, image: np.ndarray, prediction: dict) -> tuple[np.ndarray, int, str, float]:
        """
        Args:
            image (np.ndarray): Original BGR image.
            prediction (dict): Output of WeedPredictorONNX.predict() —
                expects keys: boxes, scores, class_ids, masks, names
        """
        output = image.copy()

        gray = cv2.cvtColor(output, cv2.COLOR_BGR2GRAY)
        output = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

        masks = prediction["masks"]
        scores = prediction["scores"]
        class_ids = prediction["class_ids"]
        names = prediction["names"]

        weed_count = len(masks)

        predicted_class = "Unknown"
        confidence = 0.0
        if len(class_ids) > 0:
            predicted_class = names.get(int(class_ids[0]), "Unknown") if isinstance(names, dict) else names[int(class_ids[0])]
            confidence = round(float(scores[0]) * 100, 1)

        for binary_mask in masks:
            overlay = output.copy()
            overlay[binary_mask == 1] = self.mask_color
            output = cv2.addWeighted(overlay, self.alpha, output, 1 - self.alpha, 0)

            contours, _ = cv2.findContours(
                binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE
            )
            cv2.drawContours(output, contours, -1, self.border_color, 2)

        return output, weed_count, predicted_class, confidence
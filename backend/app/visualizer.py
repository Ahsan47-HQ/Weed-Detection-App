# visualizer.py

import cv2
import numpy as np


class Visualizer:
    def __init__(
        self,
        mask_color=(0, 255, 0),
        border_color=(0, 150, 0),
        alpha=0.6
    ):
        """
        Visualization settings.

        Args:
            mask_color (tuple): BGR color for weed masks.
            border_color (tuple): BGR color for mask outlines.
            alpha (float): Transparency of segmentation masks.
        """

        self.mask_color = mask_color
        self.border_color = border_color
        self.alpha = alpha

    def render(
        self,
        image: np.ndarray,
        prediction,
    ) -> tuple[np.ndarray, int, str, float]:
        """
        Render segmentation results on the image.

        Args:
            image (np.ndarray): Original BGR image.
            prediction: Ultralytics Results object.
            inference_time (float): Inference time in milliseconds.
            model_name (str): Name displayed on output image.

        Returns:
            np.ndarray: Annotated image.
        """

        output = image.copy()

        # Convert background to grayscale
        
        gray = cv2.cvtColor(output, cv2.COLOR_BGR2GRAY)
        gray = cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

        output = gray.copy()

        weed_count = 0

        # Fetch the predicted class

        predicted_class = "Unknown"
        confidence = 0.0

        if prediction.boxes is not None and len(prediction.boxes.cls) > 0:
            class_id = int(prediction.boxes.cls[0])
            predicted_class = prediction.names[class_id]
            confidence = round(float(prediction.boxes.conf[0]) * 100, 1)


        # Draw segmentation masks

        if prediction.masks is not None:

            masks = prediction.masks.data.cpu().numpy()

            weed_count = len(masks)

            for mask in masks:

                # Resize mask to original image size
                mask = cv2.resize(
                    mask,
                    (image.shape[1], image.shape[0])
                )

                binary_mask = (mask > 0.5).astype(np.uint8)

                overlay = output.copy()

                overlay[binary_mask == 1] = self.mask_color

                output = cv2.addWeighted(
                    overlay,
                    self.alpha,
                    output,
                    1 - self.alpha,
                    0
                )

                contours, _ = cv2.findContours(
                    binary_mask,
                    cv2.RETR_EXTERNAL,
                    cv2.CHAIN_APPROX_SIMPLE
                )

                cv2.drawContours(
                    output,
                    contours,
                    -1,
                    self.border_color,
                    2
                )

        return output, weed_count, predicted_class, confidence
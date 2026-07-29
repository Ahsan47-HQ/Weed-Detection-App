from ultralytics import YOLO
import numpy as np
import time


class WeedPredictor:
    def __init__(self, model_path: str, conf: float = 0.25):
        """
        Initialize the predictor by loading the trained YOLOv8-Seg model.

        Args:
            model_path (str): Path to the trained model (.pt file)
            conf (float): Confidence threshold for predictions
        """
        self.model = YOLO(model_path)
        self.conf = conf

    def predict(self, image: np.ndarray) -> dict:
        """
        Perform weed segmentation on a single image.

        Args:
            image (np.ndarray): Input image (OpenCV BGR format)

        Returns:
            dict:
                {
                    "original_image": np.ndarray,
                    "results": ultralytics.engine.results.Results,
                    "inference_time_ms": float
                }
        """

        if image is None:
            raise ValueError("Input image is None.")

        if not isinstance(image, np.ndarray):
            raise TypeError("Input must be a NumPy ndarray.")

        start = time.perf_counter()

        results = self.model.predict(
            source=image,
            conf=self.conf,
            verbose=False
        )

        end = time.perf_counter()

        inference_time_ms = (end - start) * 1000

        return {
            "original_image": image,
            "prediction": results[0],
            "inference_time_ms": round(inference_time_ms, 2)
        }
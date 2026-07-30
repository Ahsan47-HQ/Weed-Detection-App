import numpy as np
import cv2
import base64

from fastapi import APIRouter, UploadFile, File, HTTPException

from app.predictor import WeedPredictor
from app.visualizer import Visualizer

from app.schemas import PredictionResponse

import io

router = APIRouter()

# Load the model only once when FastAPI starts

predictor = WeedPredictor("models/best.pt")
visualizer = Visualizer()

# Home page
@router.get('/')
def home():
    return {
        'message':'Welcome to the Weed Detection API'
    }

# Health check
@router.get('/health')
def health():
    return {
        'status':'running',
        'model':'YOLOv8-Seg Weed Detection API'
    }

# Prediction Endpoint
@router.post('/predict',response_model=PredictionResponse)
# The function is asynchronous because reading uploaded files is an I/O operation.
# Instead of blocking the server while reading the file, FastAPI can handle other requests.
async def predict(file: UploadFile = File(...)):
    # The user uploads an image and gets a segmented image as output

    # Validating file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="Upload an image file please!"
        )
    
    # Read Uploaded bytes
    image_bytes = await file.read()

    # Convert bytes of ndarray
    image = cv2.imdecode(
        np.frombuffer(image_bytes,np.uint8),
        cv2.IMREAD_COLOR
    )
    # Resize down if too large — cap longest side at 640-1024px
    max_dim = 1024
    h, w = image.shape[:2]
    if max(h, w) > max_dim:
        scale = max_dim / max(h, w)
        image = cv2.resize(image, (int(w * scale), int(h * scale)))

    # Non image content, just with an image extension
    if image is None:
        raise HTTPException(
            status_code=400,
            detail="Invalid Image!"
        )


    # try:
    #     # Run Inference
    #     output = predictor.predict(image)
        
    #     # Render Visualization
    #     annotated_image, weed_count, predicted_class, confidence = visualizer.render(
    #         image=output["original_image"],
    #         prediction=output["prediction"]
    #     )

    # except Exception as e:
    #     print("PREDICT ERROR:", repr(e))
    #     raise

    # # Convert image to png (np.ndarray to .png)

    # success, encoded_img = cv2.imencode(
    #     ".png",
    #     annotated_image
    # )

    # if not success:
    #     raise HTTPException(
    #         status_code=500, 
    #         detail='Could not encode output image'
    #     )
    
    # image_b64 = base64.b64encode(encoded_img).decode("utf-8")

    # # FastAPI auto-converts to JSON
    # return PredictionResponse(
    #     image=image_b64,
    #     weed_count=weed_count,
    #     predicted_class=predicted_class,
    #     confidence=confidence,
    #     inference_time_ms=output["inference_time_ms"],
    #     legend={
    #         "weed": "#00FF00",
    #         "background": "#808080"
    #     }
    # )

    return PredictionResponse(
        image="",
        weed_count=0,
        predicted_class="Test",
        confidence=0.0,
        inference_time_ms=0.0,
        legend={
            "weed": "#00FF00",
            "background": "#808080"
        }
    )
    
from pydantic import BaseModel

class PredictionResponse(BaseModel):
    image: str
    weed_count: int
    inference_time_ms: float
    legend : dict[str,str]
    predicted_class: str
    confidence: float


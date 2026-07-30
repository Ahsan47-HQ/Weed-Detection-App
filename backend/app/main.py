# Entry point for the backend

from fastapi.middleware.cors import CORSMiddleware

# main.py is now very small, it simply creates the FastAPI app and registers your routes
from fastapi import FastAPI
from app.routes import router

app = FastAPI(
    title='Weed Detection API',
    description='API for weed segmentation using YOLOv8-Seg',
    version='1.0.0'
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://weed-detection-app.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
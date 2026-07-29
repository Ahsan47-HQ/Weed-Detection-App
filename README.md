# 🌱 Weed Detection System

A full-stack web application for automatic weed detection and segmentation using YOLOv8-Seg.

## Features

- Upload crop field images
- Detect and segment weeds
- Display predicted weed species
- Show confidence score and weed count
- Provide species-specific information
- Modern React frontend with FastAPI backend

## Tech Stack

### Backend
- FastAPI
- YOLOv8-Seg (Ultralytics)
- PyTorch
- OpenCV

### Frontend
- React
- Vite
- CSS

## Project Structure

```
weed_detection_app/
│
├── backend/
│   ├── app/
│   ├── models/
│   └── requirements.txt
│
└── frontend/
    ├── src/
    ├── public/
    └── package.json
```

## Installation

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Model

The application uses a custom-trained YOLOv8-Seg model on the DeepWeeds dataset for weed segmentation and classification.

## License

This project was developed for academic and research purposes.
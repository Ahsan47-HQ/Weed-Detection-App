from ultralytics import YOLO

model = YOLO("../models/best.pt")
model.export(format="onnx", imgsz=512, opset=12, simplify=True)
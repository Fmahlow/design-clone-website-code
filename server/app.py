from flask import Flask, request, jsonify
from transformers import pipeline
import torch
from PIL import Image

app = Flask(__name__)

device = 0 if torch.cuda.is_available() else -1

detector = pipeline("object-detection", model="hustvl/yolos-tiny", device=device)

@app.post("/detect")
def detect_objects():
    file = request.files.get("image")
    if file is None:
        return jsonify({"objects": []})
    image = Image.open(file.stream).convert("RGB")
    outputs = detector(image)
    labels = sorted({o['label'] for o in outputs})
    return jsonify({"objects": labels})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

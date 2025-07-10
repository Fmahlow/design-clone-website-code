from flask import Flask, request, jsonify, send_file
from diffusers import FluxKontextPipeline
from transformers import pipeline
import torch
from PIL import Image
import io

app = Flask(__name__)

device = 0 if torch.cuda.is_available() else -1

detector = pipeline("object-detection", model="hustvl/yolos-tiny", device=device)
pipe = FluxKontextPipeline.from_pretrained("black-forest-labs/FLUX.1-Kontext-dev", torch_dtype=torch.bfloat16)
if torch.cuda.is_available():
    pipe.to("cuda")

@app.post("/detect")
def detect_objects():
    file = request.files.get("image")
    if file is None:
        return jsonify({"objects": []})
    image = Image.open(file.stream).convert("RGB")
    outputs = detector(image)
    labels = sorted({o['label'] for o in outputs})
    return jsonify({"objects": labels})

@app.post("/edit")
def edit_image():
    file = request.files.get("image")
    objects = request.form.getlist("objects")
    if file is None:
        return jsonify({"error": "no image"}), 400
    image = Image.open(file.stream).convert("RGB")
    prompt = ", ".join(f"remove {o}" for o in objects)
    result = pipe(image=image, prompt=prompt, guidance_scale=2.5, num_inference_steps=28).images[0]
    buf = io.BytesIO()
    result.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

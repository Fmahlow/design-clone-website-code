from flask import Flask, request, jsonify, send_file
import io
import time
import os
import random
import gc
import numpy as np
from transformers import pipeline
import torch
from PIL import Image
from diffusers import (
    ControlNetModel,
    DPMSolverMultistepScheduler,
    StableDiffusionControlNetPipeline,
    FluxKontextPipeline,
    FluxKontextInpaintPipeline,
)
from diffusers.utils import check_min_version
from controlnet_aux_local import NormalBaeDetector
#from flux.content_filters import PixtralContentFilter

app = Flask(__name__)

device = 0 if torch.cuda.is_available() else -1

detector = pipeline("object-detection", model="hustvl/yolos-tiny", device=device)

# ----------------------------------------------------------------------------
# Stable Diffusion ControlNet setup (adapted from original Gradio script)
# ----------------------------------------------------------------------------

MAX_SEED = np.iinfo(np.int32).max
API_KEY = os.environ.get("API_KEY", None)

print("CUDA version:", torch.version.cuda)
print("loading everything")


class Preprocessor:
    MODEL_ID = "lllyasviel/Annotators"
    def __init__(self):
        self.model = None
        self.name = ""

    def load(self, name: str) -> None:
        if name == self.name:
            return
        elif name == "NormalBae":
            print("Loading NormalBae")
            self.model = NormalBaeDetector.from_pretrained(self.MODEL_ID).to("cuda")
            torch.cuda.empty_cache()
            self.name = name
        else:
            raise ValueError

    def __call__(self, image: Image.Image, **kwargs) -> Image.Image:
        return self.model(image, **kwargs)


# Initialize pipeline only once when the module is imported
model_id = "lllyasviel/control_v11p_sd15_normalbae"
print("initializing controlnet")
controlnet = ControlNetModel.from_pretrained(
    model_id,
    torch_dtype=torch.float16,
    attn_implementation="flash_attention_2",
).to("cuda")

# Scheduler
scheduler = DPMSolverMultistepScheduler.from_pretrained(
    "ashllay/stable-diffusion-v1-5-archive",
    solver_order=2,
    subfolder="scheduler",
    use_karras_sigmas=True,
    final_sigmas_type="sigma_min",
    algorithm_type="sde-dpmsolver++",
    prediction_type="epsilon",
    thresholding=False,
    denoise_final=True,
    device_map="cuda",
    torch_dtype=torch.float16,
)

# Base model
base_model_url = "https://huggingface.co/Lykon/AbsoluteReality/blob/main/AbsoluteReality_1.8.1_pruned.safetensors"

print("loading pipe")
pipe = StableDiffusionControlNetPipeline.from_single_file(
    base_model_url,
    safety_checker=None,
    controlnet=controlnet,
    scheduler=scheduler,
    torch_dtype=torch.float16,
).to("cuda")

print("loading preprocessor")
preprocessor = Preprocessor()
preprocessor.load("NormalBae")

# textual inversions
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="EasyNegativeV2.safetensors",
    token="EasyNegativeV2",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="badhandv4.pt",
    token="badhandv4",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="fcNeg-neg.pt",
    token="fcNeg-neg",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_Ahegao.pt",
    token="HDA_Ahegao",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_Bondage.pt",
    token="HDA_Bondage",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_pet_play.pt",
    token="HDA_pet_play",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_unconventional maid.pt",
    token="HDA_unconventional_maid",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_NakedHoodie.pt",
    token="HDA_NakedHoodie",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_NunDress.pt",
    token="HDA_NunDress",
)
pipe.load_textual_inversion(
    "broyang/hentaidigitalart_v20",
    weight_name="HDA_Shibari.pt",
    token="HDA_Shibari",
)
pipe.to("cuda")

print("---------------Loaded controlnet pipeline---------------")
torch.cuda.empty_cache()
gc.collect()
print(
    f"CUDA memory allocated: {torch.cuda.max_memory_allocated(device='cuda') / 1e9:.2f} GB"
)

# Initialize Flux Kontext pipeline for chat-based edits
print("loading Flux Kontext pipeline")
#flux_pipe = FluxKontextPipeline.from_pretrained(
#    "black-forest-labs/FLUX.1-Kontext-dev",
#    torch_dtype=torch.bfloat16,
#)
#flux_pipe.to("cuda")
#integrity_checker = PixtralContentFilter(torch.device("cuda"))

# Initialize Flux Kontext inpainting pipeline
check_min_version("0.30.2")
inpaint_pipe = FluxKontextInpaintPipeline.from_pretrained(
    "black-forest-labs/FLUX.1-Kontext-dev",
    torch_dtype=torch.bfloat16,
)
inpaint_pipe.to("cuda")

# Style prompts in Portuguese
style_prompts = {
    "nenhum": "",
    "minimalista": "Minimalist interior design,clean lines,neutral colors,uncluttered space,functional furniture,lots of natural light",
    "boêmio": "Bohemian chic interior,eclectic mix of patterns and textures,vintage furniture,plants,woven textiles,warm earthy colors",
    "fazenda": "Modern farmhouse interior,rustic wood elements,shiplap walls,neutral color palette,industrial accents,cozy textiles",
    "príncipe-saudita": "Opulent gold interior,luxurious ornate furniture,crystal chandeliers,rich fabrics,marble floors,intricate Arabic patterns",
    "neoclássico": "Neoclassical interior design,elegant columns,ornate moldings,symmetrical layout,refined furniture,muted color palette",
    "eclético": "Eclectic interior design,mix of styles and eras,bold color combinations,diverse furniture pieces,unique art objects",
    "parisiense": "Parisian apartment interior,all-white color scheme,ornate moldings,herringbone wood floors,elegant furniture,large windows",
    "hollywood": "Hollywood Regency interior,glamorous and luxurious,bold colors,mirrored surfaces,velvet upholstery,gold accents",
    "escandinavo": "Scandinavian interior design,light wood tones,white walls,minimalist furniture,cozy textiles,hygge atmosphere",
    "praia": "Coastal beach house interior,light blue and white color scheme,weathered wood,nautical accents,sheer curtains,ocean view",
    "japonês": "Traditional Japanese interior,tatami mats,shoji screens,low furniture,zen garden view,minimalist decor,natural materials",
    "meados-do-século-moderno": "Mid-century modern interior,1950s-60s style furniture,organic shapes,warm wood tones,bold accent colors,large windows",
    "retro-futurismo": "Neon (atompunk world) retro cyberpunk background",
    "texano": "Western cowboy interior,rustic wood beams,leather furniture,cowhide rugs,antler chandeliers,southwestern patterns",
    "matrix": "Futuristic cyberpunk interior,neon accent lighting,holographic plants,sleek black surfaces,advanced gaming setup,transparent screens,Blade Runner inspired decor,high-tech minimalist furniture",
}


def apply_style(style_name: str) -> str:
    """Return the prompt fragment for the selected style."""
    return style_prompts.get(style_name.lower(), "")


def process_image(image: Image.Image, style_selection: str) -> Image.Image:
    """Generate an image with the selected style using the SD pipeline."""
    seed = random.randint(0, MAX_SEED)
    generator = torch.cuda.manual_seed(seed)

    preprocessor.load("NormalBae")
    control_image = preprocessor(
        image=image,
        image_resolution=512,
        detect_resolution=512,
    )

    style_prompt = apply_style(style_selection)
    if style_prompt:
        prompt = f"Photo from Pinterest of {style_prompt}"
    else:
        prompt = "Photo from Pinterest"

    negative_prompt = (
        "EasyNegativeV2, fcNeg, (badhandv4:1.4), (worst quality, low quality, bad quality, normal quality:2.0), (bad hands, missing fingers, extra fingers:2.0)"
    )

    result = pipe(
        prompt=prompt,
        negative_prompt=negative_prompt,
        guidance_scale=5.5,
        num_images_per_prompt=1,
        num_inference_steps=15,
        generator=generator,
        image=control_image,
    ).images[0]

    return result


def inpaint_image(image: Image.Image, mask: Image.Image, prompt: str) -> Image.Image:
    image = image.convert("RGB")
    mask = mask.convert("RGB")
    mask = inpaint_pipe.mask_processor.blur(mask, blur_factor=12)
    result = inpaint_pipe(
        prompt=prompt,
        image=image,
        mask_image=mask,
        image_reference=image,
        strength=1.0,
    ).images[0]

    return result

@app.post("/detect")
def detect_objects():
    file = request.files.get("image")
    if file is None:
        return jsonify({"objects": []})
    image = Image.open(file.stream).convert("RGB")
    outputs = detector(image)
    labels = sorted({o['label'] for o in outputs})
    return jsonify({"objects": labels})


@app.get("/time")
def get_time():
    """Return the current unix timestamp."""
    return jsonify({"time": time.time()})


@app.post("/style")
def change_style():
    """Run the ControlNet pipeline to change the image style."""
    file = request.files.get("image")
    style = request.form.get("style", "nenhum")
    if file is None:
        return jsonify({"error": "no image provided"}), 400
    img = Image.open(file.stream).convert("RGB")
    result = process_image(img, style)
    buf = io.BytesIO()
    result.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")


@app.post("/inpaint")
def inpaint():
    file = request.files.get("image")
    mask_file = request.files.get("mask")
    prompt = request.form.get("prompt", "")
    if file is None or mask_file is None:
        return jsonify({"error": "image and mask required"}), 400
    img = Image.open(file.stream).convert("RGB")
    mask = Image.open(mask_file.stream).convert("RGB")
    result = inpaint_image(img, mask, prompt)
    buf = io.BytesIO()
    result.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")


@app.post("/flux-edit")
def flux_edit():
    """Run the Flux Kontext pipeline to edit the image based on a text prompt."""
    file = request.files.get("image")
    prompt = request.form.get("prompt", "")
    if file is None or not prompt:
        return jsonify({"error": "image and prompt required"}), 400
    img = Image.open(file.stream).convert("RGB")
    image = flux_pipe(image=img, prompt=prompt, guidance_scale=2.5).images[0]
    image_ = np.array(image) / 255.0
    image_ = 2 * image_ - 1
    image_ = (
        torch.from_numpy(image_)
        .to("cuda", dtype=torch.float32)
        .unsqueeze(0)
        .permute(0, 3, 1, 2)
    )
    #if integrity_checker.test_image(image_):
    #    return jsonify({"error": "flagged"}), 400
    buf = io.BytesIO()
    image.save(buf, format="PNG")
    buf.seek(0)
    return send_file(buf, mimetype="image/png")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)

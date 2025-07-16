import os
import types
import warnings
import torch
import torchvision.transforms as transforms
from einops import rearrange
from huggingface_hub import hf_hub_download
from PIL import Image
import numpy as np

from ..util import HWC3, resize_image
from .nets.NNET import NNET

def load_checkpoint(fpath, model):
    ckpt = torch.load(fpath, map_location='cpu')['model']
    load_dict = {k.replace('module.', ''): v for k, v in ckpt.items()}
    model.load_state_dict(load_dict)
    return model

class NormalBaeDetector:
    def __init__(self, model):
        self.model = model
        self.norm = transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])

    @classmethod
    def from_pretrained(cls, pretrained_model_or_path, filename=None, cache_dir=None, local_files_only=False):
        filename = filename or "scannet.pt"
        model_path = os.path.join(pretrained_model_or_path, filename) if os.path.isdir(pretrained_model_or_path) else hf_hub_download(pretrained_model_or_path, filename, cache_dir=cache_dir, local_files_only=local_files_only)

        args = types.SimpleNamespace(mode='client', architecture='BN', pretrained='scannet', sampling_ratio=0.4, importance_ratio=0.7)
        model = load_checkpoint(model_path, NNET(args)).eval()

        return cls(model)

    def to(self, device):
        self.model.to(device)
        return self

    @torch.no_grad()
    def __call__(self, input_image, detect_resolution=512, output_type="pil", **kwargs):
        if isinstance(output_type, bool) or "return_pil" in kwargs:
            warnings.warn("Deprecated: Use output_type='pil' or 'np' instead of boolean values.", DeprecationWarning)
            output_type = "pil" if (kwargs.get("return_pil", output_type) if isinstance(output_type, bool) else output_type) else "np"

        device = next(self.model.parameters()).device
        input_image = np.array(input_image, dtype=np.uint8) if not isinstance(input_image, np.ndarray) else input_image
        input_image = HWC3(input_image)
        input_image = resize_image(input_image, detect_resolution)

        image_normal = torch.from_numpy(input_image).float().to(device)
        image_normal = self.norm(image_normal.permute(2, 0, 1).unsqueeze(0) / 255.0)

        normal = self.model(image_normal)[0][-1][:, :3]
        normal = ((normal + 1) * 0.5).clip(0, 1)
        normal_image = (normal[0].permute(1, 2, 0).cpu().numpy() * 255.0).clip(0, 255).astype(np.uint8)

        detected_map = HWC3(normal_image)

        return Image.fromarray(detected_map) if output_type == "pil" else detected_map
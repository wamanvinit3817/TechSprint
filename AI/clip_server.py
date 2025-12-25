from fastapi import FastAPI
from PIL import Image
import torch
import open_clip
import requests
from io import BytesIO

app = FastAPI()

model, _, preprocess = open_clip.create_model_and_transforms(
    "ViT-B-32",
    pretrained="openai"
)
model.eval()

@app.post("/embed")
async def embed(data: dict):
    image_url = data["image_url"]

    img_bytes = requests.get(image_url).content
    image = Image.open(BytesIO(img_bytes)).convert("RGB")
    image = preprocess(image).unsqueeze(0)

    with torch.no_grad():
        emb = model.encode_image(image)
        emb = emb / emb.norm(dim=-1, keepdim=True)

    return emb[0].tolist()

import asyncio
import os
import io
import json
import httpx
import shutil
from google import genai
from google.genai import types
from PIL import Image

def load_gemini_api_key() -> str:
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if line.strip().startswith("GEMINI_API_KEY="):
                    return line.split("=")[1].strip()
    raise ValueError("No Gemini API key found in .env")

def load_hf_api_key() -> str:
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if line.strip().startswith("HF_API_KEY="):
                    return line.split("=")[1].strip()
    # Fallback to user's hardcoded token if needed
    return "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"

async def test_hf_pipeline():
    gemini_key = load_gemini_api_key()
    hf_token = load_hf_api_key()
    
    client = genai.Client(api_key=gemini_key)
    
    # 1. Load photo
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "static")
    image_path = os.path.join(static_dir, "emp_4_istockphoto-871428010-170667a.jpg")
    img = Image.open(image_path).convert("RGB")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()
    
    # 2. Get Likeness
    print("Step 1: Calling gemini-2.5-flash-lite for portrait description...")
    describe_prompt = """
    Analyze this photo of a person. Describe their physical appearance and likeness in high detail, focusing on:
    - Gender and approximate age.
    - Facial structure, chin shape, jawline, and cheeks.
    - Eyes, hair style, skin tone.
    Provide a precise, high-fidelity depiction in under 80 words. Do not describe any background details.
    """
    
    response = await client.aio.models.generate_content(
        model="gemini-2.5-flash-lite",
        contents=[
            types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"),
            describe_prompt
        ]
    )
    person_likeness = response.text
    print("Likeness description:", person_likeness)
    
    # 3. Generate Image
    print("Step 2: Calling Hugging Face (FLUX.1-schnell)...")
    imagen_prompt = f"""
    A premium 1024x1024 professional 2D vector illustration caricature avatar of a person.
    Likeness & features to retain: {person_likeness}.
    Style: Modern corporate cartoon caricature, clean bold outlines, flat cell shading, sticker style.
    """
    
    HF_API_URL = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell"
    headers = {"Authorization": f"Bearer {hf_token}"}
    
    async with httpx.AsyncClient(timeout=60.0) as httpx_client:
        response = await httpx_client.post(HF_API_URL, headers=headers, json={"inputs": imagen_prompt})
        
        # If the model is sleeping, wait out the cold-start window
        if response.status_code == 503:
            estimated_time = response.json().get("estimated_time", 20)
            print(f"Model is wake-loading on Hugging Face. Waiting {estimated_time} seconds dynamically...")
            await asyncio.sleep(estimated_time)
            response = await httpx_client.post(HF_API_URL, headers=headers, json={"inputs": imagen_prompt})

    if response.status_code != 200:
        raise RuntimeError(f"Hugging Face API error {response.status_code}: {response.text}")
        
    image_bytes = response.content
    if image_bytes:
        print(f"SUCCESS! Generated image bytes length: {len(image_bytes)}")
        # Save output image
        out_path = os.path.join(static_dir, "test_output_hf.png")
        with open(out_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved generated image to {out_path}")
    else:
        print("FAILED: No image bytes returned from Hugging Face.")

if __name__ == "__main__":
    asyncio.run(test_hf_pipeline())

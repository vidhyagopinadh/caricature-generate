import asyncio
import os
import io
from google import genai
from google.genai import types

def load_gemini_api_key() -> str:
    env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                if line.strip().startswith("GEMINI_API_KEY="):
                    return line.split("=")[1].strip()
    raise ValueError("No API key found in .env")

async def test_models():
    api_key = load_gemini_api_key()
    client = genai.Client(api_key=api_key)
    
    models = [
        "gemini-3.1-flash-image",
        "gemini-3.1-flash-image-preview",
        "gemini-3-pro-image",
        "gemini-3-pro-image-preview"
    ]
    
    for model in models:
        print(f"\nTesting image generation with: {model}...")
        try:
            img_response = await client.aio.models.generate_content(
                model=model,
                contents=["A simple corporate caricature avatar of a woman, 2D vector style"],
                config=types.GenerateContentConfig(
                    response_modalities=["IMAGE"],
                )
            )
            image_bytes = None
            for part in img_response.candidates[0].content.parts:
                if part.inline_data:
                    image_bytes = part.inline_data.data
                    break
            if image_bytes:
                print(f"SUCCESS with model: {model}! Bytes length: {len(image_bytes)}")
                break
            else:
                print(f"FAILED with model: {model} (no image bytes returned)")
        except Exception as e:
            print(f"FAILED with model: {model}. Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_models())

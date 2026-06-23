import asyncio
import os
import io
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
    raise ValueError("No API key found in .env")

async def test_models():
    api_key = load_gemini_api_key()
    client = genai.Client(api_key=api_key)
    
    # Load an image
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "static")
    image_path = os.path.join(static_dir, "emp_4_istockphoto-871428010-170667a.jpg")
    img = Image.open(image_path).convert("RGB")
    
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='JPEG')
    img_bytes = img_byte_arr.getvalue()
    
    # List of models to try for description
    models = [
        "gemini-2.0-flash-lite",
        "gemini-2.5-flash-lite",
        "gemini-3.1-flash-lite",
        "gemini-flash-latest",     # (Often alias to 1.5-flash)
        "gemini-1.5-flash",
        "gemini-2.0-flash"
    ]
    
    for model in models:
        print(f"\nTesting description with model: {model}...")
        try:
            response = await client.aio.models.generate_content(
                model=model,
                contents=[
                    types.Part.from_bytes(data=img_bytes, mime_type="image/jpeg"),
                    "Describe this person in 3 words."
                ]
            )
            print(f"SUCCESS with {model}!")
            print("Response:", response.text)
            break
        except Exception as e:
            print(f"FAILED with {model}. Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_models())

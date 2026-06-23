import asyncio
import os
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

async def test_imagen():
    api_key = load_gemini_api_key()
    
    api_versions = ['v1', 'v1beta', 'v1alpha']
    
    for version in api_versions:
        print(f"\n--- Testing API version: {version} ---")
        try:
            client = genai.Client(api_key=api_key, http_options={'api_version': version})
            response = await client.aio.models.generate_images(
                model='gemini-2.5-flash-image',
                prompt='A portrait of a smiling person, sticker vector art',
                config=types.GenerateImagesConfig(
                    number_of_images=1,
                    output_mime_type="image/png"
                )
            )
            print(f"SUCCESS with API version: {version}!")
            print("Response:", response)
            for i, gen_img in enumerate(response.generated_images):
                print(f"Image {i}: hasattr(image)={hasattr(gen_img, 'image')}")
                if hasattr(gen_img, 'image'):
                    print("image object type:", type(gen_img.image))
                    # print some attributes
                    print("image attrs:", [a for a in dir(gen_img.image) if not a.startswith('_')])
            break
        except Exception as e:
            print(f"FAILED with API version: {version}. Error: {e}")

if __name__ == "__main__":
    asyncio.run(test_imagen())

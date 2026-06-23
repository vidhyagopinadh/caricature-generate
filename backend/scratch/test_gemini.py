import os
from google import genai

# Load API key
api_key = None
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env")
if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            if line.startswith("GEMINI_API_KEY="):
                api_key = line.split("=")[1].strip()
                break

client = genai.Client(api_key=api_key)

try:
    print("Testing list models...")
    for model in client.models.list():
        print(f"Model Name: {model.name}")
except Exception as e:
    print("Error listing models:", e)

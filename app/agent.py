from google import genai
from PIL import Image
from app.prompts import PROMPT
import requests
import io
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def process_image_urls(image_urls):
    images = []

    for url in image_urls:
        response = requests.get(url)
        img = Image.open(io.BytesIO(response.content))
        images.append(img)

    gemini_response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[PROMPT] + images
    )

    return gemini_response.text

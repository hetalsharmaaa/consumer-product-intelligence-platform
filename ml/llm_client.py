import os
import json
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("GROQ_API_KEY not found. Add it to ml/.env")

client = Groq(api_key=API_KEY)
MODEL_NAME = "llama-3.3-70b-versatile"  # free, fast, strong for this use case


def call_llm_json(prompt: str) -> dict:
    """
    Sends a prompt to the LLM and expects a JSON object back.
    Returns a Python dict. Raises ValueError if parsing fails.
    """
    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        raw = response.choices[0].message.content
        return json.loads(raw)
    except Exception as e:
        raise ValueError(f"LLM call failed or returned invalid JSON: {e}")
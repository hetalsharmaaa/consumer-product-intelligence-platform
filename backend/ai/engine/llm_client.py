"""
Thin wrapper around the Groq client used by every AI feature in this app.

Important: this module must NEVER raise at import time. If it did, importing
`ai.views` (which Django does on startup, since it's wired into urls.py)
would crash the whole backend just because GROQ_API_KEY isn't set yet.
Instead, the key is checked lazily, the first time a call is actually made,
and a clear AIUnavailableError is raised so the view can turn it into a
friendly JSON response instead of a 500.
"""
import os
import json

from groq import Groq

MODEL_NAME = "openai/gpt-oss-120b"  # free, fast, strong for this use case

_client = None


class AIUnavailableError(Exception):
    """Raised when the AI feature can't run (missing key, API error, bad response)."""
    pass


def _get_client():
    global _client

    if _client is not None:
        return _client

    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        raise AIUnavailableError(
            "GROQ_API_KEY is not set. Add it to backend/.env (see .env.example) "
            "to enable AI features."
        )

    _client = Groq(api_key=api_key)
    return _client


def call_llm_json(prompt: str) -> dict:
    """
    Sends a prompt to the LLM and expects a JSON object back.
    Returns a Python dict. Raises AIUnavailableError if the key is missing,
    the API call fails, or the response isn't valid JSON.
    """
    client = _get_client()

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"},
            temperature=0.3,
        )
        raw = response.choices[0].message.content
        return json.loads(raw)
    except AIUnavailableError:
        raise
    except Exception as e:
        raise AIUnavailableError(f"LLM call failed or returned invalid JSON: {e}")


def call_llm_chat(messages: list) -> str:
    """
    Sends a full chat history (list of {"role", "content"} dicts) to the LLM
    and returns the assistant's reply text.
    """
    client = _get_client()

    try:
        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=messages,
            temperature=0.3,
        )
        return response.choices[0].message.content
    except AIUnavailableError:
        raise
    except Exception as e:
        raise AIUnavailableError(f"LLM chat call failed: {e}")

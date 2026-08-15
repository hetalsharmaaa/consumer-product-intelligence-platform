from .llm_client import call_llm_chat

SYSTEM_PROMPT_TEMPLATE = """
You are a helpful product assistant chatbot for a consumer product intelligence app.
Answer the user's questions about products in a friendly, concise way (2-4 sentences
unless asked for detail).

{product_context}

STRICT RULES:
- If product data is provided above, answer ONLY using facts present in it.
- If the user asks something not covered by the given data (a spec, ingredient, or fact
  not listed), clearly say you don't have that information — do NOT guess or make it up.
- Do not make medical, safety, or legal claims beyond what is explicitly stated in the data
  or general, widely known knowledge.
- If the user asks something unrelated to products/shopping, politely redirect them back
  to product-related questions.
"""

NO_PRODUCT_CONTEXT = (
    "No specific product is currently loaded. Help the user with general "
    "product-research questions (comparisons, what to look for, how to use the app), "
    "and if they ask about a specific product, ask them to open that product's page first."
)


def ask_chatbot(question: str, product_data: str | None = None, history: list | None = None) -> str:
    """
    Answers a single question, optionally grounded in one product's data, optionally
    continuing a prior conversation (list of {"role": "user"|"assistant", "content": str}).
    """
    product_context = (
        f"Product data:\n{product_data}" if product_data else NO_PRODUCT_CONTEXT
    )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT_TEMPLATE.format(product_context=product_context)}
    ]

    if history:
        # Only trust role/content from history, and cap it so prompts don't balloon.
        for turn in history[-10:]:
            role = turn.get("role")
            content = turn.get("content")
            if role in ("user", "assistant") and content:
                messages.append({"role": role, "content": content})

    messages.append({"role": "user", "content": question})

    return call_llm_chat(messages)

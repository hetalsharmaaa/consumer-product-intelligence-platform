from llm_client import client, MODEL_NAME  # reuse the same Groq client

SYSTEM_PROMPT_TEMPLATE = """
You are a helpful product assistant chatbot for a consumer product intelligence app.
You must answer the user's questions ONLY using the product data provided below.

Product data:
{product_data}

STRICT RULES:
- Only use facts present in the product data above.
- If the user asks something not covered by this data (e.g. a spec, ingredient, or fact not listed), clearly say you don't have that information — do NOT guess or make it up.
- Do not make medical, safety, or legal claims beyond what is explicitly stated in the data.
- Keep answers concise and conversational (2-4 sentences unless the user asks for detail).
- If the user asks something unrelated to this product, politely redirect them back to product-related questions.
"""


class ProductChatbot:
    """
    Holds a conversation about ONE product, grounded strictly in the given product data.
    """

    def __init__(self, product_data: str):
        self.product_data = product_data
        self.history = [
            {"role": "system", "content": SYSTEM_PROMPT_TEMPLATE.format(product_data=product_data)}
        ]

    def ask(self, user_message: str) -> str:
        self.history.append({"role": "user", "content": user_message})

        response = client.chat.completions.create(
            model=MODEL_NAME,
            messages=self.history,
            temperature=0.3,
        )

        reply = response.choices[0].message.content
        self.history.append({"role": "assistant", "content": reply})
        return reply


if __name__ == "__main__":
    product_data = """
    Name: UrbanFit Running Shoes
    Price: $79.99
    Material: Breathable mesh upper, rubber outsole, EVA foam midsole
    Weight: 260g (per shoe, size 9)
    Features: Reflective strips for night visibility, arch support, machine washable
    Reviews mention: Very comfortable for daily runs, sizing runs slightly small, durability good for up to 300 miles
    """

    bot = ProductChatbot(product_data)

    print("User: Is this shoe good for trail running?")
    print("Bot:", bot.ask("Is this shoe good for trail running?"))
    print()

    print("User: Does it contain any leather?")
    print("Bot:", bot.ask("Does it contain any leather?"))
    print()

    print("User: What's the weather like today?")
    print("Bot:", bot.ask("What's the weather like today?"))
from llm_client import call_llm_json

PROMPT_TEMPLATE = """
You are a product summarization assistant for a consumer product intelligence app.
Your job is to turn detailed/complex product information into a short, easy-to-understand summary for a shopper.

Given the product data below, return a JSON object with EXACTLY these fields:

- "short_summary": a 2-3 sentence plain-English summary of what this product is and who it's good for
- "highlights": a list of 3-5 short bullet points on the most notable features/attributes
- "watch_outs": a list of 0-3 things a buyer should be aware of (price, limitations, common complaints IF mentioned in the data). Empty list if nothing notable.
- "best_for": a short phrase describing the ideal use-case or user for this product

Rules:
- Base everything ONLY on the product data given. Do not invent features, specs, or claims not present in the input.
- If the input data is sparse, keep the summary sparse too — do not fabricate details to fill space.
- Respond with ONLY the JSON object, nothing else.

Product Data:
{product_data}
"""


def summarize_product(product_data: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(product_data=product_data)
    result = call_llm_json(prompt)
    result["_source"] = "ai_generated"
    return result


if __name__ == "__main__":
    sample_data = """
    Name: UrbanFit Running Shoes
    Category: Footwear - Running
    Price: $79.99
    Material: Breathable mesh upper, rubber outsole, EVA foam midsole
    Weight: 260g (per shoe, size 9)
    Features: Reflective strips for night visibility, arch support, machine washable
    Reviews mention: Very comfortable for daily runs, sizing runs slightly small, durability
    good for up to 300 miles
    """

    result = summarize_product(sample_data)

    import json
    print(json.dumps(result, indent=2))
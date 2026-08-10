from llm_client import call_llm_json

PROMPT_TEMPLATE = """
You are a product ingredient/material analysis assistant for a consumer product intelligence app.

Given the product name and its ingredients/materials list below, produce a JSON object with EXACTLY these fields:

- "simple_explanation": a plain-English explanation of what this product is made of (2-3 sentences)
- "key_ingredients": a list of the 3-6 most notable ingredients/materials
- "potential_concerns": a list of ingredients/materials that commonly raise concerns (allergens, irritants, environmental impact). If none, return an empty list. Do NOT invent medical claims.
- "useful_properties": a list of beneficial properties these ingredients/materials are known for
- "overall_interpretation": a short, balanced summary (2-3 sentences) framed as AI-generated interpretation, not a medical or safety verdict

Rules:
- Do not make medical, safety, or health claims beyond general, widely known knowledge.
- Be neutral and factual, not promotional.
- Base concerns only on well-established, commonly known issues (e.g. "sulfates can be drying for sensitive skin", "contains a common allergen: peanuts").
- Respond with ONLY the JSON object, nothing else.

Product Name: {product_name}
Ingredients/Materials: {ingredients}
"""


def analyze_ingredients(product_name: str, ingredients: str) -> dict:
    prompt = PROMPT_TEMPLATE.format(product_name=product_name, ingredients=ingredients)
    result = call_llm_json(prompt)
    result["_source"] = "ai_generated"
    result["_product_name"] = product_name
    return result


if __name__ == "__main__":
    # Manual test run
    sample_product = "Herbal Face Wash"
    sample_ingredients = "Water, Sodium Laureth Sulfate, Aloe Vera Extract, Neem Extract, Glycerin, Fragrance, Citric Acid"

    result = analyze_ingredients(sample_product, sample_ingredients)

    import json
    print(json.dumps(result, indent=2))
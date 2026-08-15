from llm_client import call_llm_json

PROMPT_TEMPLATE = """
You are a product comparison assistant for a consumer product intelligence app.
Compare the products below and help the user decide, based ONLY on the data provided.

Return a JSON object with EXACTLY these fields:

- "comparison_table": a list of objects, one per product, each with:
    - "name": product name
    - "strengths": list of 2-4 strengths relative to the other product(s)
    - "weaknesses": list of 0-3 weaknesses relative to the other product(s)
- "winner_overall": name of the product that seems better overall based on the data given, or "depends" if genuinely close/context-dependent
- "winner_reasoning": 2-3 sentences explaining the overall winner choice
- "winner_by_priority": if a user priority was given, an object {{"product": "<name>", "reason": "<1-2 sentence reason>"}}. If no priority was given, set this field to null.
Rules:
- Base the comparison ONLY on the product data given. Do not invent specs or claims not present in the input.
- If data is missing for a fair comparison on some attribute, do not guess — omit that attribute rather than fabricating it.
- Be balanced and avoid promotional language.
- Respond with ONLY the JSON object, nothing else.

User priority (may be empty): {user_priority}

Products to compare:
{products_data}
"""


def compare_products(products_data: str, user_priority: str = "") -> dict:
    prompt = PROMPT_TEMPLATE.format(
        products_data=products_data,
        user_priority=user_priority if user_priority else "None specified"
    )
    result = call_llm_json(prompt)
    result["_source"] = "ai_generated"
    return result


if __name__ == "__main__":
    sample_products = """
    Product 1:
    Name: UrbanFit Running Shoes
    Price: $79.99
    Material: Breathable mesh, rubber outsole
    Weight: 260g
    Durability: Rated for 300 miles
    Reviews: Comfortable, sizing runs small

    Product 2:
    Name: TrailMax Pro Runners
    Price: $119.99
    Material: Waterproof synthetic leather, reinforced outsole
    Weight: 310g
    Durability: Rated for 500 miles
    Reviews: Very durable, slightly heavier, great for trail running
    """

    result = compare_products(sample_products, user_priority="durability")

    import json
    print(json.dumps(result, indent=2))
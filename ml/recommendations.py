from llm_client import call_llm_json

PROMPT_TEMPLATE = """
You are a product recommendation assistant for a consumer product intelligence app.
Given the current product the user is viewing, a list of candidate alternative products,
and the user's stated preference (if any), recommend the best alternatives.

Return a JSON object with EXACTLY these fields:

- "recommendations": a list of objects, each with:
    - "name": product name (must be one of the candidate products, never invent a product)
    - "reason": 1-2 sentence explanation of why this is a good alternative, grounded in the actual data given
    - "tradeoffs": 0-2 sentence note on what the user gives up by choosing this over the current product (if anything). Empty string if none.
- "no_better_alternative": true if none of the candidates are meaningfully better than the current product for the stated preference, false otherwise

Rules:
- ONLY recommend from the candidate list given. Never invent a product name.
- Base every reason strictly on the attributes provided. Do not claim health, safety, or performance benefits not supported by the data.
- Do not use fake certainty like "scientifically proven" or invented match percentages.
- If no preference is given, recommend based on general well-roundedness (better attributes across the board).
- Return at most 3 recommendations, ranked best first.
- Respond with ONLY the JSON object, nothing else.

Current product:
{current_product}

User preference (may be empty): {user_preference}

Candidate alternative products:
{candidate_products}
"""


def recommend_alternatives(current_product: str, candidate_products: str, user_preference: str = "") -> dict:
    prompt = PROMPT_TEMPLATE.format(
        current_product=current_product,
        user_preference=user_preference if user_preference else "None specified",
        candidate_products=candidate_products
    )
    result = call_llm_json(prompt)
    result["_source"] = "ai_generated"
    return result


if __name__ == "__main__":
    current = """
    Name: UrbanFit Running Shoes
    Price: $79.99
    Material: Breathable mesh, rubber outsole (partly synthetic)
    Weight: 260g
    Eco-rating: Not specified
    """

    candidates = """
    Product A:
    Name: EcoStride Runners
    Price: $89.99
    Material: Recycled ocean plastic upper, natural rubber outsole
    Weight: 270g
    Eco-rating: Made from 80% recycled materials

    Product B:
    Name: SpeedLite Racers
    Price: $99.99
    Material: Synthetic mesh, carbon fiber plate
    Weight: 210g
    Eco-rating: Not specified

    Product C:
    Name: BudgetRun Basics
    Price: $39.99
    Material: Standard synthetic mesh
    Weight: 280g
    Eco-rating: Not specified
    """

    result = recommend_alternatives(current, candidates, user_preference="eco-friendly")

    import json
    print(json.dumps(result, indent=2))
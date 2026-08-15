"""
Converts a Django `Product` model instance into the plain-text block every
AI function (ingredient analysis, summary, comparison, recommendations,
chatbot) expects as input. This is the DB-backed equivalent of
ml/data_loader.py's format_product_for_prompt(), which worked off a CSV row.
"""


def format_product_for_prompt(product) -> str:
    ingredients_or_materials = product.ingredients or product.materials or "N/A"

    nutrition_bits = []
    if product.calories is not None:
        nutrition_bits.append(f"Calories: {product.calories}")
    if product.protein is not None:
        nutrition_bits.append(f"Protein: {product.protein}g")
    if product.fat is not None:
        nutrition_bits.append(f"Fat: {product.fat}g")
    if product.carbohydrates is not None:
        nutrition_bits.append(f"Carbohydrates: {product.carbohydrates}g")

    nutrition_line = ", ".join(nutrition_bits) if nutrition_bits else "N/A"

    return f"""
    Name: {product.name}
    Brand: {product.brand}
    Category: {product.category}
    Price: {product.price if product.price is not None else 'N/A'}
    Rating: {product.rating}
    Description: {product.description or 'N/A'}
    Ingredients/Materials: {ingredients_or_materials}
    Nutrition: {nutrition_line}
    """.strip()

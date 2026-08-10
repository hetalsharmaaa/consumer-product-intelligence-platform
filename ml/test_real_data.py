from data_loader import get_product_by_id, format_product_for_prompt
from ingredient_analysis import analyze_ingredients

product = get_product_by_id("P0001")
print("Raw product data:", product)
print()

product_text = format_product_for_prompt(product)
print("Formatted for AI:")
print(product_text)
print()

result = analyze_ingredients(product["name"], product["ingredients"])

import json
print("AI result:")
print(json.dumps(result, indent=2))
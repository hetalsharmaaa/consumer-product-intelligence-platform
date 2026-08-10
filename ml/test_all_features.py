import json
from data_loader import get_product_by_id, format_product_for_prompt
from product_summary import summarize_product
from product_comparison import compare_products
from recommendations import recommend_alternatives
from chatbot import ProductChatbot
from barcode_scanner import scan_barcode

# --- Product Summary ---
product1 = get_product_by_id("P0001")
text1 = format_product_for_prompt(product1)
print("=== PRODUCT SUMMARY ===")
print(json.dumps(summarize_product(text1), indent=2))
print()

# --- Product Comparison (needs 2 real products) ---
product2 = get_product_by_id("P0002")
text2 = format_product_for_prompt(product2)
print("=== PRODUCT COMPARISON ===")
combined = f"Product 1:\n{text1}\n\nProduct 2:\n{text2}"
print(json.dumps(compare_products(combined, user_priority="price"), indent=2))
print()

# --- Recommendations (needs current + candidates) ---
product3 = get_product_by_id("P0003")
text3 = format_product_for_prompt(product3)
print("=== RECOMMENDATIONS ===")
candidates = f"Product A:\n{text2}\n\nProduct B:\n{text3}"
print(json.dumps(recommend_alternatives(text1, candidates, user_preference="cheaper"), indent=2))
print()

# --- Chatbot ---
print("=== CHATBOT ===")
bot = ProductChatbot(text1)
print("Q: What ingredients does this contain?")
print("A:", bot.ask("What ingredients does this contain?"))
print()

# --- Barcode lookup using real barcode from CSV ---
print("=== BARCODE LOOKUP ===")
real_barcode = str(product1["barcode"])
print(f"Looking up barcode: {real_barcode}")
from data_loader import get_product_by_barcode
found = get_product_by_barcode(real_barcode)
print("Found:", found["name"] if found else "Not found")
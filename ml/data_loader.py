import pandas as pd

_df = None  


def load_products(csv_path: str = "products_catalog.csv") -> pd.DataFrame:
    global _df
    if _df is None:
        _df = pd.read_csv(csv_path)
    return _df


def get_product_by_id(product_id, csv_path: str = "products_catalog.csv") -> dict:
    df = load_products(csv_path)
    row = df[df["Product id"] == product_id]
    if row.empty:
        return None
    return row.iloc[0].to_dict()


def get_product_by_barcode(barcode: str, csv_path: str = "products_catalog.csv") -> dict:
    df = load_products(csv_path)
    row = df[df["barcode"].astype(str) == str(barcode)]
    if row.empty:
        return None
    return row.iloc[0].to_dict()


def format_product_for_prompt(product: dict) -> str:
    """
    Converts a product row (dict) into the plain-text block
    every AI function (ingredient analysis, summary, comparison,
    recommendations, chatbot) expects as input.
    """
    return f"""
    Name: {product.get('name', 'N/A')}
    Brand: {product.get('brand', 'N/A')}
    Category: {product.get('category', 'N/A')}
    Price: {product.get('price', 'N/A')}
    Rating: {product.get('rating', 'N/A')}
    Description: {product.get('description', 'N/A')}
    Ingredients/Materials: {product.get('ingredients', product.get('materials', 'N/A'))}
    """.strip()
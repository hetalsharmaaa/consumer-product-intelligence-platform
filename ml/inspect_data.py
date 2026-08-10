import pandas as pd

df = pd.read_csv("products_catalog.csv")

print("Columns found:", list(df.columns))
print("\nRow count:", len(df))
print("\nFirst row as dict:")
print(df.iloc[0].to_dict())
print("\nMissing values per column:")
print(df.isnull().sum())
import csv
from decimal import Decimal
from pathlib import Path

from django.core.management.base import BaseCommand
from products.models import Product


class Command(BaseCommand):
    help = "Import products from ml/products_catalog.csv"

    def handle(self, *args, **options):
        csv_path = (
            Path(__file__).resolve().parents[4]
            / "ml"
            / "products_catalog.csv"
        )

        if not csv_path.exists():
            self.stdout.write(
                self.style.ERROR(
                    f"CSV file not found: {csv_path}"
                )
            )
            return

        created_count = 0
        updated_count = 0

        with csv_path.open(
            mode="r",
            encoding="utf-8-sig",
            newline=""
        ) as file:

            reader = csv.DictReader(file)

            for row in reader:
                barcode = row["barcode"].strip()

                product, created = Product.objects.update_or_create(
                    barcode=barcode,
                    defaults={
                        "name": row["name"].strip(),
                        "brand": row["brand"].strip(),
                        "category": row["category"].strip(),
                        "description": row["description"].strip(),
                        "ingredients": row["ingredients"].strip(),
                        "materials": row["materials"].strip(),
                        "price": Decimal(row["price"].strip()),
                        "rating": float(row["rating"].strip()),
                    },
                )

                if created:
                    created_count += 1
                else:
                    updated_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Created: {created_count}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Updated: {updated_count}"
            )
        )

        self.stdout.write(
            self.style.SUCCESS(
                f"Total products: {Product.objects.count()}"
            )
        )
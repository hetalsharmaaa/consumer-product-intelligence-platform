from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'brand',
        'barcode',
        'category',
        'price',
        'rating',
    )

    search_fields = (
        'name',
        'brand',
        'barcode',
        'category',
    )

    list_filter = (
        'category',
        'brand',
    )
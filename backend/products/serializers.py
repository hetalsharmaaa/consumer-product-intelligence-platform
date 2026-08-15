from rest_framework import serializers

from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'brand',
            'barcode',
            'category',
            'description',
            'ingredients',
            'materials',
            'calories',
            'protein',
            'fat',
            'carbohydrates',
            'price',
            'image_url',
            'rating',
            'created_at',
            'updated_at',
        ]
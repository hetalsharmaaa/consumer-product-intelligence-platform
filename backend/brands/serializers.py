from rest_framework import serializers

from .models import Brand


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = [
            'id',
            'name',
            'description',
            'website',
            'country',
            'sustainability_info',
            'created_at',
            'updated_at',
        ]
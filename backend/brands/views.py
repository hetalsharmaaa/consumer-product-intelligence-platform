from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response

from products.models import Product
from products.serializers import ProductSerializer

from .models import Brand
from .serializers import BrandSerializer


# Get all brands
@api_view(['GET'])
def get_brands(request):

    # Keep the brand catalog synchronized with product data.
    product_brands = Product.objects.exclude(brand='').values_list('brand', flat=True).distinct()
    existing = {b.name.lower() for b in Brand.objects.all()}
    for brand_name in product_brands:
        if brand_name.lower() not in existing:
            Brand.objects.create(name=brand_name)
            existing.add(brand_name.lower())

    brands = Brand.objects.all().order_by('name')
    serializer = BrandSerializer(brands, many=True)

    return Response({
        'count': brands.count(),
        'brands': serializer.data
    })


# Get single brand
@api_view(['GET'])
def get_brand(request, brand_id):

    brand = get_object_or_404(
        Brand,
        id=brand_id
    )

    serializer = BrandSerializer(brand)

    return Response(serializer.data)


# Get products belonging to a brand
@api_view(['GET'])
def get_brand_products(request, brand_id):

    brand = get_object_or_404(
        Brand,
        id=brand_id
    )

    products = Product.objects.filter(
        brand__iexact=brand.name
    ).order_by(
        '-rating',
        'price'
    )

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'brand_id': brand.id,
        'brand_name': brand.name,
        'count': products.count(),
        'products': serializer.data
    })
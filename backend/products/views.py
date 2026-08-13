from django.db.models import Q
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Product
from .serializers import ProductSerializer

from search_history.models import SearchHistory


# ============================================================
# GET ALL PRODUCTS
# ============================================================

@api_view(['GET'])
def get_products(request):

    products = Product.objects.all().order_by(
        '-rating',
        'price'
    )

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'count': products.count(),
        'products': serializer.data
    })


# ============================================================
# SEARCH PRODUCTS
# ============================================================

@api_view(['GET'])
def search_products(request):

    query = request.GET.get('q', '').strip()

    if not query:
        return Response(
            {
                'error':
                'Please provide a search query using ?q='
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Save search history for logged-in users
    if request.user.is_authenticated:

        SearchHistory.objects.create(
            user=request.user,
            search_query=query
        )

    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(brand__icontains=query) |
        Q(category__icontains=query) |
        Q(barcode__icontains=query)
    ).order_by(
        '-rating',
        'price'
    )

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'query': query,
        'count': products.count(),
        'products': serializer.data
    })


# ============================================================
# SMART SEARCH
# ============================================================

@api_view(['GET'])
def smart_search(request):

    query = request.GET.get('q', '').strip()

    if not query:
        return Response(
            {
                'error':
                'Please provide a search query using ?q='
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Save search history
    if request.user.is_authenticated:

        SearchHistory.objects.create(
            user=request.user,
            search_query=query
        )

    products = Product.objects.filter(
        Q(name__icontains=query) |
        Q(brand__icontains=query) |
        Q(category__icontains=query) |
        Q(description__icontains=query) |
        Q(ingredients__icontains=query) |
        Q(barcode__icontains=query)
    )

    # Exact name/brand matches first
    exact_matches = products.filter(
        Q(name__iexact=query) |
        Q(brand__iexact=query)
    )

    other_matches = products.exclude(
        id__in=exact_matches.values_list(
            'id',
            flat=True
        )
    )

    products = list(
        exact_matches.order_by(
            '-rating',
            'price'
        )
    ) + list(
        other_matches.order_by(
            '-rating',
            'price'
        )
    )

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'query': query,
        'count': len(products),
        'products': serializer.data
    })


# ============================================================
# GET SINGLE PRODUCT
# ============================================================

@api_view(['GET'])
def get_product(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    serializer = ProductSerializer(product)

    return Response(serializer.data)


# ============================================================
# GET PRODUCT BY BARCODE
# ============================================================

@api_view(['GET'])
def get_product_by_barcode(request, barcode):

    product = Product.objects.filter(
        barcode=barcode
    ).first()

    if not product:

        return Response(
            {
                'error':
                'Product with this barcode was not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    serializer = ProductSerializer(product)

    return Response(serializer.data)


# ============================================================
# COMPARE PRODUCTS
# ============================================================

@api_view(['GET'])
def compare_products(request):

    ids = request.GET.get(
        'ids',
        ''
    ).strip()

    if not ids:

        return Response(
            {
                'error':
                'Please provide product IDs using ?ids=1,2'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    try:

        product_ids = [
            int(product_id.strip())
            for product_id in ids.split(',')
        ]

    except ValueError:

        return Response(
            {
                'error':
                'Product IDs must be numbers'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    # Remove duplicate IDs
    unique_ids = list(
        dict.fromkeys(product_ids)
    )

    if len(unique_ids) < 2:

        return Response(
            {
                'error':
                'Please provide at least 2 product IDs'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(unique_ids) > 5:

        return Response(
            {
                'error':
                'You can compare a maximum of 5 products'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    products = Product.objects.filter(
        id__in=unique_ids
    )

    if products.count() != len(unique_ids):

        return Response(
            {
                'error':
                'One or more products were not found'
            },
            status=status.HTTP_404_NOT_FOUND
        )

    product_map = {
        product.id: product
        for product in products
    }

    ordered_products = [
        product_map[product_id]
        for product_id in unique_ids
    ]

    serializer = ProductSerializer(
        ordered_products,
        many=True
    )

    return Response({
        'message':
        'Products compared successfully',

        'count':
        len(ordered_products),

        'products':
        serializer.data
    })


# ============================================================
# ANALYZE INGREDIENTS
# ============================================================

@api_view(['GET'])
def analyze_ingredients(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    if not product.ingredients:

        return Response({

            'product_id':
            product.id,

            'product_name':
            product.name,

            'ingredients':
            [],

            'ingredient_count':
            0,

            'message':
            'No ingredient information available'
        })

    ingredients = [

        ingredient.strip()

        for ingredient
        in product.ingredients.split(',')

        if ingredient.strip()
    ]

    return Response({

        'product_id':
        product.id,

        'product_name':
        product.name,

        'ingredients':
        ingredients,

        'ingredient_count':
        len(ingredients),

        'message':
        'Ingredient information retrieved successfully'
    })
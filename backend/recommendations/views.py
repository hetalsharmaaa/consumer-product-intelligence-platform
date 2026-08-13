from django.db.models import Q

from rest_framework.decorators import api_view
from rest_framework.response import Response

from products.models import Product
from products.serializers import ProductSerializer

from search_history.models import SearchHistory
from wishlist.models import Wishlist


# Get personalized recommendations
@api_view(['GET'])
def get_recommendations(request):

    # Check authentication
    if not request.user.is_authenticated:
        return Response(
            {
                'error': 'Authentication required'
            },
            status=401
        )

    user = request.user

    # Get user's recent search history
    search_history = SearchHistory.objects.filter(
        user=user
    ).order_by('-searched_at')[:10]

    # Get user's wishlist
    wishlist_items = Wishlist.objects.filter(
        user=user
    )

    # If user has no history and no wishlist,
    # show popular products
    if not search_history.exists() and not wishlist_items.exists():

        products = Product.objects.all().order_by(
            '-rating',
            'price'
        )[:10]

        serializer = ProductSerializer(
            products,
            many=True
        )

        return Response({
            'message': 'Showing popular products',
            'recommendation_type': 'popular',
            'count': products.count(),
            'products': serializer.data
        })

    # Collect categories and brands
    # from user's search history
    categories = set()
    brands = set()

    for search in search_history:

        query = search.search_query.strip()

        if not query:
            continue

        matching_products = Product.objects.filter(
            Q(name__icontains=query) |
            Q(brand__icontains=query) |
            Q(category__icontains=query)
        )

        for product in matching_products:

            if product.category:
                categories.add(product.category)

            if product.brand:
                brands.add(product.brand)

    # Collect categories and brands
    # from user's wishlist
    for wishlist_item in wishlist_items:

        product = wishlist_item.product

        if product.category:
            categories.add(product.category)

        if product.brand:
            brands.add(product.brand)

    # Build recommendation filter
    recommendation_filter = Q()

    if categories:

        recommendation_filter |= Q(
            category__in=categories
        )

    if brands:

        recommendation_filter |= Q(
            brand__in=brands
        )

    # Find recommended products
    if recommendation_filter:

        products = Product.objects.filter(
            recommendation_filter
        ).exclude(
            wishlisted_by__user=user
        ).order_by(
            '-rating',
            'price'
        ).distinct()

    else:

        products = Product.objects.all().order_by(
            '-rating',
            'price'
        )

    # Limit recommendations
    products = products[:10]

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'message': 'Personalized recommendations generated successfully',
        'recommendation_type': 'personalized',
        'count': products.count(),
        'based_on': {
            'search_history_count': search_history.count(),
            'wishlist_count': wishlist_items.count(),
            'categories': list(categories),
            'brands': list(brands)
        },
        'products': serializer.data
    })
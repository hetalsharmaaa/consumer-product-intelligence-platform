from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from .models import Wishlist
from .serializers import WishlistSerializer


# Get user's wishlist
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_wishlist(request):

    wishlist_items = Wishlist.objects.filter(
        user=request.user
    ).select_related('product')

    serializer = WishlistSerializer(
        wishlist_items,
        many=True
    )

    return Response(serializer.data)


# Add product to wishlist
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_wishlist(request):

    product_id = request.data.get('product_id')

    if not product_id:
        return Response(
            {'error': 'product_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        product = Product.objects.get(id=product_id)

    except Product.DoesNotExist:
        return Response(
            {'error': 'Product not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist_item, created = Wishlist.objects.get_or_create(
        user=request.user,
        product=product
    )

    serializer = WishlistSerializer(wishlist_item)

    if not created:
        return Response(
            {
                'message': 'Product is already in wishlist',
                'wishlist': serializer.data
            },
            status=status.HTTP_200_OK
        )

    return Response(
        {
            'message': 'Product added to wishlist',
            'wishlist': serializer.data
        },
        status=status.HTTP_201_CREATED
    )


# Remove product from wishlist
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_from_wishlist(request, product_id):

    wishlist_item = Wishlist.objects.filter(
        user=request.user,
        product_id=product_id
    ).first()

    if not wishlist_item:
        return Response(
            {'error': 'Product is not in wishlist'},
            status=status.HTTP_404_NOT_FOUND
        )

    wishlist_item.delete()

    return Response(
        {'message': 'Product removed from wishlist'},
        status=status.HTTP_200_OK
    )


# Check whether product is in wishlist
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_wishlist(request, product_id):

    exists = Wishlist.objects.filter(
        user=request.user,
        product_id=product_id
    ).exists()

    return Response({
        'product_id': product_id,
        'in_wishlist': exists
    })


# Clear entire wishlist
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def clear_wishlist(request):

    deleted_count, _ = Wishlist.objects.filter(
        user=request.user
    ).delete()

    return Response({
        'message': 'Wishlist cleared successfully',
        'deleted_count': deleted_count
    })
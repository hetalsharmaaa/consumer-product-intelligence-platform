from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from .models import Review
from .serializers import ReviewSerializer


# Get all reviews for a product
@api_view(['GET'])
def get_product_reviews(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    reviews = Review.objects.filter(
        product=product
    ).select_related('user').order_by('-created_at')

    serializer = ReviewSerializer(
        reviews,
        many=True
    )

    return Response({
        'product_id': product.id,
        'product_name': product.name,
        'count': reviews.count(),
        'reviews': serializer.data
    })


# Add review
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_review(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    rating = request.data.get('rating')
    comment = request.data.get('comment', '').strip()

    if rating is None:
        return Response(
            {'error': 'rating is required'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        rating = float(rating)
    except (TypeError, ValueError):
        return Response(
            {'error': 'rating must be a number'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if rating < 1 or rating > 5:
        return Response(
            {'error': 'rating must be between 1 and 5'},
            status=status.HTTP_400_BAD_REQUEST
        )

    review, created = Review.objects.update_or_create(
        user=request.user,
        product=product,
        defaults={
            'rating': rating,
            'comment': comment
        }
    )

    serializer = ReviewSerializer(review)

    return Response(
        {
            'message': (
                'Review added successfully'
                if created
                else 'Review updated successfully'
            ),
            'review': serializer.data
        },
        status=(
            status.HTTP_201_CREATED
            if created
            else status.HTTP_200_OK
        )
    )


# Update own review
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_review(request, review_id):

    review = get_object_or_404(
        Review,
        id=review_id,
        user=request.user
    )

    rating = request.data.get(
        'rating',
        review.rating
    )

    comment = request.data.get(
        'comment',
        review.comment
    )

    try:
        rating = float(rating)
    except (TypeError, ValueError):
        return Response(
            {'error': 'rating must be a number'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if rating < 1 or rating > 5:
        return Response(
            {'error': 'rating must be between 1 and 5'},
            status=status.HTTP_400_BAD_REQUEST
        )

    review.rating = rating
    review.comment = comment.strip()
    review.save()

    serializer = ReviewSerializer(review)

    return Response({
        'message': 'Review updated successfully',
        'review': serializer.data
    })


# Delete own review
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_review(request, review_id):

    review = get_object_or_404(
        Review,
        id=review_id,
        user=request.user
    )

    review.delete()

    return Response({
        'message': 'Review deleted successfully'
    })


# Get user's own reviews
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_reviews(request):

    reviews = Review.objects.filter(
        user=request.user
    ).select_related(
        'product'
    ).order_by('-created_at')

    serializer = ReviewSerializer(
        reviews,
        many=True
    )

    return Response({
        'count': reviews.count(),
        'reviews': serializer.data
    })
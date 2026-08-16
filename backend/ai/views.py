from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from products.models import Product
from products.serializers import ProductSerializer


@api_view(['GET'])
def ai_compare(request):

    ids = request.GET.get('ids', '')

    if not ids:
        return Response({
            'error': 'Product IDs are required. Example: ?ids=2,3'
        }, status=400)

    try:
        product_ids = [
            int(product_id.strip())
            for product_id in ids.split(',')
        ]
    except ValueError:
        return Response({
            'error': 'Product IDs must be numbers'
        }, status=400)

    products = Product.objects.filter(
        id__in=product_ids
    )

    if not products.exists():
        return Response({
            'error': 'No products found'
        }, status=404)

    serializer = ProductSerializer(
        products,
        many=True
    )

    return Response({
        'message': 'AI comparison data generated successfully',
        'comparison_type': 'ai_ready',
        'count': products.count(),
        'products': serializer.data,
        'ai_analysis': {
            'status': 'ready_for_ml_model',
            'message': 'ML model can be connected here.'
        }
    })


@api_view(['GET'])
def ingredient_summary(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    ingredients = [
        item.strip()
        for item in product.ingredients.split(',')
        if item.strip()
    ]

    return Response({
        'product_id': product.id,
        'product_name': product.name,
        'ingredients': ingredients,
        'ingredient_count': len(ingredients),
        'ai_summary': {
            'status': 'ready_for_ml_model',
            'message': 'AI ingredient analysis can be connected here.'
        }
    })


@api_view(['GET'])
def alternatives(request, product_id):

    product = get_object_or_404(
        Product,
        id=product_id
    )

    alternatives = Product.objects.filter(
        category=product.category
    ).exclude(
        id=product.id
    ).order_by(
        '-rating',
        'price'
    )[:10]

    serializer = ProductSerializer(
        alternatives,
        many=True
    )

    return Response({
        'message': 'Alternative products generated successfully',
        'based_on': {
            'product_id': product.id,
            'product_name': product.name,
            'category': product.category
        },
        'alternatives': serializer.data,
        'ai_analysis': {
            'status': 'ready_for_ml_model',
            'message': 'ML model can rank healthier and sustainable alternatives.'
        }
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def ai_chat(request):

    question = request.data.get(
        'question',
        ''
    ).strip()

    if not question:
        return Response({
            'error': 'question is required'
        }, status=400)

    return Response({
        'question': question,
        'answer': 'AI product assistant is ready for ML/LLM integration.',
        'status': 'ready_for_ai_model'
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def image_recognition(request):

    image = request.FILES.get('image')

    if not image:
        return Response({
            'error': 'image is required'
        }, status=400)

    return Response({
        'message': 'Image received successfully',
        'filename': image.name,
        'status': 'ready_for_ml_model',
        'ai_result': None
    })
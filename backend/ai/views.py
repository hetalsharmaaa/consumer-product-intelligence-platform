from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from products.models import Product
from products.serializers import ProductSerializer

from .engine.llm_client import AIUnavailableError
from .engine.formatting import format_product_for_prompt
from .engine.ingredient_analysis import analyze_ingredients as ai_analyze_ingredients
from .engine.product_comparison import compare_products as ai_compare_products
from .engine.recommendations import recommend_alternatives as ai_recommend_alternatives
from .engine.chatbot import ask_chatbot
from .engine.barcode_scanner import scan_barcode_bytes


def _ai_unavailable_response(error: AIUnavailableError):
    return Response({
        'status': 'ai_unavailable',
        'message': str(error),
    }, status=503)


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

    if products.count() < 2:
        return Response({
            'error': 'Please provide at least 2 valid product IDs to compare'
        }, status=400)

    serializer = ProductSerializer(products, many=True)

    user_priority = request.GET.get('priority', '')
    products_data = "\n\n".join(
        f"Product {i + 1}:\n{format_product_for_prompt(p)}"
        for i, p in enumerate(products)
    )

    try:
        ai_result = ai_compare_products(products_data, user_priority=user_priority)
    except AIUnavailableError as e:
        return Response({
            'message': 'Products fetched, but AI comparison could not be generated',
            'count': products.count(),
            'products': serializer.data,
            'ai_analysis': {'status': 'ai_unavailable', 'message': str(e)},
        }, status=200)

    return Response({
        'message': 'AI comparison generated successfully',
        'comparison_type': 'ai_generated',
        'count': products.count(),
        'products': serializer.data,
        'ai_analysis': ai_result,
    })


@api_view(['GET'])
def ingredient_summary(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    ingredients_raw = product.ingredients or product.materials or ''
    ingredients = [
        item.strip()
        for item in ingredients_raw.replace(';', ',').split(',')
        if item.strip()
    ]

    base_payload = {
        'product_id': product.id,
        'product_name': product.name,
        'ingredients': ingredients,
        'ingredient_count': len(ingredients),
    }

    if not ingredients:
        base_payload['ai_summary'] = {
            'status': 'no_data',
            'message': 'No ingredient/material information available for this product.',
        }
        return Response(base_payload)

    try:
        ai_result = ai_analyze_ingredients(product.name, ingredients_raw)
    except AIUnavailableError as e:
        base_payload['ai_summary'] = {'status': 'ai_unavailable', 'message': str(e)}
        return Response(base_payload)

    base_payload['ai_summary'] = ai_result
    return Response(base_payload)


@api_view(['GET'])
def alternatives(request, product_id):

    product = get_object_or_404(Product, id=product_id)

    candidates = Product.objects.filter(
        category=product.category
    ).exclude(
        id=product.id
    ).order_by(
        '-rating',
        'price'
    )[:10]

    serializer = ProductSerializer(candidates, many=True)

    base_payload = {
        'message': 'Alternative products fetched successfully',
        'based_on': {
            'product_id': product.id,
            'product_name': product.name,
            'category': product.category,
        },
        'alternatives': serializer.data,
    }

    if not candidates.exists():
        base_payload['ai_analysis'] = {
            'status': 'no_data',
            'message': 'No other products in this category to compare against.',
        }
        return Response(base_payload)

    user_preference = request.GET.get('preference', '')
    current_product_text = format_product_for_prompt(product)
    candidates_text = "\n\n".join(
        f"Product {i + 1} - Name: {c.name}\n{format_product_for_prompt(c)}"
        for i, c in enumerate(candidates)
    )

    try:
        ai_result = ai_recommend_alternatives(
            current_product_text, candidates_text, user_preference=user_preference
        )
    except AIUnavailableError as e:
        base_payload['ai_analysis'] = {'status': 'ai_unavailable', 'message': str(e)}
        return Response(base_payload)

    base_payload['ai_analysis'] = ai_result
    return Response(base_payload)


@api_view(['POST'])
def ai_chat(request):

    question = request.data.get('question', '').strip()
    product_id = request.data.get('product_id')
    history = request.data.get('history', [])

    if not question:
        return Response({
            'error': 'question is required'
        }, status=400)

    product_data = None
    if product_id:
        product = get_object_or_404(Product, id=product_id)
        product_data = format_product_for_prompt(product)

    try:
        answer = ask_chatbot(question, product_data=product_data, history=history)
    except AIUnavailableError as e:
        return _ai_unavailable_response(e)

    return Response({
        'question': question,
        'answer': answer,
        'status': 'ok',
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def image_recognition(request):

    image = request.FILES.get('image')

    if not image:
        return Response({
            'error': 'image is required'
        }, status=400)

    try:
        scan_result = scan_barcode_bytes(image.read())
    except ValueError as e:
        return Response({'error': str(e)}, status=400)

    if not scan_result.get('found'):
        return Response({
            'message': 'No barcode detected in the image',
            'filename': image.name,
            'ai_result': scan_result,
        })

    product = Product.objects.filter(barcode=scan_result['barcode_data']).first()
    product_data = ProductSerializer(product).data if product else None

    return Response({
        'message': 'Barcode detected successfully',
        'filename': image.name,
        'ai_result': scan_result,
        'product': product_data,
    })

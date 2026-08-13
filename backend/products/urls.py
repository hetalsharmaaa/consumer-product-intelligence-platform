from django.urls import path

from .views import (
    get_products,
    search_products,
    smart_search,
    get_product,
    get_product_by_barcode,
    compare_products,
    analyze_ingredients,
)


urlpatterns = [

    path(
        '',
        get_products
    ),

    path(
        'search/',
        search_products
    ),

    path(
        'smart-search/',
        smart_search
    ),

    path(
        'compare/',
        compare_products
    ),

    path(
        'barcode/<str:barcode>/',
        get_product_by_barcode
    ),

    path(
        '<int:product_id>/ingredients/',
        analyze_ingredients
    ),

    path(
        '<int:product_id>/',
        get_product
    ),
]
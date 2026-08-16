from django.urls import path

from .views import (
    get_brands,
    get_brand,
    get_brand_products,
)


urlpatterns = [

    path(
        '',
        get_brands
    ),

    path(
        '<int:brand_id>/',
        get_brand
    ),

    path(
        '<int:brand_id>/products/',
        get_brand_products
    ),
]
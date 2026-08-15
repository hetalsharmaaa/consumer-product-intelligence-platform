from django.urls import path

from .views import (
    get_wishlist,
    add_to_wishlist,
    remove_from_wishlist,
    check_wishlist,
    clear_wishlist,
)


urlpatterns = [

    # Get wishlist
    path('', get_wishlist),

    # Add product
    path('add/', add_to_wishlist),

    # Remove product
    path(
        'remove/<int:product_id>/',
        remove_from_wishlist
    ),

    # Check product
    path(
        'check/<int:product_id>/',
        check_wishlist
    ),

    # Clear wishlist
    path(
        'clear/',
        clear_wishlist
    ),
]
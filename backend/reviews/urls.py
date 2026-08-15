from django.urls import path

from .views import (
    get_product_reviews,
    add_review,
    update_review,
    delete_review,
    my_reviews,
)


urlpatterns = [

    # Product reviews
    path(
        'product/<int:product_id>/',
        get_product_reviews
    ),

    # Add review
    path(
        'product/<int:product_id>/add/',
        add_review
    ),

    # Update review
    path(
        '<int:review_id>/update/',
        update_review
    ),

    # Delete review
    path(
        '<int:review_id>/delete/',
        delete_review
    ),

    # Current user's reviews
    path(
        'my/',
        my_reviews
    ),
]
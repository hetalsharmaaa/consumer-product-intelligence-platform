from django.contrib import admin
from django.urls import path, include


urlpatterns = [

    # Admin
    path(
        'admin/',
        admin.site.urls
    ),

    # Products
    path(
        'api/',
        include('products.urls')
    ),

    # Authentication
    path(
        'api/auth/',
        include('users.urls')
    ),

    # Wishlist
    path(
        'api/wishlist/',
        include('wishlist.urls')
    ),

    # Search History
    path(
        'api/search-history/',
        include('search_history.urls')
    ),

    # Brands
    path(
        'api/brands/',
        include('brands.urls')
    ),

    # Reviews
    path(
        'api/reviews/',
        include('reviews.urls')
    ),

    # Personalized Recommendations
    path(
        'api/recommendations/',
        include('recommendations.urls')
    ),

    # AI Intelligence
    path(
        'api/ai/',
        include('ai.urls')
    ),
]
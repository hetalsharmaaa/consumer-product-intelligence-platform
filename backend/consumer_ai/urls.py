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

# Catch-all route to serve React's index.html for any route not caught by API or Admin
# This enables React Router to handle client-side routing
from django.views.generic import TemplateView
from django.urls import re_path
urlpatterns += [
    re_path(r'^.*$', TemplateView.as_view(template_name='index.html')),
]
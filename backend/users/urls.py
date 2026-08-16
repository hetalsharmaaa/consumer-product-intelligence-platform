from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .views import register, profile


urlpatterns = [

    # User registration
    path('register/', register),

    # User login
    path('login/', TokenObtainPairView.as_view()),

    # Refresh access token
    path('token/refresh/', TokenRefreshView.as_view()),

    # User profile
    path('profile/', profile),
]
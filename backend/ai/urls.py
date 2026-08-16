from django.urls import path

from .views import (
    ai_compare,
    ingredient_summary,
    alternatives,
    ai_chat,
    image_recognition,
)


urlpatterns = [
    path('compare/', ai_compare),
    path('ingredients/<int:product_id>/', ingredient_summary),
    path('alternatives/<int:product_id>/', alternatives),
    path('chat/', ai_chat),
    path('image-recognition/', image_recognition),
]
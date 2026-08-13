from django.urls import path

from .views import (
    get_search_history,
    delete_search_history,
    clear_search_history,
)


urlpatterns = [

    path(
        '',
        get_search_history
    ),

    path(
        '<int:search_id>/delete/',
        delete_search_history
    ),

    path(
        'clear/',
        clear_search_history
    ),
]
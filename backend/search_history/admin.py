from django.contrib import admin
from .models import SearchHistory


@admin.register(SearchHistory)
class SearchHistoryAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'search_query',
        'searched_at',
    )

    search_fields = (
        'user__username',
        'search_query',
    )

    list_filter = (
        'searched_at',
    )
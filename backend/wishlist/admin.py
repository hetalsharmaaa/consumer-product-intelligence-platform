from django.contrib import admin
from .models import Wishlist


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):

    list_display = (
        'id',
        'user',
        'product',
        'created_at',
    )

    search_fields = (
        'user__username',
        'product__name',
        'product__brand',
    )

    list_filter = (
        'created_at',
    )
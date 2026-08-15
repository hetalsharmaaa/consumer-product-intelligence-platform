from django.db import models
from django.contrib.auth.models import User

from products.models import Product


class Review(models.Model):

    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='reviews'
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='product_reviews'
    )

    rating = models.PositiveIntegerField()

    comment = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['product', 'user'],
                name='unique_product_user_review'
            )
        ]

        ordering = ['-created_at']

    def __str__(self):
        return f'{self.product.name} - {self.user.username}'
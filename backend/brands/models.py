from django.db import models


class Brand(models.Model):
    name = models.CharField(
        max_length=200,
        unique=True
    )

    description = models.TextField(
        blank=True
    )

    website = models.URLField(
        blank=True
    )

    country = models.CharField(
        max_length=100,
        blank=True
    )

    sustainability_info = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return self.name
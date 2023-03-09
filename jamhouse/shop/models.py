from django.db import models
from django.db.models import Q

class Set(models.Model):
    description = models.CharField(max_length=128)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    items = models.ManyToManyField("Item", through="Item_sets", blank=True)

    def __str__(self):
        return self.description

    class Meta:
        verbose_name_plural = "Sets"

    def sold(self):
        return bool(self.items.filter(sold_at__isnull=False).count())


class Item(models.Model):
    description = models.CharField(max_length=128)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    sold_at = models.DateTimeField(null=True, blank=True)
    sets = models.ManyToManyField("Set", blank=True)
    repositories = models.ManyToManyField("Repository", blank=True)

    def __str__(self):
        return self.description

    def sold(self):
        return bool(self.sold_at)

class Repository(models.Model):
    class Meta:
        verbose_name_plural = "repositories"
    name = models.CharField(max_length=128)
    items = models.ManyToManyField("Item", blank=True)
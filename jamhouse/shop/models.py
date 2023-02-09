from django.db import models

class Set(models.Model):
    set_desc = models.CharField(max_length=128)
    set_price = models.DecimalField(decimal_places=2, max_digits=10)
    
class Item(models.Model):
    item_desc = models.CharField(max_length=128)
    item_price = models.DecimalField(decimal_places=2, max_digits=10)
    item_sold = models.DateTimeField(null=True, blank=True)
    item_sets = models.ManyToManyField(Set)

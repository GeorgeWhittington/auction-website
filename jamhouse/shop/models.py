import random
from decimal import Decimal
from enum import IntEnum
from datetime import datetime, timezone
from django.db import models
from django.db.models import Q
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator

class CheckoutInfo(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    addr_address = models.CharField(max_length=128, blank=True, null=True)
    addr_city = models.CharField(max_length=128, blank=True, null=True)
    addr_country = models.CharField(max_length=128, blank=True, null=True)
    addr_county = models.CharField(max_length=128, blank=True, null=True)
    addr_postcode = models.CharField(max_length=10, blank=True, null=True)

    card_number = models.IntegerField(blank=True, null=True)
    card_name = models.CharField(max_length=128, blank=True, null=True)
    card_exp_month = models.IntegerField(blank=True, null=True)
    card_exp_year = models.IntegerField(blank=True, null=True)
    card_cvc = models.IntegerField(blank=True, null=True)

class Set(models.Model):
    description = models.CharField(max_length=128)
    price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(Decimal('0.01'))])
    archived = models.BooleanField(default=False)
    items = models.ManyToManyField("Item", through="Item_sets", blank=True)

    def __str__(self):
        return self.description

    class Meta:
        verbose_name_plural = "Sets"

    def sold(self):
        return bool(self.items.filter(sold_at__isnull=False).count())

    def price_individual_items(self):
        total = Decimal(0.0)
        set_item_qs = Item.objects.filter(sets__in=[self.id,], sold_at__isnull=True)
        for i in set_item_qs.all():
            total += i.price
        return total
    
    def create_replacement(self):
        if self.archived:
            # A replacement set has already been created
            return

        if not self.sold():
            # don't need to create a replacement set if this one isn't sold
            return

        print(f"replacing items in set {self.id}")

        sold_qs = self.items.filter(sold_at__isnull=False).all()
        unsold_qs = self.items.filter(sold_at__isnull=True).all()

        replacement_items = []

        for item in sold_qs:
            candidate_qs = Item.objects.filter(sold_at__isnull=True, description=item.description)
            candidate_qs = candidate_qs.exclude(id__in=[i.id for i in replacement_items])
            candidate_qs = candidate_qs.exclude(id__in=[i.id for i in unsold_qs]).all()

            print(f"set {self.id}: candidate replacements {candidate_qs}")

            if len(candidate_qs) == 0:
                # Can't replace an item in the set
                return

            replacement_items.append(candidate_qs[0])

        new_set = Set.objects.create(
            description=self.description,
            price=self.price)

        new_set.save()
        new_set.items.set(list(list(unsold_qs) + replacement_items))
        new_set.save()

        self.archived = True
        self.save()

        return new_set

class Item(models.Model):
    description = models.CharField(max_length=128)
    price = models.DecimalField(decimal_places=2, max_digits=10, validators=[MinValueValidator(Decimal('0.01'))])
    sold_at = models.DateTimeField(null=True, blank=True)
    sets = models.ManyToManyField("Set", blank=True)
    repositories = models.ManyToManyField("Repository", blank=True)
    images = models.ManyToManyField("Image", blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.description

    def sold(self):
        return bool(self.sold_at)

class Repository(models.Model):
    class Meta:
        verbose_name_plural = "repositories"

    name = models.CharField(max_length=128)
    items = models.ManyToManyField("Item", through="Item_repositories", blank=True)

    def __str__(self) -> str:
        return self.name

class Image(models.Model):
    alt = models.TextField(blank=False)
    img = models.ImageField(upload_to="", blank=False)

    def __str__(self) -> str:
        return str(self.img)

class OrderStatus(IntEnum):
    OPEN = 0
    PENDING = 1
    COMPLETE = 3
    CANCELLED = 4

    @classmethod
    def choices(cls):
        return [(key.value, key.name) for key in cls]

def generate_order_number():
        while True:
            num = random.randint(100000, 999999)
            if not Order.objects.filter(number=num):
                return num
            
class Order(models.Model):
    number = models.IntegerField(default=generate_order_number, null=False, unique=False)
    creation_time = models.DateTimeField(default=datetime.now, blank=True)
    user = models.ForeignKey(User, null=True, on_delete=models.DO_NOTHING)
    items = models.ManyToManyField(Item, blank=True)
    sets = models.ManyToManyField(Set, blank=True)
    status = models.IntegerField(choices=OrderStatus.choices(), default=OrderStatus.OPEN)

    def update_status(self):
        now = datetime.now(timezone.utc)
        hour_diff = (abs(now - self.creation_time).seconds) / 3600

        if self.status == OrderStatus.PENDING and hour_diff >= 12:
            self.status = OrderStatus.COMPLETE
            self.save()
        elif self.status == OrderStatus.OPEN and hour_diff >= 6:
            self.status = OrderStatus.PENDING
            self.save()
        
        
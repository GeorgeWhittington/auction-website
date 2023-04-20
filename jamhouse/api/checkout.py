from enum import IntEnum
from decimal import Decimal
from datetime import datetime
from shop.models import Item, Set
from django.http import JsonResponse

class CheckoutValidationStatus(IntEnum):
    SUCCESS = 0
    ITEMS_ALREADY_PURCHASED = 1
    SETS_PURCHASED = 2

class CheckoutValidation:
    def __init__(self, status):
        self.status = status
        self.ids = []

    def to_response(self):
        print('to_response', self.ids)
        status_code = 200 if self.status == CheckoutValidationStatus.SUCCESS else 400
        return JsonResponse({'status' : self.status, 'ids' : list(set(self.ids))}, status=status_code)

    def __str__(self):
        return f'Status:{self.status} Ids:{self.ids}'
    
class CheckoutData:
    item_price = Decimal(0.0)
    set_price = Decimal(0.0)
    set_item_price = Decimal(0.0)

def checkout_validate_items(item_ids: list):
    item_qs = Item.objects.filter(id__in=item_ids)
    
    v = CheckoutValidation(CheckoutValidationStatus.SUCCESS)

    for item in item_qs:
        print(v.ids)
        if item.sold_at != None:
            v.status = CheckoutValidationStatus.ITEMS_ALREADY_PURCHASED
            v.ids.append(item.id)
            

    return v

def checkout_validate_sets(set_ids: list):
    v = CheckoutValidation(CheckoutValidationStatus.SUCCESS)

    set_qs = Set.objects.filter(id__in=set_ids)
    set_item_qs = Item.objects.filter(sets__in=set_ids)

    for set in set_qs:
        if set.sold():
           v.status = CheckoutValidationStatus.SETS_PURCHASED
           v.ids.append(set.id)

    if v.status != CheckoutValidationStatus.SUCCESS:
        return v
    
    for item in set_item_qs:
        if item.sold_at != None:
            v.status = CheckoutValidationStatus.ITEMS_ALREADY_PURCHASED
            v.ids.append(item.id)

    return v

def checkout_calculate(item_ids: list, set_ids: list) -> CheckoutData:
    ret = CheckoutData()
    
    # validate items
    validation = checkout_validate_items(item_ids)
    if validation.status != CheckoutValidationStatus.SUCCESS:
        return (validation, None)
    
    # validate sets
    validation = checkout_validate_sets(set_ids)
    if validation.status != CheckoutValidationStatus.SUCCESS:
        return (validation, None)
    
    # Calculate the price of items
    item_qs = Item.objects.filter(id__in=item_ids, sold_at__isnull=True)
    for i in item_qs:
       ret.item_price += i.price

    # Calculate the price of sets
    set_qs = Set.objects.filter(id__in=set_ids)

    for s in set_qs:
        ret.set_price += s.price

    # Calculate the price of each set item
    set_item_qs = Item.objects.filter(sets__in=set_ids, sold_at__isnull=True)
    for i in set_item_qs:
       ret.set_item_price += i.price

    return (CheckoutValidation(CheckoutValidationStatus.SUCCESS), ret)

def checkout_buy_item(item: Item):
    item.sold_at = datetime.now()
    item.save()

def checkout_buy(item_ids: list, set_ids: list) -> bool:

    # validate items
    validation = checkout_validate_items(item_ids)
    if validation.status != CheckoutValidationStatus.SUCCESS:
        return validation
    
    # validate sets
    validation = checkout_validate_sets(set_ids)
    if validation.status != CheckoutValidationStatus.SUCCESS:
        return validation
    
    # Mark each item as sold
    item_qs = Item.objects.filter(id__in=item_ids, sold_at__isnull=True)
    set_item_qs = Item.objects.filter(sets__in=set_ids, sold_at__isnull=True)
    
    for i in item_qs:
        checkout_buy_item(i)

    for i in set_item_qs:
        checkout_buy_item(i)

    return CheckoutValidation(CheckoutValidationStatus.SUCCESS)

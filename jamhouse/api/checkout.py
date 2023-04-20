from decimal import Decimal
from datetime import datetime
from shop.models import Item, Set
from api.validate import Validation, ValidationStatus
 
class CheckoutData:
    item_price = Decimal(0.0)
    set_price = Decimal(0.0)
    set_item_price = Decimal(0.0)

def checkout_validate_items(item_ids: list):
    item_qs = Item.objects.filter(id__in=item_ids)
    
    v = Validation(ValidationStatus.SUCCESS)

    for item in item_qs:
        print(v.ids)
        if item.sold_at != None:
            v.status = ValidationStatus.ITEMS_ALREADY_PURCHASED
            v.ids.append(item.id)
            
    return v

def checkout_validate_sets(set_ids: list):
    v = Validation(ValidationStatus.SUCCESS)

    set_qs = Set.objects.filter(id__in=set_ids)
    set_item_qs = Item.objects.filter(sets__in=set_ids)

    for set in set_qs:
        if set.sold():
           v.status = ValidationStatus.SETS_PURCHASED
           v.ids.append(set.id)

    if v.status != ValidationStatus.SUCCESS:
        return v
    
    for item in set_item_qs:
        if item.sold_at != None:
            v.status = ValidationStatus.ITEMS_ALREADY_PURCHASED
            v.ids.append(item.id)

    return v

def checkout_calculate(item_ids: list, set_ids: list) -> CheckoutData:
    ret = CheckoutData()
    
    # validate items
    validation = checkout_validate_items(item_ids)
    if validation.status != ValidationStatus.SUCCESS:
        return (validation, None)
    
    # validate sets
    validation = checkout_validate_sets(set_ids)
    if validation.status != ValidationStatus.SUCCESS:
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

    return (Validation(ValidationStatus.SUCCESS), ret)

def checkout_buy_item(item: Item):
    item.sold_at = datetime.now()
    item.save()

def checkout_buy(item_ids: list, set_ids: list) -> bool:

    # validate items
    validation = checkout_validate_items(item_ids)
    if validation.status != ValidationStatus.SUCCESS:
        return validation
    
    # validate sets
    validation = checkout_validate_sets(set_ids)
    if validation.status != ValidationStatus.SUCCESS:
        return validation
    
    # Mark each item as sold
    item_qs = Item.objects.filter(id__in=item_ids, sold_at__isnull=True)
    set_item_qs = Item.objects.filter(sets__in=set_ids, sold_at__isnull=True)
    
    for i in item_qs:
        checkout_buy_item(i)

    for i in set_item_qs:
        checkout_buy_item(i)

    return Validation(ValidationStatus.SUCCESS)

from decimal import Decimal
from datetime import datetime
from shop.models import Item, Set

class CheckoutData:
    item_price = Decimal(0.0)
    set_price = Decimal(0.0)
    set_item_price = Decimal(0.0)

def checkout_validate_items(item_ids: list):
    item_qs = Item.objects.filter(id__in=item_ids, sold_at__isnull=True)
    
    if len(item_ids) > len(item_qs):
        return (False, "Item(s) have already been purchased.")
    
    return (True, "Success")

def checkout_validate_sets(set_ids: list):
    set_qs = Set.objects.filter(id__in=set_ids)

    for set in set_qs:
        if set.sold():
           return ("False", "Sets(s) have already been purchased.")         
        
    return (True, "Success")

def checkout_calculate(item_ids: list, set_ids: list) -> CheckoutData:
    ret = CheckoutData()
    
    # Validate items & sets
    validated, msg = checkout_validate_items(item_ids)
    if not validated:
        return (validated, msg, None)
    
    validated, msg = checkout_validate_sets(set_ids)
    
    if not validated:
        return (validated, msg, None)
    
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

    return (True, "Success", ret)

def checkout_buy_item(item: Item):
    item.sold_at = datetime.now()
    item.save()

def checkout_buy(item_ids: list, set_ids: list) -> bool:

    # Validation
    validated, msg = checkout_validate_items(item_ids)
    if not validated:
        return (validated, msg)
    
    validated, msg = checkout_validate_sets(set_ids)
    if not validated:
        return (validated, msg)
    
    # Mark each item as sold
    item_qs = Item.objects.filter(id__in=item_ids, sold_at__isnull=True)
    set_item_qs = Item.objects.filter(sets__in=set_ids, sold_at__isnull=True)
    
    for i in item_qs:
        checkout_buy_item(i)

    for i in set_item_qs:
        checkout_buy_item(i)

    return (True, "Success")

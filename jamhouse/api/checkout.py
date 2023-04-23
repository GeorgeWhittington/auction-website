from decimal import Decimal
from shop.models import Item, Set, Order
from api.validate import Validation, ValidationStatus, validate_checkout_items, validate_checkout_sets

class CheckoutData:
    item_price = Decimal(0.0)
    set_price = Decimal(0.0)
    set_item_price = Decimal(0.0)

def checkout_calculate(item_ids: list, set_ids: list) -> CheckoutData:
    ret = CheckoutData()
    
    # validate items
    validation = validate_checkout_items(item_ids)
    if validation.status != ValidationStatus.SUCCESS:
        return (validation, None)
    
    # validate sets
    validation = validate_checkout_sets(set_ids)
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
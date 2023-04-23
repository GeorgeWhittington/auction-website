from enum import IntEnum
from django.http import JsonResponse
from datetime import datetime
from shop.models import Item, Set, Order

class ValidationStatus(IntEnum):
    SUCCESS = 0
    ITEMS_ALREADY_PURCHASED = 1
    SETS_PURCHASED = 2
    ADDR_INVALID_EMAIL = 10
    ADDR_INVALID_NAME = 11
    CARD_INVALID_NUMBER = 20
    CARD_INVALID_EXP = 21
    CARD_INVALID_CVC = 22

class Validation:
    def __init__(self, status):
        self.status = status
        self.ids = []

    def to_response(self):
        print('to_response', self.ids)
        status_code = 200 if self.status == ValidationStatus.SUCCESS else 400
        return JsonResponse({'status' : self.status, 'ids' : list(set(self.ids))}, status=status_code)

    def __str__(self):
        return f'Status:{self.status} Ids:{self.ids}'
    
def validate_card(num, name, mm, yy, cvc):

    # Check card num
    if len(num) < 8 or len(num) > 19:
        return Validation(ValidationStatus.CARD_INVALID_NUMBER)
    
    now = datetime.now()

    # check card expiry
    # TODO: check month!!
    if int("20" + yy) < now.year:
        return Validation(ValidationStatus.CARD_INVALID_EXP)
    
    if len(cvc) != 3:
        return Validation(ValidationStatus.CARD_INVALID_CVC)
    
    return Validation(ValidationStatus.SUCCESS)

def validate_address(email, fname, lname, address, city, country, county, postcode):
    
    if '@' not in email:
        return Validation(ValidationStatus.ADDR_INVALID_EMAIL)
    
    if len(fname) < 2 or len(lname) < 2:
        return Validation(ValidationStatus.ADDR_INVALID_NAME)
    
    return Validation(ValidationStatus.SUCCESS)

def validate_checkout_items(item_ids: list):
    item_qs = Item.objects.filter(id__in=item_ids)
    
    v = Validation(ValidationStatus.SUCCESS)

    for item in item_qs:
        print(v.ids)
        if item.sold_at != None:
            v.status = ValidationStatus.ITEMS_ALREADY_PURCHASED
            v.ids.append(item.id)
            
    return v

def validate_checkout_sets(set_ids: list):
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
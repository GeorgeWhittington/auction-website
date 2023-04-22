from enum import IntEnum
from django.http import JsonResponse
from datetime import datetime

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
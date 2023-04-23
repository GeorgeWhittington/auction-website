import json
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework.renderers import JSONRenderer
from rest_framework import permissions, views, generics
from api.serializers import RegisterSerializer, ItemSerializer, SetSerializer, ImageSerializer, OrderSerializer
from decimal import Decimal
from shop.models import Item, Set, Order, OrderStatus
from api.checkout import CheckoutData, checkout_calculate
from api.buy import buy
from api.validate import Validation, ValidationStatus, validate_card, validate_address

class Me(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    queryset = User.objects.none()

    def get(self, request):
        current_user = request.user

        res = {
            'username' : current_user.username,
            'is_staff' : current_user.is_staff,
            'is_superuser' : current_user.is_superuser,
            'email' : current_user.email
        }

        if 'v' in request.query_params:
            res['first_name'] = current_user.first_name
            res['last_name'] = current_user.last_name

        return JsonResponse(res, safe=False)
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class UpdateNameView(generics.CreateAPIView):
    queryset = User.objects.none()
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        print(request.data)
        if 'first_name' not in request.data or len(request.data['first_name']) == 0:
            return JsonResponse({'result' : 'failed', 'msg' : 'No First Name Provided'}, status=400)
        
        if 'last_name' not in request.data or len(request.data['last_name']) == 0:
            return JsonResponse({'result' : 'failed', 'msg' : 'No Last Name Provided'}, status=400)
        

        current_user = request.user
        current_user.first_name = request.data['first_name']
        current_user.last_name = request.data['last_name']
        current_user.save()

        return JsonResponse({'result' : 'success', 'msg' : 'Your Name has been updated.'}, status=200)
    
class UpdateEmailView(generics.CreateAPIView):
    queryset = User.objects.none()
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        if 'email' not in request.data:
            return JsonResponse({'result' : 'failed', 'msg' : 'No Email Address Provided'}, status=400)
        
        new_email = request.data['email']

        user_qs = User.objects.filter(email=new_email)

        if len(user_qs) != 0:
            return JsonResponse({'result' : 'failed', 'msg' : 'Email address is already in use.'}, status=400)
        
        current_user = request.user
        current_user.email = new_email
        current_user.save()

        return JsonResponse({'result' : 'success', 'msg' : 'Your email has been updated.'}, status=200)
    
class UpdatePasswordView(generics.CreateAPIView):
    queryset = User.objects.none()
    permission_classes = (permissions.IsAuthenticated,)
    
    def post(self, request):
        if 'password' not in request.data:
            return JsonResponse({'result' : 'failed', 'msg' : 'No Password Provided'}, status=400)
        
        new_password = request.data['password']

        current_user = request.user
        current_user.set_password(new_password)
        current_user.save()

        return JsonResponse({'result' : 'success', 'msg' : 'Your password has been updated.'}, status=200)

class CheckoutView(APIView):

    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        
        # get item and set ids from provided data
        item_ids = []
        set_ids = []

        if 'items' in request.data:
            item_ids = request.data['items']
        if 'sets' in request.data:
            set_ids = request.data['sets']

        validation, data = checkout_calculate(item_ids, set_ids)

        if validation.status != ValidationStatus.SUCCESS:
            return validation.to_response()
            
        item_qs = Item.objects.filter(id__in=item_ids)
        set_qs = Set.objects.filter(id__in=set_ids)

        set_images = []

        for s in Set.objects.filter(id__in=set_ids):
            if len(s.items.all()) > 0 and len(s.items.all()[0].images.all()) > 0:
                image = s.items.all()[0].images.all()[0]
                image_json = ImageSerializer(image, many=False, context={"request": request}).data
                set_images.append(image_json)

        items_serializer = ItemSerializer(item_qs, many=True, context={"request": request})
        items_json = JSONRenderer().render(items_serializer.data)
        sets_serializer = SetSerializer(set_qs, many=True, context={"request": request})

        for i, set_img in enumerate(set_images):
            sets_serializer.data[i]['images'] = set_img

        sets_json = JSONRenderer().render(sets_serializer.data)

        return JsonResponse(
            {
                'total_price'       : data.item_price + data.set_price, 
                'set_price'         : data.set_price,
                'item_price'        : data.item_price,
                'set_item_price'    : data.set_item_price,
                'subtotal_price'    : data.item_price + data.set_item_price,
                'items' : json.loads(items_json),
                'sets' : json.loads(sets_json)
            }, status=200)

class BuyView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        # get item and set ids from provided data
        item_ids = []
        set_ids = []

        print(request.data)
        
        card_validation = validate_card(request.data['paymentData']['cardNumber'],
                                        request.data['paymentData']['name'],
                                        request.data['paymentData']['expirationMonth'],
                                        request.data['paymentData']['expirationYear'],
                                        request.data['paymentData']['securityCode'])
        
        if card_validation.status != ValidationStatus.SUCCESS:
            return card_validation.to_response()
        
        address_validation = validate_address(request.data['addressData']['email'],
                                              request.data['addressData']['fName'],
                                              request.data['addressData']['lName'],
                                              request.data['addressData']['address'],
                                              request.data['addressData']['city'],
                                              request.data['addressData']['country'],
                                              request.data['addressData']['county'],
                                              request.data['addressData']['postcode'])
        
        if address_validation.status != ValidationStatus.SUCCESS:
            return address_validation.to_response()
        
        if 'items' in request.data:
            item_ids = request.data['items']
        if 'sets' in request.data:
            set_ids = request.data['sets']

        current_user = request.user
        validation = buy(item_ids, set_ids, current_user)

        return validation.to_response()

class OrderCancelView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):

        if 'id' not in request.data:
            return JsonResponse({'msg' : 'id required'}, status=400)
        
        order_id = request.data['id']

        order = Order.objects.get(id=order_id)

        order.status = OrderStatus.CANCELLED
        order.save()

        return JsonResponse({}, status=200)

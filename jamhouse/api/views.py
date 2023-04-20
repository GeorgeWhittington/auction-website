import json
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework.renderers import JSONRenderer
from rest_framework import permissions, views, generics
from api.serializers import RegisterSerializer, ItemSerializer, SetSerializer, ImageSerializer
from decimal import Decimal
from shop.models import Item, Set
from api.checkout import CheckoutData, checkout_calculate, checkout_buy

class Me(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    queryset = User.objects.none()

    def get(self, request):
        current_user = request.user

        res = {
            'username' : current_user.username,
            'is_staff' : current_user.is_staff,
            'is_superuser' : current_user.is_superuser,
        }

        return JsonResponse(res, safe=False)
    
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

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

        validated, msg, cdata = checkout_calculate(item_ids, set_ids)

        if not validated:
            return JsonResponse({'result' : validated, 'msg' : msg}, status=400)
            
        item_qs = Item.objects.filter(id__in=item_ids)
        set_qs = Set.objects.filter(id__in=set_ids)

        set_images = []

        for s in Set.objects.filter(id__in=set_ids):
            if len(s.items.all()) > 0:
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
                'total_price'       : cdata.item_price + cdata.set_price, 
                'set_price'         : cdata.set_price,
                'item_price'        : cdata.item_price,
                'set_item_price'    : cdata.set_item_price,
                'subtotal_price'    : cdata.item_price + cdata.set_item_price,
                'items' : json.loads(items_json),
                'sets' : json.loads(sets_json)
            }, status=200)


class BuyView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):

        # get item and set ids from provided data
        item_ids = []
        set_ids = []

        if 'items' in request.data:
            item_ids = request.data['items']
        if 'sets' in request.data:
            set_ids = request.data['sets']

        ret, msg = checkout_buy(item_ids, set_ids)
        s = 200 if ret else 400
        return JsonResponse({'result' : ret, 'msg' : msg}, status=s)


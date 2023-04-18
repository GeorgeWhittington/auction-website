import json
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework import permissions, views, generics
from api.serializers import RegisterSerializer
from decimal import Decimal
from shop.models import Item, Set

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
        
        total_price = Decimal(0.0)

        item_ids = []
        set_ids = []

        if 'items' in request.data:
            item_ids = request.data['items']
        if 'sets' in request.data:
            set_ids = request.data['sets']

        item_qs = Item.objects.filter(id__in=item_ids)
        set_qs = Set.objects.filter(id__in=set_ids)
        
        for i in item_qs:
            total_price += i.price

        for s in set_qs:
            total_price += s.price

        items_serialized = serializers.serialize('json', item_qs, fields=('id', 'description', 'price', 'images'))
        sets_serialized = serializers.serialize('json', set_qs, fields=('price'))
        
        return JsonResponse(
            {
                'total_price' : total_price, 
                'items' : json.loads(items_serialized),
                'sets' : json.loads(sets_serialized)
            } , status=200)


from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.core.serializers import serialize
from rest_framework.views import APIView, Response
from shop.models import Item
from django.contrib.auth.models import User

import json

class Me(APIView):
    queryset = User.objects.none()

    def get(self, request):
        current_user = request.user

        if not current_user.is_authenticated:
           return HttpResponse('Unauthorized', status=401)
         
        res = {
            'username' : current_user.username,
            'is_staff' : current_user.is_staff,
            'is_superuser' : current_user.is_superuser,
        }

        return JsonResponse(res, safe=False)
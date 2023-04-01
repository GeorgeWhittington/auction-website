from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework import permissions, views
from shop.models import Item


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
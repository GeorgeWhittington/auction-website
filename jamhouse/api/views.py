from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework import permissions, views
from shop.models import Item

# Create your views here.
class LoginView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        if 'username' in request.data and 'password' in request.data:
            username = request.data['username']
            password = request.data['password']

            if username and password:
                user = authenticate(request=request,
                                    username=username, 
                                    password=password)
                
                if not user:
                    return Response(None, status=401)

                # login the validated user
                login(request, user)
                return Response(None, status=202)

            print(request.data)
        return Response("'username' and 'password' required", status=401)


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
from django.shortcuts import render
from django.core import serializers
from django.http import JsonResponse, HttpResponse
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from rest_framework.views import APIView, Response
from rest_framework import permissions, views, generics
from shop.models import Item
from api.serializers import RegisterSerializer


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

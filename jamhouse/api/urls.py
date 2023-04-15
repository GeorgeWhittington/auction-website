from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from rest_framework.authtoken.views import obtain_auth_token

from shop.models import Item, Set, Repository, Image
from api.search import Search
from api.views import Me
from api.serializers import ItemSerializer, SetSerializer, RepositorySerializer, ImageSerializer


class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer


class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer


class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer


class ImageViewSet(viewsets.ModelViewSet):
    queryset = Image.objects.all()
    serializer_class = ImageSerializer

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

router.register(r'items', ItemViewSet)
router.register(r'sets', SetViewSet)
router.register(r'repositories', RepositoryViewSet)
router.register(r'images', ImageViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('search', Search.as_view()),
    path('login', obtain_auth_token, name='login'),
    path('me', Me.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
]
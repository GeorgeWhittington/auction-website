from django.urls import path, include
from django.core import serializers
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets

from shop.models import Item, Set, Repository
from api.search import Search
from api.me import Me

# Items
class ItemSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Item
        fields = ['id', 'description', 'price', 'sold']

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer

# Sets
class SetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'description', 'price', 'items']

class SetViewSet(viewsets.ModelViewSet):
    queryset = Set.objects.all()
    serializer_class = SetSerializer

# Reposiories
class RepositorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Repository
        fields = ['id', 'name', 'items']

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer




# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

router.register(r'items', ItemViewSet)
router.register(r'sets', SetViewSet)
router.register(r'repositories', RepositoryViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('search', Search.as_view()),
    path('me', Me.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]
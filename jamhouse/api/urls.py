from django.urls import path, include
from django.contrib.auth.models import User
from rest_framework import routers, serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import obtain_auth_token

from shop.models import Item, Set, Repository, Image, Order
from api.search import Search
from api.views import Me, RegisterView, CheckoutView, BuyView, OrderCancelView, UpdateNameView, UpdateEmailView, UpdatePasswordView
from api.serializers import ItemSerializer, SetSerializer, RepositorySerializer, ImageSerializer, OrderSerializer

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

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        qs = Order.objects.filter(user=self.request.user)
        
        for order in qs:
            order.update_status()

        return qs

# Routers provide an easy way of automatically determining the URL conf.
router = routers.DefaultRouter()

router.register(r'items', ItemViewSet)
router.register(r'sets', SetViewSet)
router.register(r'repositories', RepositoryViewSet)
router.register(r'images', ImageViewSet)
router.register(r'orders', OrderViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', include(router.urls)),
    path('search', Search.as_view()),
    path('login', obtain_auth_token, name='login'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('me', Me.as_view()),
    path('checkout', CheckoutView.as_view()),
    path('buy', BuyView.as_view()),
    path('order-cancel', OrderCancelView.as_view()),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('update-name', UpdateNameView.as_view()),
    path('update-email', UpdateEmailView.as_view()),
    path('update-password', UpdatePasswordView.as_view()),
]
from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from shop.models import Item, Set, Repository, Image, Order, CheckoutInfo

class CheckoutInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CheckoutInfo
        fields = ['addr_address', 'addr_city', 'addr_country', 'addr_county', 'addr_postcode', 'card_number', 'card_name', 'card_exp_month', 'card_exp_year', 'card_cvc']
        
class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = ['alt', 'img']


class ItemSerializer(serializers.ModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'description', 'price', 'sold', 'sets', 'repositories', 'images']


class SetSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Set
        fields = ['id', 'description', 'price', 'items', 'sold', 'price_individual_items']


class RepositorySerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)

    class Meta:
        model = Repository
        fields = ['id', 'name', 'items']

class OrderSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True, read_only=True)
    sets = SetSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'number', 'creation_time', 'user', 'items', 'sets', 'status']

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all(), message="This email address is already in use.")])
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ('password', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def create(self, validated_data):
        user = User.objects.create(
            username = validated_data['email'],
            email = validated_data['email'],
            first_name = validated_data['first_name'],
            last_name = validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
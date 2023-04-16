from rest_framework import serializers

from shop.models import Item, Set, Repository, Image


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ['alt', 'img']


class ItemSerializer(serializers.HyperlinkedModelSerializer):
    images = ImageSerializer(many=True, read_only=True)

    class Meta:
        model = Item
        fields = ['id', 'description', 'price', 'sold', 'sets', 'repositories', 'images']


class SetSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Set
        fields = ['id', 'description', 'price', 'items']


class RepositorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Repository
        fields = ['id', 'name', 'items']

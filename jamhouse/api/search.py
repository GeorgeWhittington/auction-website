from django.core import serializers
from django.http import JsonResponse
from django.core.serializers import serialize
from rest_framework.views import APIView, Response
from shop.models import Item
import json

class Search(APIView):
    queryset = Item.objects.none() 

    def get(self, request):
        term = request.query_params['q']
        
        res = {
            'num_results' : 0,
            'data' : {}
        }

        item_data = serialize("json", Item.objects.filter(description__icontains=term))
        res['data'] = json.loads(item_data)
        
        return JsonResponse(res, safe=False)
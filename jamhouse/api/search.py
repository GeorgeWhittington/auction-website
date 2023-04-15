from django.core import serializers
from django.http import JsonResponse
from django.core.serializers import serialize
from rest_framework.views import APIView, Response
from rest_framework.exceptions import ParseError
from shop.models import Item
import json


def enforce_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return None


class Search(APIView):
    queryset = Item.objects.none()

    def get(self, request):
        permission_classes = tuple()
        term = request.query_params.get("query")
        min_price = enforce_int(request.query_params.get("min-price"))
        max_price = enforce_int(request.query_params.get("max-price"))
        sort_by = request.query_params.get("sort-by", "new")

        if not term:
            raise ParseError

        queryset = Item.objects.filter(description__icontains=term)
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        if sort_by == "low-high":
            queryset = queryset.order_by("price")
        elif sort_by == "high-low":
            queryset = queryset.order_by("-price")
        else:
            # default is "new"
            queryset = queryset.order_by("created_at")

        results = {
            "data": json.loads(serialize("json", queryset)),
            "num_results": queryset.count()
        }

        return JsonResponse(results, safe=False)
from rest_framework.views import APIView
from rest_framework.exceptions import ParseError

from shop.models import Item
from api.serializers import ItemSerializer
from api.paginators import SmallPagePagination


def enforce_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return None


class Search(APIView, SmallPagePagination):
    queryset = Item.objects.none()

    def get(self, request):
        term = request.query_params.get("query")
        min_price = enforce_float(request.query_params.get("min-price"))
        max_price = enforce_float(request.query_params.get("max-price"))
        sort_by = request.query_params.get("sort-by", "new")

        if not term:
            raise ParseError

        queryset = Item.objects.filter(
            description__icontains=term,
            sold_at__isnull=True)
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

        page = self.paginate_queryset(queryset, request, view=self)
        serializer = ItemSerializer(page, many=True, context={"request": request})
        return self.get_paginated_response(serializer.data)

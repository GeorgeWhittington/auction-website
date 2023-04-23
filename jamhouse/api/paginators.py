from django.core.paginator import EmptyPage
from rest_framework.views import Response
from rest_framework.pagination import PageNumberPagination

class SmallPagePagination(PageNumberPagination):
    page_size = 10
    max_page_size = 10

    def get_paginated_response(self, data):
        try:
            next_page = self.page.next_page_number()
        except EmptyPage:
            next_page = None

        return Response({
            "next": next_page,
            "count": self.page.paginator.count,
            "results": data
        })
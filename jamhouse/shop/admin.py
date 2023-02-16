from django.contrib import admin
from django.db.models import Count, F, Q
from .models import Set, Item


class SoldFilter(admin.SimpleListFilter):
    title = "sold"
    parameter_name = "sold"

    def lookups(self, request, model_admin):
        return (
            ("Yes", "Yes"),
            ("No", "No")
        )

class SoldItemFilter(SoldFilter):
    def queryset(self, request, queryset):
        value = self.value()
        if value == "Yes":
            return queryset.filter(sold_at__isnull=False)
        elif value == "No":
            return queryset.filter(sold_at__isnull=True)
        return queryset


class SoldSetFilter(SoldFilter):
    def queryset(self, request, queryset):
        value = self.value()
        if value == "Yes":
            return queryset.annotate(sold_count=Count("items", filter=Q(items__sold_at__isnull=True))).filter(sold_count__gt=0)
        elif value == "No":
            return queryset.annotate(sold_count=Count("items", filter=Q(items__sold_at__isnull=True))).filter(sold_count=0)
        return queryset


@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "set_price", "sold")
    list_display_links = ("description",)
    list_filter = (SoldSetFilter,)
    filter_horizontal = ("items",)

    def set_price(self, obj):
        return f"£{obj.price:,}" if obj.price else ""

    def sold(self, obj):
        return bool(obj.items.filter(sold_at__isnull=False).count())


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "item_price", "sold_at")
    list_display_links = ("description",)
    list_filter = (SoldItemFilter,)
    filter_horizontal = ("sets",)
    fieldsets = (
        (None, {"fields": ("description", "price", "sold_at")}),
        ("Advanced options", {
            "classes": ("collapse",),
            "fields": ("sets",)
        })
    )

    def item_price(self, obj):
        return f"£{obj.price:,}" if obj.price else ""

    def sold(self, obj):
        return bool(obj.sold_at)

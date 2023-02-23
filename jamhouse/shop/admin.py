from datetime import datetime

from django.contrib import admin, messages
from django.db.models import Count, F, Q, Case, When, Value
from django.utils.translation import ngettext
from .models import Set, Item

# Filters
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
    actions = ("mark_set_sold",)

    def set_price(self, obj):
        return f"£{obj.price:,}" if obj.price else ""

    @admin.action(description="Mark selected sets as sold")
    def mark_set_sold(self, request, queryset):
        """TODO: Check that this is working correctly on more data (a set that's half sold shouldn't allow any of the remaining items to be sold here)"""
        set_ids = queryset.filter(items__sold_at__isnull=True).values_list("id", flat=True).all()
        updated = Item.objects.filter(sets__id__in=set_ids, sold_at__isnull=True).update(sold_at=datetime.now())
        self.message_user(request, ngettext(
            "%d item was successfully marked as sold",
            "%d items were successfully marked as sold",
            updated,
        ) % updated, messages.SUCCESS)


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
    actions = ("mark_item_sold",)

    def item_price(self, obj):
        return f"£{obj.price:,}" if obj.price else ""

    @admin.action(description="Mark selected items as sold")
    def mark_item_sold(self, request, queryset):
        updated = queryset.filter(sold_at__isnull=True).update(sold_at=datetime.now())
        self.message_user(request, ngettext(
            "%d item was successfully marked as sold",
            "%d items were successfully marked as sold",
            updated,
        ) % updated, messages.SUCCESS)
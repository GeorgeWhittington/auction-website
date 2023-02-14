from django.contrib import admin
from .models import Set, Item


@admin.register(Set)
class SetAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "set_price")
    filter_horizontal = ("items",)

    def set_price(self, obj):
        return f"£{obj.price:,}" if obj.price else ""


@admin.register(Item)
class ItemAdmin(admin.ModelAdmin):
    list_display = ("id", "description", "item_price", "sold")
    filter_horizontal = ("sets",)
    fieldsets = (
        (None, {"fields": ("description", "price", "sold")}),
        ("Advanced options", {
            "classes": ("collapse",),
            "fields": ("sets",)
        })
    )

    def item_price(self, obj):
        return f"£{obj.price:,}" if obj.price else ""

from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'venue', 'customer_name', 'customer_email', 'event_date', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'event_date', 'created_at')
    search_fields = ('customer_name', 'customer_email', 'venue__name')

import django_filters
from .models import Venue

class VenueFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    max_price = django_filters.NumberFilter(field_name="price", lookup_expr="lte")
    min_capacity = django_filters.NumberFilter(field_name="capacity", lookup_expr="gte")
    location = django_filters.CharFilter(field_name="location", lookup_expr="icontains")
    event_type = django_filters.CharFilter(field_name="event_types__name", lookup_expr="iexact")
    amenity = django_filters.CharFilter(field_name="amenities__name", lookup_expr="iexact")
    date = django_filters.DateFilter(method="filter_by_available_date")
    status = django_filters.CharFilter(field_name="status", lookup_expr="iexact")

    class Meta:
        model = Venue
        fields = ["location", "min_price", "max_price", "min_capacity", "status"]

    def filter_by_available_date(self, queryset, name, value):
        return queryset.exclude(
            availability__date=value, availability__is_available=False
        )
    
    def filter_by_event_type(self, queryset, name, value):
        return queryset.filter(event_types__name=value)
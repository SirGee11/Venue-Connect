from rest_framework.routers import DefaultRouter
from rest_framework_nested import routers
from .views import VenueViewSet, VenuePhotoViewSet, AmenityViewSet, EventTypeViewSet

router = DefaultRouter()
router.register(r"venues", VenueViewSet, basename="venue")
router.register(r"amenities", AmenityViewSet, basename="amenity")
router.register(r"event-types", EventTypeViewSet, basename="event-type")

venues_router = routers.NestedDefaultRouter(router, r"venues", lookup="venue")
venues_router.register(r"photos", VenuePhotoViewSet, basename="venue-photos")

urlpatterns = router.urls + venues_router.urls
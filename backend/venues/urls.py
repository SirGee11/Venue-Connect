from rest_framework.routers import DefaultRouter
from .views import VenueViewSet,VenuePhotoViewSet
from rest_framework_nested import routers  

router = DefaultRouter()
router.register(r"venues", VenueViewSet, basename="venue")

venues_router = routers.NestedDefaultRouter(router, r"venues", lookup="venue")
venues_router.register(r"photos", VenuePhotoViewSet, basename="venue-photos")

urlpatterns = router.urls + venues_router.urls
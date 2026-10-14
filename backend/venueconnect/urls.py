from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny


@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    return Response({
        'name': 'Venue-Connect API',
        'version': 'v1',
        'status': 'online',
        'endpoints': {
            'venues': '/api/v1/venues/',
            'amenities': '/api/v1/amenities/',
            'event_types': '/api/v1/event-types/',
            'recommendations': '/api/v1/venues/recommend/',
            'bookings': '/api/v1/bookings/',
            'auth_register': '/api/v1/auth/register/',
            'auth_login': '/api/v1/auth/login/',
            'auth_me': '/api/v1/auth/me/',
            'users': '/api/v1/users/',
            'reviews': '/api/v1/reviews/',
            'notifications': '/api/v1/notifications/',
        }
    })


api_patterns = [
    path('', api_root, name='api-root'),
    path('', include('venues.urls')),
    path('', include('bookings.urls')),
    path('', include('users.urls')),
    path('', include('reviews.urls')),
    path('', include('notifications.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(api_patterns)),
    path('api/', include(api_patterns)),  # Alias for unversioned compatibility
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver


class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('owner', 'Venue Owner'),
        ('admin', 'Administrator'),
    ]

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    phone_number = models.CharField(max_length=50, blank=True, default='')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    status = models.CharField(max_length=20, default='Active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} ({self.role})"


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def ensure_user_profile(sender, instance, created, **kwargs):
    if created:
        role = 'admin' if instance.is_superuser or instance.is_staff else 'customer'
        UserProfile.objects.get_or_create(user=instance, defaults={'role': role})

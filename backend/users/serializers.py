from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import UserProfile

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()
    phone = serializers.SerializerMethodField()
    phone_number = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'name',
            'email',
            'first_name',
            'last_name',
            'phone',
            'phone_number',
            'role',
            'status',
            'is_staff',
            'is_active',
            'date_joined',
        ]
        read_only_fields = ['id', 'date_joined']

    def get_role(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.role if profile else ('admin' if obj.is_staff else 'customer')

    def get_phone(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.phone_number if profile else ''

    def get_phone_number(self, obj):
        return self.get_phone(obj)

    def get_status(self, obj):
        profile = getattr(obj, 'profile', None)
        return profile.status if profile else ('Active' if obj.is_active else 'Suspended')

    def get_name(self, obj):
        full_name = f"{obj.first_name} {obj.last_name}".strip()
        return full_name or obj.username


class RegisterSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(max_length=50, required=False, allow_blank=True)
    phone_number = serializers.CharField(max_length=50, required=False, allow_blank=True)
    role = serializers.CharField(default='customer')

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def create(self, validated_data):
        email = validated_data['email']
        name = validated_data.get('name', '').strip()
        username = validated_data.get('username') or email.split('@')[0]
        base_username = username
        counter = 1
        while User.objects.filter(username=username).exists():
            username = f"{base_username}{counter}"
            counter += 1

        password = validated_data['password']
        phone = validated_data.get('phone') or validated_data.get('phone_number', '')
        role = validated_data.get('role', 'customer')

        first_name = name.split()[0] if name else ''
        last_name = ' '.join(name.split()[1:]) if len(name.split()) > 1 else ''

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        profile, _ = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.phone_number = phone
        profile.status = 'Active'
        profile.save()
        user.refresh_from_db()

        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        login_input = attrs.get('email')
        password = attrs.get('password')

        # Try authenticate with username or email
        user = authenticate(username=login_input, password=password)
        if not user:
            user_obj = User.objects.filter(email__iexact=login_input).first()
            if user_obj:
                user = authenticate(username=user_obj.username, password=password)

        if not user:
            raise serializers.ValidationError("Invalid email or password.")

        attrs['user'] = user
        return attrs
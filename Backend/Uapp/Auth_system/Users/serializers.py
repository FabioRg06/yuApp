from rest_framework import serializers
from .models import CustomUser
from .models import UserProgress

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password']
        # extra_kwargs = {
        #     'password': {'write_only': True}  # Ocultar contraseña en la respuesta
        # }

    def create(self, validated_data):
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hash de la contraseña
        user.save()
        return user

class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = '__all__'


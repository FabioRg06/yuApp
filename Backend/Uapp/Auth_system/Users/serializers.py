from rest_framework import serializers
from .repositories.user_repository import UserRepository
from .models import CustomUser, UserProgress,Role


class UserProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProgress
        fields = '__all__'

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model=Role
        fields='__all__'
        
class CustomUserSerializer(serializers.ModelSerializer):
    role= RoleSerializer(read_only=True)
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'password',"role"]
        extra_kwargs = {
            'password': {'write_only': True}  
        }

    def create(self, validated_data):
        return UserRepository.create_user(validated_data)

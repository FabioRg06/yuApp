from ..models import CustomUser, UserProgress

class UserRepository:
    @staticmethod
    def get_user_by_email(email):
        """Obtiene un usuario por su email"""
        try:
            return CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            return None

    @staticmethod
    def create_user(validated_data):
        """Crea un usuario con contraseña encriptada"""
        user = CustomUser.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])  # Hash de la contraseña
        user.save()
        return user

class UserProgressRepository:
    @staticmethod
    def get_all_progress():
        """Obtiene todos los registros de progreso"""
        return UserProgress.objects.all()
    
    @staticmethod
    def create_progress(data):
        """Crea un nuevo registro de progreso"""
        return UserProgress.objects.create(**data)

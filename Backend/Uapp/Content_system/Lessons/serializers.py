from rest_framework import serializers
from .models import Lesson
from Auth_system.Users.services.user_service import UserProgressService  # Importamos el servicio de progreso
from ..Questions.serializers import QuestionSerializer

class LessonSerializer(serializers.ModelSerializer):
    progress = serializers.SerializerMethodField(read_only=True)
    completed = serializers.SerializerMethodField(read_only=True)
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ["id", "title", "chapter", "description", "icon", "created_at", "progress", "questions", "completed"]

    def get_progress(self, obj):
        """Obtiene el progreso del usuario autenticado."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserProgressService.get_progress(request.user, obj)
        return 0.0

    def get_completed(self, obj):
        """Verifica si la lección está completada."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserProgressService.is_completed(request.user, obj)
        return False

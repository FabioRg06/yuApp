from rest_framework import serializers
from .models import Lesson  
from Auth_system.Users.models import UserProgress
from ..Questions.serializers import QuestionSerializer

class LessonSerializer(serializers.ModelSerializer):
    # word_phrases = serializers.StringRelatedField(many=True, read_only=True)
    progress = serializers.SerializerMethodField(read_only=True)
    questions=QuestionSerializer(many=True,read_only=True)
    
    class Meta:
        model = Lesson
        fields = ["id","title","chapter","description","icon","created_at","progress","questions"]
    def get_progress(self, obj):
        """Obtiene el progreso del usuario autenticado para esta lección"""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            user = request.user
            user_progress = UserProgress.objects.filter(user=user, lesson=obj).first()
            return user_progress.progress if user_progress else 0.0  # Si no hay progreso, retorna 0
        return 0.0
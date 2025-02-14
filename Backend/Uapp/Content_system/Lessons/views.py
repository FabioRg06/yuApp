import random
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from Auth_system.Users.models import UserProgress
from Content_system.WordPhrases.models import WordPhrase
from .models import Lesson
from ..Questions.models import Question, QuestionType
from .serializers import (
    LessonSerializer
)

# Create your views here.
class LessonList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        """Obtiene todas las lecciones y crea automáticamente UserProgress si no existe"""
        lessons = Lesson.objects.all()

        # Verifica si el usuario ya tiene progreso en las lecciones y crea si es necesario
        for lesson in lessons:
            UserProgress.objects.get_or_create(user=request.user, lesson=lesson)

        # Serializa las lecciones con el contexto del request para incluir el progreso
        serializer = LessonSerializer(lessons, many=True, context={'request': request})
        return Response(serializer.data)


    def post(self, request, format=None):
        serializer = LessonSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LessonDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Lesson.objects.get(pk=pk)
        except Lesson.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        """Obtiene una lección y genera preguntas dinámicamente según la cantidad definida en `questions_amount`."""
        lesson = self.get_object(pk)

        # Crea el progreso del usuario si no existe
        UserProgress.objects.get_or_create(user=request.user, lesson=lesson)

        existing_questions_count = Question.objects.filter(lesson=lesson).count()
        questions_needed = lesson.questions_amount - existing_questions_count

        if questions_needed <= 0:
            serializer = LessonSerializer(lesson, context={'request': request})
            return Response(serializer.data)  
        
        generate_questions(lesson,questions_needed)
        serializer = LessonSerializer(lesson, context={'request': request})
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        lesson = self.get_object(pk)
        serializer = LessonSerializer(lesson, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        lesson = self.get_object(pk)
        lesson.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
class UpdateProgressView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, lesson_id, format=None):
        """Actualiza el progreso de una lección para el usuario autenticado"""
        try:
            lesson = Lesson.objects.get(pk=lesson_id)
        except Lesson.DoesNotExist:
            return Response({"error": "Lección no encontrada"}, status=status.HTTP_404_NOT_FOUND)

        progress_data = request.data.get("progress", 0.0)
        if not (0.0 <= progress_data <= 100.0):
            return Response({"error": "El progreso debe estar entre 0 y 100"}, status=status.HTTP_400_BAD_REQUEST)

        user_progress, created = UserProgress.objects.get_or_create(user=request.user, lesson=lesson)
        user_progress.progress = progress_data
        user_progress.save()

        return Response({"message": "Progreso actualizado", "progress": user_progress.progress})
def generate_questions(lesson,needed):
        question_types = list(QuestionType.objects.all())
        word_phrases = list(WordPhrase.objects.filter(lesson=lesson))

        if not word_phrases or not question_types:
            return Response({"error": "No hay suficientes datos para generar preguntas."}, status=400)


        new_questions = []
        for _ in range(needed):
            question_type = random.choice(question_types)
            correct_answer = random.choice(word_phrases)


            question = Question(
                lesson=lesson,
                question_type=question_type,
                correct_answer=correct_answer
            )
            new_questions.append(question)

        # Crear todas las preguntas en una sola operación
        created_questions = Question.objects.bulk_create(new_questions)

        # Asignar opciones (una correcta y tres incorrectas) a cada pregunta
        for question in created_questions:
            incorrect_options = random.sample(
                [wp for wp in word_phrases if wp != question.correct_answer], min(3, len(word_phrases) - 1)
            )
            question.options.set([question.correct_answer] + incorrect_options)

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework.permissions import IsAuthenticated
from .models import Question, QuestionType, Answer
from .serializers import  QuestionSerializer, AnswerSerializer,QuestionTypeSerializer


class QuestionList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        questions = Question.objects.all()
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return Question.objects.get(pk=pk)
        except Question.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        question = self.get_object(pk)
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        question = self.get_object(pk)
        question.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class QuestionTypeList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        question_types = QuestionType.objects.all()
        serializer = QuestionTypeSerializer(question_types, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = QuestionTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class QuestionTypeDetail(APIView):
    permission_classes = [IsAuthenticated]

    def get_object(self, pk):
        try:
            return QuestionType.objects.get(pk=pk)
        except QuestionType.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        question_type = self.get_object(pk)
        serializer = QuestionTypeSerializer(question_type)
        return Response(serializer.data)

    def put(self, request, pk, format=None):
        question_type = self.get_object(pk)
        serializer = QuestionTypeSerializer(question_type, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        question_type = self.get_object(pk)
        question_type.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class AnswerList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        answers = Answer.objects.all()
        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = AnswerSerializer(data=request.data)
        if serializer.is_valid():
            # Validación para verificar si la respuesta es correcta
            question = serializer.validated_data['question']
            selected_word_phrase = serializer.validated_data['selected_word_phrase']
            is_correct = selected_word_phrase in question.correct_word_phrases.all()
            serializer.save(is_correct=is_correct)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

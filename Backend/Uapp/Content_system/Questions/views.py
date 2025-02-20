from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import QuestionService, QuestionOptionService, QuestionTypeService
from .serializers import QuestionSerializer, QuestionOptionSerializer, QuestionTypeSerializer

class QuestionTypeListCreateView(generics.ListCreateAPIView):
    """Maneja la lista y creación de tipos de preguntas."""
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionTypeSerializer

    def get_queryset(self):
        return QuestionTypeService.get_question_types()

    def create(self, request, *args, **kwargs):
        question_type = QuestionTypeService.create_question_type(**request.data)
        return Response(QuestionTypeSerializer(question_type).data, status=status.HTTP_201_CREATED)

class QuestionTypeDetailView(generics.RetrieveDestroyAPIView):
    """Maneja la obtención y eliminación de un tipo de pregunta."""
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionTypeSerializer

    def get_object(self):
        return QuestionTypeService.get_question_type_by_id(self.kwargs.get("pk"))

    def delete(self, request, *args, **kwargs):
        QuestionTypeService.delete_question_type(self.kwargs.get("pk"))
        return Response(status=status.HTTP_204_NO_CONTENT)

class QuestionListCreateView(generics.ListCreateAPIView):
    """Lista y crea preguntas."""
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_queryset(self):
        return QuestionService.get_questions()

    def create(self, request, *args, **kwargs):
        question = QuestionService.create_question(**request.data)
        return Response(QuestionSerializer(question).data, status=status.HTTP_201_CREATED)

class QuestionDetailView(generics.RetrieveDestroyAPIView):
    """Obtiene y elimina una pregunta."""
    permission_classes = [IsAuthenticated]
    serializer_class = QuestionSerializer

    def get_object(self):
        return QuestionService.get_question_by_id(self.kwargs.get("pk"))

    def delete(self, request, *args, **kwargs):
        QuestionService.delete_question(self.kwargs.get("pk"))
        return Response(status=status.HTTP_204_NO_CONTENT)

from django.urls import path
from .views import (
    QuestionListCreateView, QuestionDetailView,
    QuestionOptionListCreateView, QuestionOptionDetailView,
    QuestionTypeListCreateView, QuestionTypeDetailView
)

urlpatterns = [
    path('', QuestionListCreateView.as_view(), name='question-list'),
    path('<int:pk>/', QuestionDetailView.as_view(), name='question-detail'),
    path('options/', QuestionOptionListCreateView.as_view(), name='question-option-list'),
    path('options/<int:pk>/', QuestionOptionDetailView.as_view(), name='question-option-detail'),
    path('types/', QuestionTypeListCreateView.as_view(), name='question-type-list'),
    path('types/<int:pk>/', QuestionTypeDetailView.as_view(), name='question-type-detail'),
]

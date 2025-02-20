from django.urls import path
from .views import LessonListCreateView, LessonDetailView,UpdateLessonProgressView

urlpatterns = [
    path('', LessonListCreateView.as_view(), name='lesson-list-create'),
    path('<int:pk>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('<int:pk>/update-progress/', UpdateLessonProgressView.as_view(), name='update-lesson-progress'),
]

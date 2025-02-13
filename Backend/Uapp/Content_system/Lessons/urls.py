from django.urls import path
from .views import LessonDetail,LessonList,UpdateProgressView

urlpatterns = [
    path('<int:pk>', LessonDetail.as_view(), name='Lesson-detail'),
    path('', LessonList.as_view(), name='Lesson'),
    path('<int:lesson_id>/progress/', UpdateProgressView.as_view(), name='update_progress'),
]

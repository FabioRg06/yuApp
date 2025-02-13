from django.urls import path
from .views import LessonDetail,LessonList

urlpatterns = [
    path('<int:pk>', LessonDetail.as_view(), name='Lesson-detail'),
    path('', LessonList.as_view(), name='Lesson')
]

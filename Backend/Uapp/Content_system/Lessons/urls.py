from django.urls import path
from .views import LessonDetail,LessonList,LessonTypeList

urlpatterns = [
    path('<int:pk>', LessonDetail.as_view(), name='Lesson-detail'),
    path('', LessonList.as_view(), name='Lesson'),
    path('type', LessonTypeList.as_view(), name='Lesson-type'),
]

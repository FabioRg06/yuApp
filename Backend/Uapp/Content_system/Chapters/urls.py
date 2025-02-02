from django.urls import path
from .views import ChapterList,ChapterDetail

urlpatterns = [
    path('<int:pk>', ChapterDetail.as_view(), name='chapters-detail'),
    path('', ChapterList.as_view(), name='chapters'),
]

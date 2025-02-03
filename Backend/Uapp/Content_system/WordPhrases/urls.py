from django.urls import path
from .views import WordPhraseList

urlpatterns = [
    path('', WordPhraseList.as_view(), name='Lesson')
]

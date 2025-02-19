from django.urls import path
from .views import WordPhraseListCreateView, WordPhraseDetailView

urlpatterns = [
    path('', WordPhraseListCreateView.as_view(), name='wordphrase-list-create'),
    path('<int:pk>/', WordPhraseDetailView.as_view(), name='wordphrase-detail'),
]

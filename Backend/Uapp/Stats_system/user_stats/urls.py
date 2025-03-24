from django.urls import path
from .views import UserStatsView, DecrementLifeView

urlpatterns = [
    path("", UserStatsView.as_view(), name="user-stats"),
    path("decrement-life/", DecrementLifeView.as_view(), name="decrement-life"),
]

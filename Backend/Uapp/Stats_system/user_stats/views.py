from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .Services.user_stats_service import UserStatsService

class UserStatsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        stats = UserStatsService.get_user_stats(request.user)
        return Response({
            "lives": stats.lives,
            "lessons_completed": stats.lessons_completed,
            "streak": stats.streak
        })

class DecrementLifeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stats = UserStatsService.decrement_life(request.user)
        return Response({"lives": stats.lives})

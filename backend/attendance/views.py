from django.conf import settings
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Attendance
from .serializers import AttendanceSerializer


class AttendanceListCreateView(generics.ListCreateAPIView):
    """
    POST /api/attendance/   -> create a new attendance record (public)
    GET  /api/attendance/   -> list all records (public for dev convenience)
    """
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]


class AttendanceDetailView(generics.RetrieveAPIView):
    """GET /api/attendance/<id>/"""
    queryset = Attendance.objects.all()
    serializer_class = AttendanceSerializer
    permission_classes = [AllowAny]


class AdminLoginView(APIView):
    """
    POST /api/admin/login/
    Body: { "code": "0000" }
    Returns: { "token": "...", "message": "..." }
    """
    permission_classes = [AllowAny]

    def post(self, request):
        code = str(request.data.get("code", "")).strip()
        if not code:
            return Response(
                {"detail": "Admin code is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if code != str(settings.ADMIN_CODE):
            return Response(
                {"detail": "Invalid admin code."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # Get or create a dedicated "admin" user for the token
        from django.contrib.auth.models import User
        admin_user, created = User.objects.get_or_create(
            username="admin_user",
            defaults={"is_staff": True, "is_superuser": False},
        )
        if created:
            admin_user.set_unusable_password()
            admin_user.save()

        token, _ = Token.objects.get_or_create(user=admin_user)
        return Response(
            {"token": token.key, "message": "Login successful."},
            status=status.HTTP_200_OK,
        )


class AdminDashboardView(generics.ListAPIView):
    """
    GET /api/admin/dashboard/
    Requires: Authorization: Token <token>
    """
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Attendance.objects.all()  # model Meta orders by -created_at

        search = self.request.query_params.get("search")
        level = self.request.query_params.get("level")
        hostel = self.request.query_params.get("hostel")

        if search:
            from django.db.models import Q
            qs = qs.filter(
                Q(name__icontains=search)
                | Q(phone_number__icontains=search)
                | Q(hostel__icontains=search)
                | Q(level__icontains=search)
            )
        if level:
            qs = qs.filter(level=level)
        if hostel:
            qs = qs.filter(hostel__icontains=hostel)

        return qs
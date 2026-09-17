from django.urls import path
from .views import (
    AttendanceListCreateView,
    AttendanceDetailView,
    AdminLoginView,
    AdminDashboardView,
)

urlpatterns = [
    path("attendance/", AttendanceListCreateView.as_view(), name="attendance-list"),
    path("attendance/<int:pk>/", AttendanceDetailView.as_view(), name="attendance-detail"),
    path("admin/login/", AdminLoginView.as_view(), name="admin-login"),
    path("admin/dashboard/", AdminDashboardView.as_view(), name="admin-dashboard"),
]
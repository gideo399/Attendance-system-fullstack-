from django.contrib import admin
from .models import Attendance


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "phone_number", "hostel", "level", "created_at")
    list_filter = ("level", "hostel")
    search_fields = ("name", "phone_number", "hostel")
    ordering = ("-created_at",)
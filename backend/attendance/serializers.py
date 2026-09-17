import re
from rest_framework import serializers
from .models import Attendance


class AttendanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attendance
        fields = ["id", "name", "phone_number", "hostel", "level", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        value = value.strip()
        if len(value) < 2:
            raise serializers.ValidationError("Name must be at least 2 characters.")
        return value

    def validate_phone_number(self, value):
        value = value.strip()
        # Accept Ghana-style: 0XXXXXXXXX or +233XXXXXXXXX (10-13 digits with optional +)
        if not re.fullmatch(r"\+?\d{9,15}", value):
            raise serializers.ValidationError(
                "Enter a valid phone number (digits only, 9-15 digits)."
            )
        return value

    def validate_hostel(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Hostel is required.")
        return value

    def validate_level(self, value):
        if value not in [100, 200, 300, 400]:
            raise serializers.ValidationError("Level must be 100, 200, 300, or 400.")
        return value
from django.db import models


class Attendance(models.Model):
    LEVEL_CHOICES = [
        (100, "100"),
        (200, "200"),
        (300, "300"),
        (400, "400"),
    ]

    name = models.CharField(max_length=150)
    phone_number = models.CharField(max_length=20)
    hostel = models.CharField(max_length=100)
    level = models.PositiveIntegerField(choices=LEVEL_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.phone_number})"
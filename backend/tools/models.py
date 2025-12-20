from django.db import models


class ToolCalculation(models.Model):
    user_uid = models.CharField(max_length=128)
    tool = models.CharField(max_length=50)
    title = models.CharField(max_length=255, blank=True)

    input_data = models.JSONField()
    result_data = models.JSONField()

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.tool} | {self.user_uid}"

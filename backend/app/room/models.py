from django.db import models

class Room(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('closed', 'Closed'),
        ('maintenance', 'Maintenance'),
    ]
    code = models.CharField(max_length=100) # R101, R102
    capacity = models.PositiveIntegerField()
    isAirConditioned = models.BooleanField(default=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.code
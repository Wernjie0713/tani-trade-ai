"""
Notification service for user alerts (simulated Email/SMS/Push).
"""
from typing import Literal
import logging

NotificationType = Literal["email", "sms", "push"]

class NotificationService:
    @staticmethod
    def send_notification(user_id: str, message: str, notif_type: NotificationType = "push") -> None:
        # Simulate sending a notification (log only)
        logging.info(f"[NOTIFY] ({notif_type}) to user {user_id}: {message}")
        print(f"[NOTIFY] ({notif_type}) to user {user_id}: {message}")

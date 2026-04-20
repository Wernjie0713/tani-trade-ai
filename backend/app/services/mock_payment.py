"""
Mock payment/escrow service for hackathon demo (no real payment rails).
"""
import logging
from typing import Optional

class MockEscrowService:
    @staticmethod
    def create_escrow(reservation_id: str, amount: float, buyer_id: str) -> dict:
        # Simulate escrow creation
        logging.info(f"[ESCROW] Created escrow for reservation {reservation_id} amount {amount} buyer {buyer_id}")
        return {"escrow_id": f"escrow_{reservation_id}", "status": "FUNDS_SECURED", "amount": amount, "buyer_id": buyer_id}

    @staticmethod
    def release_escrow(escrow_id: str, success: bool = True) -> dict:
        # Simulate escrow release/refund
        status = "RELEASED" if success else "REFUNDED"
        logging.info(f"[ESCROW] {status} escrow {escrow_id}")
        return {"escrow_id": escrow_id, "status": status}

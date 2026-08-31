import os
import httpx

from database import now_iso
from .base import ConnectionStatus, WhatsAppProvider


class BaileysProvider(WhatsAppProvider):
    name = "baileys"

    @property
    def gateway(self):
        return (os.environ.get("WHATSAPP_GATEWAY_URL") or "http://localhost:3001").rstrip("/")

    def _headers(self):
        return {"x-gateway-secret": os.environ.get("WHATSAPP_GATEWAY_SECRET", "")}

    def _url(self, suffix):
        return f"{self.gateway}/instance/{self.restaurant_id}/{suffix}"

    async def connect(self):
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                response = await client.post(self._url("connect"), headers=self._headers())
                data = response.json() if response.content else {}
            return ConnectionStatus(status=data.get("status", "connecting"), qr_code=data.get("qr"), connected_number=data.get("number"), last_connected_at=now_iso() if data.get("status") == "connected" else None)
        except Exception as exc:
            return ConnectionStatus(status="error", detail=f"Gateway unreachable: {exc}")

    async def disconnect(self):
        return ConnectionStatus(status="disconnected", detail="Logged out")

    async def send_message(self, to_phone, text):
        try:
            async with httpx.AsyncClient(timeout=25) as client:
                response = await client.post(self._url("send"), headers=self._headers(), json={"to": to_phone, "text": text})
                return response.status_code < 300
        except Exception:
            return False

    async def get_connection_status(self):
        try:
            async with httpx.AsyncClient(timeout=20) as client:
                response = await client.get(self._url("status"), headers=self._headers())
                data = response.json() if response.content else {}
            return ConnectionStatus(status=data.get("status", "disconnected"), qr_code=data.get("qr"), connected_number=data.get("number"))
        except Exception as exc:
            return ConnectionStatus(status="error", detail=f"Gateway unreachable: {exc}")
import os
from fastapi import APIRouter, Request, Response, HTTPException

from database import NO_ID, db, now_iso
from services import conversation_service
from whatsapp.base import IncomingMessage

router = APIRouter(prefix="/webhooks/whatsapp", tags=["webhooks"])


@router.get("/meta")
async def meta_verify(request: Request):
    params = request.query_params
    if params.get("hub.mode") == "subscribe" and params.get("hub.verify_token") == os.environ.get("META_VERIFY_TOKEN", ""):
        return Response(content=params.get("hub.challenge", ""), media_type="text/plain")
    raise HTTPException(status_code=403, detail="Verification failed")


@router.post("/meta")
async def meta_webhook(request: Request):
    body = await request.json()
    for entry in body.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {}); phone_number_id = (value.get("metadata") or {}).get("phone_number_id")
            conn = await db.whatsapp_connections.find_one({"meta_phone_number_id": phone_number_id}, NO_ID)
            if not conn: continue
            for message in value.get("messages", []):
                if message.get("type") == "text":
                    await conversation_service.handle_incoming(IncomingMessage(restaurant_id=conn["restaurant_id"], provider="meta", customer_phone=message.get("from", ""), message_id=message.get("id", ""), text=(message.get("text") or {}).get("body", ""), timestamp=now_iso()))
    return {"ok": True}


@router.post("/evolution/{restaurant_id}")
async def evolution_webhook(restaurant_id: str, request: Request):
    body = await request.json(); data = body.get("data", {}); key = data.get("key", {})
    text = (data.get("message", {}) or {}).get("conversation", "")
    if not key.get("fromMe") and key.get("remoteJid") and text:
        await conversation_service.handle_incoming(IncomingMessage(restaurant_id=restaurant_id, provider="evolution", customer_phone=key["remoteJid"].split("@")[0], message_id=key.get("id", ""), text=text, timestamp=now_iso()))
    return {"ok": True}
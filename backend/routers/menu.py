from fastapi import APIRouter, Depends
from pydantic import BaseModel

from auth import get_current_restaurant_id
from database import NO_ID, clean, clean_list, db, new_id, now_iso

router = APIRouter(prefix="/menu", tags=["menu"])


class CategoryBody(BaseModel):
    name: str
    sort_order: int = 99


class ItemBody(BaseModel):
    category_id: str
    name: str
    description: str = ""
    price: float
    available: bool = True
    image_url: str = ""
    addon_item_ids: list[str] = []


class ItemUpdate(BaseModel):
    category_id: str | None = None
    name: str | None = None
    description: str | None = None
    price: float | None = None
    available: bool | None = None
    image_url: str | None = None
    addon_item_ids: list[str] | None = None


@router.get("")
async def get_menu(rid: str = Depends(get_current_restaurant_id)):
    categories = clean_list(await db.menu_categories.find({"restaurant_id": rid}, NO_ID).sort("sort_order", 1).to_list(200))
    items = clean_list(await db.menu_items.find({"restaurant_id": rid}, NO_ID).to_list(1000))
    return {"categories": categories, "items": items}


@router.post("/categories")
async def create_category(body: CategoryBody, rid: str = Depends(get_current_restaurant_id)):
    doc = {"id": new_id(), "restaurant_id": rid, **body.model_dump(), "created_at": now_iso()}
    await db.menu_categories.insert_one(doc)
    return clean(doc)


@router.delete("/categories/{category_id}")
async def delete_category(category_id: str, rid: str = Depends(get_current_restaurant_id)):
    await db.menu_categories.delete_one({"id": category_id, "restaurant_id": rid})
    await db.menu_items.delete_many({"category_id": category_id, "restaurant_id": rid})
    return {"ok": True}


@router.post("/items")
async def create_item(body: ItemBody, rid: str = Depends(get_current_restaurant_id)):
    doc = {"id": new_id(), "restaurant_id": rid, **body.model_dump(), "created_at": now_iso()}
    await db.menu_items.insert_one(doc)
    return clean(doc)


@router.put("/items/{item_id}")
async def update_item(item_id: str, body: ItemUpdate, rid: str = Depends(get_current_restaurant_id)):
    updates = {k: v for k, v in body.model_dump().items() if v is not None}
    if updates:
        await db.menu_items.update_one({"id": item_id, "restaurant_id": rid}, {"$set": updates})
    return clean(await db.menu_items.find_one({"id": item_id, "restaurant_id": rid}, NO_ID))


@router.delete("/items/{item_id}")
async def delete_item(item_id: str, rid: str = Depends(get_current_restaurant_id)):
    await db.menu_items.delete_one({"id": item_id, "restaurant_id": rid})
    return {"ok": True}
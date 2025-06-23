from datetime import datetime, timezone
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from uuid import UUID

from app.api.v1.dependencies import get_current_user
from app.core.db_dependencies import get_db
from app.models.enums import ScheduleState
from app.models.firestore_db import FirestoreSession
from app.models.schedule import Schedule, ScheduleCreate, ScheduleUpdate
from app.models.user import User

router = APIRouter()


# ────────────────────────────────────────────────────────────────────
# helpers
# ────────────────────────────────────────────────────────────────────
def _assert_owner(user_id: str, current_user: User):
    if user_id != str(current_user.id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed to access this user's schedules",
        )


# ────────────────────────────────────────────────────────────────────
# routes
# ────────────────────────────────────────────────────────────────────
@router.get("/", response_model=List[Schedule])
async def list_schedules(
    user_id: str,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _assert_owner(user_id, current_user)
    return await db.query("schedules", filters=[("user_id", "==", user_id)])


@router.post("/", response_model=Schedule, status_code=status.HTTP_201_CREATED)
async def create_schedule(
    user_id: str,
    data: ScheduleCreate,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _assert_owner(user_id, current_user)

    schedule_data = data.model_dump()
    schedule_data["product_id"] = str(data.product_id) if data.product_id else None
    schedule_data["user_id"] = user_id
    schedule_data["status"] = ScheduleState.upcoming
    schedule_data["created_at"] = datetime.utcnow()
    schedule_data["modified_at"] = datetime.utcnow()

    # data.run_at is already tz-aware UTC thanks to the validator
    schedule_data["run_at"] = data.run_at

    doc_id = await db.add("schedules", schedule_data)
    return {**schedule_data, "id": doc_id}


@router.get("/{schedule_id}", response_model=Schedule)
async def get_schedule(
    user_id: str,
    schedule_id: str,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _assert_owner(user_id, current_user)

    schedule = await db.get("schedules", schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    if schedule["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return schedule


@router.put("/{schedule_id}", response_model=Schedule)
async def update_schedule(
    user_id: str,
    schedule_id: str,
    data: ScheduleUpdate,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _assert_owner(user_id, current_user)

    schedule = await db.get("schedules", schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    if schedule["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")

    update_data = data.model_dump(exclude_unset=True)
    update_data["modified_at"] = datetime.utcnow()
    if "run_at" in update_data:
        # validator already UTC-normalised
        update_data["run_at"] = update_data["run_at"]
    await db.update("schedules", schedule_id, update_data)
    return await db.get("schedules", schedule_id)


@router.delete("/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_schedule(
    user_id: str,
    schedule_id: str,
    db: FirestoreSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    _assert_owner(user_id, current_user)

    schedule = await db.get("schedules", schedule_id)
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    if schedule["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized")
    await db.delete("schedules", schedule_id)

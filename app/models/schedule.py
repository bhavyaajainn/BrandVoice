from datetime import datetime, timezone
from typing import List
from uuid import UUID, uuid4

from pydantic import validator
from sqlmodel import SQLModel, Field, Column, JSON
from zoneinfo import ZoneInfo

from app.models.enums import Platform, ScheduleState
from app.utils.datetime_utils import parse_run_at


# ---------------------------------------------------------------------
#  ORM / table
# ---------------------------------------------------------------------
class Schedule(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    user_id: UUID = Field(foreign_key="user.id")

    product_id: str | None = Field(default=None, nullable=True)

    platforms: List[Platform] = Field(sa_column=Column(JSON))

    run_at: datetime                      # always UTC in DB
    timezone: str                         # original tz the user chose

    status: ScheduleState = ScheduleState.upcoming

    created_at: datetime = Field(default_factory=datetime.utcnow)
    modified_at: datetime = Field(default_factory=datetime.utcnow, nullable=True)


# ---------------------------------------------------------------------
#  DTOs
# ---------------------------------------------------------------------
class ScheduleCreate(SQLModel):
    product_id: str | None = None
    platforms: List[Platform]

    # allow either datetime or string for flexibility
    timezone: str
    run_at: datetime | str
    

    # ---------- validators ----------
    @validator("run_at", pre=True)
    def _coerce_run_at(cls, v, values):
        tz = values.get("timezone")
        # string → parse and UTC-normalise
        if isinstance(v, str):
            return parse_run_at(v, tz)
        # datetime → ensure tz-aware, then UTC
        if v.tzinfo is None:
            if not tz:
                raise ValueError("Timezone missing for naïve datetime")
            v = v.replace(tzinfo=ZoneInfo(tz))
        return v.astimezone(timezone.utc)


class ScheduleUpdate(SQLModel):
    platforms: List[Platform] | None = None
    timezone: str | None = None
    run_at: datetime | str | None = None
    status: ScheduleState | None = None

    # ---------- validators ----------
    @validator("run_at", pre=True)
    def _coerce_run_at(cls, v, values):
        if v is None:
            return v
        tz = values.get("timezone") or values.get("timezone__root")  # try both
        if isinstance(v, str):
            return parse_run_at(v, tz)
        if v.tzinfo is None:
            if not tz:
                raise ValueError("Timezone missing for naïve datetime")
            v = v.replace(tzinfo=ZoneInfo(tz))
        return v.astimezone(timezone.utc)

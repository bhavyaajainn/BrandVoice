# app/models/enums.py
from enum import Enum

class Platform(str, Enum):
    instagram = "instagram"
    x         = "x"
    facebook  = "facebook"
    youtube   = "youtube"

class ScheduleState(str, Enum):
    upcoming = "upcoming"
    published = "published"
    failed = "failed"

"""
Utilities for robust, time-zone-aware datetime parsing/normalising.
Accepts ‘YYYY-MM-DDTHH:MM’ (24-hour, **no seconds**) with or without an
explicit offset and always returns a tz-aware **UTC** datetime.
"""

from datetime import datetime, timezone
from zoneinfo import ZoneInfo

_ISO_NO_SECONDS_T = "%Y-%m-%dT%H:%M"   # 2025-07-01T14:30
_ISO_NO_SECONDS_S = "%Y-%m-%d %H:%M"   # 2025-07-01 14:30


def parse_run_at(raw: str, tz_str: str | None) -> datetime:
    """
    Parse `raw` and return an aware datetime in UTC.

    Rules
    -----
    • `raw` may include ±HH:MM offset **or** be naïve.
    • If naïve, `tz_str` (IANA name e.g. 'America/New_York') is required
      and will be applied before converting to UTC.
    """

    # 1) First try the built-in ISO parser (handles offsets for free)
    try:
        dt = datetime.fromisoformat(raw)
    except ValueError:
        # Allow single space as separator
        try:
            dt = datetime.strptime(raw, _ISO_NO_SECONDS_S)
        except ValueError:
            raise ValueError(
                "run_at must be ‘YYYY-MM-DDTHH:MM’ (24 h) with optional ±HH:MM offset"
            )

    # 2) If still naïve we need the user-supplied timezone
    if dt.tzinfo is None:
        if not tz_str:
            raise ValueError("Timezone missing: supply the ‘timezone’ field")
        dt = dt.replace(tzinfo=ZoneInfo(tz_str))

    # 3) Normalise everything to UTC for storage/comparisons
    return dt.astimezone(timezone.utc)

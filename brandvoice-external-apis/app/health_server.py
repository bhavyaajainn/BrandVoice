from contextlib import asynccontextmanager
from fastapi import FastAPI
from apscheduler.schedulers.asyncio import AsyncIOScheduler

from app.scheduler_worker import process_due_schedules  # ← your loop

@asynccontextmanager
async def lifespan(app: FastAPI):
    sched = AsyncIOScheduler()
    sched.add_job(process_due_schedules, "interval", seconds=10)
    sched.start()                                  # starts in same event-loop :contentReference[oaicite:0]{index=0}
    print("✅ APScheduler started")
    yield
    sched.shutdown(wait=False)

app = FastAPI(lifespan=lifespan)                   # modern FastAPI lifespan API :contentReference[oaicite:1]{index=1}

@app.get("/health")
async def health():
    return {"status": "ok"}

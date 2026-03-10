from fastapi import FastAPI

from app.api.router import api_router
from app.core.config import settings
from app.db.seed import seed_admin
from app.db.session import SessionLocal
from app.models import PedagogicalRecord, Report, Student, User  # noqa: F401

app = FastAPI(title=settings.app_name, version="0.1.0")


@app.on_event("startup")
def on_startup() -> None:
    with SessionLocal() as db:
        seed_admin(db)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


app.include_router(api_router, prefix=settings.api_v1_prefix)

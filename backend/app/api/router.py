from fastapi import APIRouter

from app.api.v1.assignments import router as assignments_router
from app.api.v1.auth import router as auth_router
from app.api.v1.integrations import router as integrations_router
from app.api.v1.records import router as records_router
from app.api.v1.reports import router as reports_router
from app.api.v1.students import router as students_router
from app.api.v1.users import router as users_router

api_router = APIRouter()
api_router.include_router(auth_router)
api_router.include_router(assignments_router)
api_router.include_router(users_router)
api_router.include_router(students_router)
api_router.include_router(records_router)
api_router.include_router(reports_router)
api_router.include_router(integrations_router)

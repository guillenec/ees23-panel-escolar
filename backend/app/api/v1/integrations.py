from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import require_roles
from app.core.config import settings
from app.db.session import get_db
from app.models.student import Student
from app.models.teacher_student_assignment import TeacherStudentAssignment
from app.models.user import User
from app.services.drive_client import (
    list_folder_items,
    ping_folder_access,
    read_service_account_email,
)

router = APIRouter(prefix="/integrations", tags=["integrations"])


@router.get("/drive/ping")
def drive_ping(_: object = Depends(require_roles("ADMIN"))):
    try:
        service_account_email = read_service_account_email(
            settings.google_drive_service_account_file
        )
        folder = ping_folder_access(
            settings.google_drive_service_account_file,
            settings.google_drive_root_folder_id,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Fallo conexion con Google Drive: {exc}",
        ) from exc

    return {
        "status": "ok",
        "source": settings.google_drive_source,
        "service_account_email": service_account_email,
        "root_folder": folder,
    }


@router.get("/drive/items")
def drive_list_items(
    parent_id: str | None = None,
    search: str | None = None,
    student_id: str | None = None,
    folders_only: bool = False,
    current_user: User = Depends(require_roles("ADMIN", "DOCENTE")),
    db: Session = Depends(get_db),
):
    effective_search = search
    if current_user.role == "DOCENTE":
        if not student_id:
            raise HTTPException(status_code=400, detail="DOCENTE debe indicar student_id")

        assignment = db.scalar(
            select(TeacherStudentAssignment).where(
                TeacherStudentAssignment.teacher_id == current_user.id,
                TeacherStudentAssignment.student_id == student_id,
            )
        )
        if not assignment:
            raise HTTPException(status_code=403, detail="Alumno no asignado al docente")

        if not effective_search:
            student = db.get(Student, student_id)
            if not student:
                raise HTTPException(status_code=404, detail="Alumno no encontrado")
            effective_search = student.last_name

    effective_parent = parent_id or settings.google_drive_root_folder_id
    try:
        items = list_folder_items(
            settings.google_drive_service_account_file,
            effective_parent,
            search=effective_search,
            folders_only=folders_only,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from exc
    except RuntimeError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Fallo listado de Google Drive: {exc}",
        ) from exc

    return {
        "status": "ok",
        "source": settings.google_drive_source,
        "parent_id": effective_parent,
        "student_id": student_id,
        "count": len(items),
        "items": items,
    }

from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import require_roles
from app.core.config import settings
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
    folders_only: bool = False,
    _: object = Depends(require_roles("ADMIN", "DOCENTE")),
):
    effective_parent = parent_id or settings.google_drive_root_folder_id
    try:
        items = list_folder_items(
            settings.google_drive_service_account_file,
            effective_parent,
            search=search,
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
        "count": len(items),
        "items": items,
    }

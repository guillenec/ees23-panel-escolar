from fastapi import APIRouter, Depends, HTTPException

from app.api.deps import require_roles
from app.core.config import settings
from app.services.drive_client import ping_folder_access, read_service_account_email

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

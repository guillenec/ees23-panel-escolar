from __future__ import annotations

import json
from pathlib import Path
from typing import Any


DRIVE_READ_SCOPE = "https://www.googleapis.com/auth/drive.readonly"


def read_service_account_email(credentials_file: str) -> str:
    payload = json.loads(Path(credentials_file).read_text(encoding="utf-8"))
    email = payload.get("client_email", "")
    if not email:
        raise ValueError("Archivo de credenciales invalido: falta client_email")
    return str(email)


def ping_folder_access(credentials_file: str, folder_id: str) -> dict[str, Any]:
    if not credentials_file:
        raise ValueError("Falta GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE")
    if not folder_id:
        raise ValueError("Falta GOOGLE_DRIVE_ROOT_FOLDER_ID")

    credentials_path = Path(credentials_file)
    if not credentials_path.exists():
        raise FileNotFoundError(f"No existe archivo de credenciales: {credentials_file}")

    try:
        from google.oauth2 import service_account
        from googleapiclient.discovery import build
    except ImportError as exc:
        raise RuntimeError(
            "Dependencias Google no instaladas. Ejecuta pip install -r requirements.txt"
        ) from exc

    credentials = service_account.Credentials.from_service_account_file(
        str(credentials_path), scopes=[DRIVE_READ_SCOPE]
    )
    service = build("drive", "v3", credentials=credentials, cache_discovery=False)
    folder = service.files().get(fileId=folder_id, fields="id,name,mimeType").execute()
    return {
        "id": folder.get("id", ""),
        "name": folder.get("name", ""),
        "mime_type": folder.get("mimeType", ""),
    }

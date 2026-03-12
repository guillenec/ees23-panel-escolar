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


def list_folder_items(
    credentials_file: str,
    parent_id: str,
    *,
    search: str | None = None,
    folders_only: bool = False,
    page_size: int = 100,
) -> list[dict[str, Any]]:
    if not credentials_file:
        raise ValueError("Falta GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE")
    if not parent_id:
        raise ValueError("Falta parent_id o GOOGLE_DRIVE_ROOT_FOLDER_ID")

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

    query_parts = [f"'{parent_id}' in parents", "trashed = false"]
    if folders_only:
        query_parts.append("mimeType = 'application/vnd.google-apps.folder'")
    if search:
        safe_search = search.replace("'", "\\'")
        query_parts.append(f"name contains '{safe_search}'")

    response = (
        service.files()
        .list(
            q=" and ".join(query_parts),
            pageSize=page_size,
            fields=(
                "files(id,name,mimeType,modifiedTime,webViewLink,"
                "iconLink,owners(displayName,emailAddress))"
            ),
            orderBy="folder,name",
            supportsAllDrives=True,
            includeItemsFromAllDrives=True,
        )
        .execute()
    )

    items: list[dict[str, Any]] = []
    for row in response.get("files", []):
        mime_type = row.get("mimeType", "")
        items.append(
            {
                "id": row.get("id", ""),
                "name": row.get("name", ""),
                "mime_type": mime_type,
                "kind": "folder" if mime_type == "application/vnd.google-apps.folder" else "file",
                "modified_at": row.get("modifiedTime", ""),
                "web_view_url": row.get("webViewLink", ""),
                "icon_url": row.get("iconLink", ""),
                "owner": _first_owner_label(row.get("owners", [])),
            }
        )
    return items


def _first_owner_label(owners: list[dict[str, Any]]) -> str:
    if not owners:
        return ""
    owner = owners[0]
    return str(owner.get("displayName") or owner.get("emailAddress") or "")

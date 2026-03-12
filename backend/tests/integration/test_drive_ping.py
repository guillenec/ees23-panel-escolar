from types import SimpleNamespace

from fastapi.testclient import TestClient

import app.api.v1.integrations as integrations_api
from app.api.deps import get_current_user
from app.main import app


def _client_without_startup() -> TestClient:
    original_startup = list(app.router.on_startup)
    app.router.on_startup.clear()
    client = TestClient(app)
    app.router.on_startup[:] = original_startup
    return client


def _override_user(role: str):
    def _dep():
        return SimpleNamespace(id="test-user", role=role, is_active=True)

    return _dep


def test_admin_can_ping_drive(monkeypatch) -> None:
    app.dependency_overrides[get_current_user] = _override_user("ADMIN")
    monkeypatch.setattr(
        integrations_api,
        "read_service_account_email",
        lambda _: "ees23-drive-sync@hacelocorto2026.iam.gserviceaccount.com",
    )
    monkeypatch.setattr(
        integrations_api,
        "ping_folder_access",
        lambda *_: {
            "id": "1NAARl6W__6EFN1Hv1mL8He5FAE2XfzA-",
            "name": "EEE_23_2026",
            "mime_type": "application/vnd.google-apps.folder",
        },
    )

    try:
        client = _client_without_startup()
        response = client.get("/api/v1/integrations/drive/ping")
        assert response.status_code == 200
        payload = response.json()
        assert payload["status"] == "ok"
        assert payload["source"] in {"personal", "institucional"}
        assert payload["root_folder"]["id"] == "1NAARl6W__6EFN1Hv1mL8He5FAE2XfzA-"
    finally:
        app.dependency_overrides.clear()


def test_docente_cannot_ping_drive() -> None:
    app.dependency_overrides[get_current_user] = _override_user("DOCENTE")
    try:
        client = _client_without_startup()
        response = client.get("/api/v1/integrations/drive/ping")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()

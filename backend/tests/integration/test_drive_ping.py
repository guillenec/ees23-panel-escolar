from types import SimpleNamespace

from fastapi.testclient import TestClient

import app.api.v1.integrations as integrations_api
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.student import Student
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


class _FakeDb:
    def scalar(self, _query):
        return object()

    def get(self, model, _entity_id):
        if model is Student:
            return SimpleNamespace(last_name="Perez")
        return None


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


def test_docente_can_list_drive_items(monkeypatch) -> None:
    app.dependency_overrides[get_current_user] = _override_user("DOCENTE")
    app.dependency_overrides[get_db] = lambda: _FakeDb()
    monkeypatch.setattr(
        integrations_api,
        "list_folder_items",
        lambda *_args, **_kwargs: [
            {
                "id": "folder-1",
                "name": "inclusion",
                "mime_type": "application/vnd.google-apps.folder",
                "kind": "folder",
                "modified_at": "2026-03-12T00:00:00Z",
                "web_view_url": "https://drive.google.com/drive/folders/folder-1",
                "icon_url": "",
                "owner": "Guillermo",
            }
        ],
    )

    try:
        client = _client_without_startup()
        response = client.get(
            "/api/v1/integrations/drive/items?parent_id=root-123&student_id=00000000-0000-0000-0000-000000000001"
        )
        assert response.status_code == 200
        payload = response.json()
        assert payload["status"] == "ok"
        assert payload["count"] == 1
        assert payload["items"][0]["kind"] == "folder"
    finally:
        app.dependency_overrides.clear()


def test_docente_without_student_id_is_rejected() -> None:
    app.dependency_overrides[get_current_user] = _override_user("DOCENTE")
    app.dependency_overrides[get_db] = lambda: _FakeDb()
    try:
        client = _client_without_startup()
        response = client.get("/api/v1/integrations/drive/items?parent_id=root-123")
        assert response.status_code == 400
    finally:
        app.dependency_overrides.clear()


def test_unknown_role_cannot_list_drive_items() -> None:
    app.dependency_overrides[get_current_user] = _override_user("AUXILIAR")
    try:
        client = _client_without_startup()
        response = client.get("/api/v1/integrations/drive/items?parent_id=root-123")
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()

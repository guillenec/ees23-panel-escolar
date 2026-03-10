from types import SimpleNamespace

from fastapi.testclient import TestClient

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


def test_docente_cannot_create_student() -> None:
    app.dependency_overrides[get_current_user] = _override_user("DOCENTE")
    try:
        client = _client_without_startup()
        response = client.post(
            "/api/v1/students",
            json={"first_name": "A", "last_name": "B", "dni": "40111222"},
        )
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()


def test_docente_cannot_update_student() -> None:
    app.dependency_overrides[get_current_user] = _override_user("DOCENTE")
    try:
        client = _client_without_startup()
        response = client.patch(
            "/api/v1/students/00000000-0000-0000-0000-000000000000",
            json={"first_name": "Nuevo"},
        )
        assert response.status_code == 403
    finally:
        app.dependency_overrides.clear()

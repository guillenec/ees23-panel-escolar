# Backend EES23

## Ejecutar en local

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Credenciales iniciales

- usuario: `admin@ees23.local`
- clave: `admin123`

## Endpoints base

- Swagger: `http://localhost:8000/docs`
- Health: `http://localhost:8000/health`

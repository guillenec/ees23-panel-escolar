# EES23 - Sistema Interno de Gestion Docente

Proyecto para la Escuela de Educacion Especial Ndeg23 (Rio Negro, Argentina).

Este sistema **complementa SAJE** para resolver necesidades de gestion interna docente. No lo reemplaza.

## Vision general

- Centralizar informacion de alumnos, seguimientos y documentos institucionales.
- Reducir tiempos administrativos y mejorar trazabilidad pedagogica.
- Dar una herramienta simple para docentes, con acceso por roles.
- Iniciar en red local institucional (Linux) y dejar base lista para despliegue online futuro.

## Alcance funcional (MVP)

- Autenticacion con JWT y control de roles (`ADMIN`, `DOCENTE`).
- Gestion de alumnos (alta, modificacion, consulta, ficha individual).
- Registro de seguimientos pedagogicos por fecha y docente.
- Generacion de informes desde plantillas institucionales.
- Exportacion PDF.
- Acceso centralizado a documentos institucionales (Drive/Docs).

## Decision clave de arquitectura

Se adopta un enfoque **hibrido**:

- `PostgreSQL` como fuente principal del sistema.
- `Google Sheets` solo para exportes, vistas compartidas e interoperabilidad simple.

Esto evita depender de Sheets como base transaccional y reduce costo de migracion futura.

## Stack base

- Frontend: Next.js (App Router), React, TailwindCSS, Zustand, charts.
- Backend: FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, OpenAPI/Swagger.
- Integraciones: Google Drive, Google Docs, Google Sheets.
- Infra: despliegue inicial on-premise Linux en red escolar.

## Documentacion del proyecto

- Vision y alcance: `README_PROYECTO_EES23.md`
- Arquitectura tecnica completa: `arquitectura-sistema-ees23.md`
- Plan de ejecucion MVP: `roadmap-mvp-ees23.md`
- Bitacora de avances y contexto: `bitacora.md`
- Log de ramas/PR/commits/validaciones: `front_back_pr_log.md`

## Principios no negociables

- Sistema modular, escalable y mantenible.
- Seguridad por defecto y permisos por rol.
- UX simple para contexto escolar con recursos limitados.
- Integraciones preparadas para crecimiento (SAJE, IA asistiva, estadisticas).

## Estado actual

- Definicion inicial de arquitectura y roadmap lista.
- Bootstrap tecnico inicial creado (`backend/`, `frontend/`, `infra/docker/`).
- Seguimiento pedagogico inicial implementado (API + UI basica).
- Informes iniciales implementados (generacion y descarga PDF).
- Pendiente: consolidar autenticacion avanzada, integraciones Google, migraciones y tests.

## Arranque rapido (desarrollo)

Opcion 1 - Docker Compose:

```bash
docker compose -f infra/docker/docker-compose.dev.yml up
```

Opcion 2 - Manual:

1) Backend (`backend/`)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

2) Frontend (`frontend/`)

```bash
npm install
cp .env.example .env.local
npm run dev
```

---

Responsable TIC: Guillermo Agustin Neculqueo

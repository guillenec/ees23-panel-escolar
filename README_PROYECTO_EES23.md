# EES23 - Sistema Interno de Gestion Docente

Proyecto para la Escuela de Educacion Especial Ndeg23 (Rio Negro, Argentina).

Este sistema **complementa SAJE** para resolver necesidades de gestion interna docente. No lo reemplaza.

## Vision general

- Centralizar informacion de alumnos, seguimientos y documentos institucionales.
- Reducir tiempos administrativos y mejorar trazabilidad pedagogica.
- Dar una herramienta simple para docentes, con acceso por roles.
- Iniciar en red local institucional (Linux) y dejar base lista para despliegue online futuro.
- Incorporar navegacion documental (Inclusion/Sede) con acceso directo a archivos de Drive.

## Alcance funcional (MVP)

- Autenticacion con JWT y control de roles (`ADMIN`, `DOCENTE`).
- Gestion de alumnos (alta, modificacion, consulta, ficha individual).
- Registro de seguimientos pedagogicos por fecha y docente.
- Generacion de informes desde plantillas institucionales.
- Exportacion PDF.
- Acceso centralizado a documentos institucionales (Drive/Docs).
- Explorador documental por filtros (anio, localidad, nivel, institucion, estudiante).

## Decision clave de arquitectura

Se adopta un enfoque **hibrido**:

- `PostgreSQL` como fuente principal del sistema.
- `Google Sheets` solo para exportes, vistas compartidas e interoperabilidad simple.
- `Google Drive` como origen documental externo, comenzando por drive personal para pruebas controladas.

Esto evita depender de Sheets como base transaccional y reduce costo de migracion futura.

## Stack base

- Frontend: Next.js (App Router), React, TailwindCSS, Zustand, charts.
- Backend: FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, OpenAPI/Swagger.
- Integraciones: Google Drive, Google Docs, Google Sheets.
- Infra: despliegue inicial on-premise Linux en red escolar.

## Estrategia de integracion Drive (transicion)

- Fase actual: usar drive personal como sandbox para evitar impactos en datos sensibles institucionales.
- Fase posterior: migrar la misma logica a drive institucional con permisos por rol y auditoria.
- Estructura fuente validada en `/home/guillenec/repos-guille/CEE_26`.
- Documento de integracion de referencia: `/home/guillenec/repos-guille/CEE_26/INTEGRACION_APP_EDUCACION_ESPECIAL.md`.
- Carpeta de pruebas compartida para MVP:
  - `https://drive.google.com/drive/folders/1NAARl6W__6EFN1Hv1mL8He5FAE2XfzA-?usp=sharing`

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
- Dashboards separados por rol y redireccion inteligente operativos.
- Pendiente: consolidar integracion documental de Drive (fase personal -> institucional) y E2E de permisos.

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

## Usuario de prueba actual

- Email: `admin@ees23.local`
- Clave: `admin123`
- Rol: `ADMIN`

- Email: `docente@ees23.local`
- Clave: `docente123`
- Rol: `DOCENTE`

Estos usuarios se crean automaticamente por seed de backend para entorno de desarrollo.

## Permisos actuales por rol (MVP)

- `ADMIN`: acceso completo, gestion de usuarios, alta/modificacion de alumnos.
- `DOCENTE`: consulta de alumnos, registro de seguimientos, generacion de informes.
- Dashboard por rol disponible en rutas separadas:
  - `ADMIN` -> `/dashboard/admin`
  - `DOCENTE` -> `/dashboard/docente`

## Nota para despliegue en PC del trabajo

- En esta PC de desarrollo no se configurara autostart del stack.
- En la PC del trabajo se aplicara autostart con `systemd`.
- Guia: `docs/runbooks/servidor-trabajo-autostart.md`

## Troubleshooting rapido

- Si frontend muestra `Failed to fetch`, verificar backend en `http://localhost:8000/health`.
- El backend ya permite login con cuentas internas `.local`.
- En Swagger `Authorize`, usar `username` y `password` (flujo OAuth password en `/api/v1/auth/token`).

---

Responsable TIC: Guillermo Agustin Neculqueo

# Bitacora del proyecto - EES23

## Como usar esta bitacora

- Registrar cada sesion de trabajo con fecha.
- Dejar claro que se hizo, que queda pendiente y riesgos detectados.
- Usar esta bitacora como contexto rapido antes de retomar trabajo.

## Estado inicial

Fecha: 2026-03-10

Se definio y documento la base del proyecto:

- vision general actualizada en `README_PROYECTO_EES23.md`
- arquitectura tecnica completa en `arquitectura-sistema-ees23.md`
- roadmap MVP en `roadmap-mvp-ees23.md`
- plantilla de log de ramas/PR/commits en `front_back_pr_log.md`

Decisiones tomadas:

- sistema complementario a SAJE, no reemplazo
- estrategia hibrida: PostgreSQL principal + Sheets para exportes/interoperabilidad
- despliegue inicial local en red institucional Linux

Pendiente inmediato:

- crear estructura real de carpetas `backend/` y `frontend/`
- bootstrap tecnico de ambos proyectos
- implementar modulo de autenticacion y roles

## Template de entrada por sesion

```text
Fecha:
Responsable:

Objetivo de la sesion:
-

Cambios realizados:
-

Archivos tocados:
-

Decisiones:
-

Pendientes:
-

Bloqueos/Riesgos:
-
```

## Sesion de bootstrap tecnico

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- crear base ejecutable inicial de frontend y backend

Cambios realizados:

- se creo bootstrap de `backend/` con FastAPI + SQLAlchemy + JWT
- se incluyeron endpoints iniciales: auth, users (admin), students (CRUD basico)
- se creo bootstrap de `frontend/` con Next.js + Tailwind + Zustand
- se agregaron pantallas iniciales: home, login, dashboard, listado de alumnos
- se agrego `infra/docker/docker-compose.dev.yml` para levantar stack local

Archivos tocados:

- `backend/*`
- `frontend/*`
- `infra/docker/docker-compose.dev.yml`
- `.gitignore`

Decisiones:

- mantener seed admin inicial para acelerar pruebas locales
- dejar modelo de datos y API listos para iterar modulo seguimiento/informes

Pendientes:

- migraciones Alembic reales
- refresh token y logout seguro
- modulo seguimientos e informes PDF
- hardening de seguridad y pruebas automatizadas

Bloqueos/Riesgos:

- falta instalar dependencias y correr validaciones en el entorno real

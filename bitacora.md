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

## Sesion de avance - seguimiento pedagogico inicial

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- habilitar seguimiento pedagogico basico de punta a punta

Cambios realizados:

- backend: nuevo endpoint para listar y crear seguimientos por alumno
- backend: nuevos esquemas `PedagogicalRecordCreate` y `PedagogicalRecordRead`
- frontend: nueva vista `students/[id]/records` para cargar/consultar seguimientos
- frontend: acceso directo desde listado de alumnos
- docker: ajuste de puerto postgres host `5433` para evitar conflicto local

Pendientes:

- editar y eliminar seguimientos
- filtros por fecha/docente
- validaciones y test automatizados

## Sesion de avance - seguimiento CRUD completo

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- completar CRUD de seguimientos

Cambios realizados:

- backend: se agregaron endpoints `PATCH` y `DELETE` para seguimientos
- frontend: se agrego UI para editar y eliminar cada seguimiento desde ficha del alumno
- frontend: cliente API ajustado para manejar respuestas `204 No Content`

Estado:

- seguimiento quedo completo para ciclo basico: alta, listado, edicion, borrado

## Sesion de avance - persistencia de sesion frontend

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- mantener sesion iniciada entre reinicios de navegador/pc

Cambios realizados:

- store de autenticacion migrado a `zustand/persist` con `localStorage`
- hidratacion controlada con bandera `hasHydrated` para evitar estados falsos al cargar
- login redirecciona automaticamente a dashboard si ya hay sesion valida local

Impacto:

- la experiencia de uso mejora en entornos de uso diario escolar

## Sesion de avance - modulo de informes PDF inicial

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- habilitar generacion de informes y descarga PDF

Cambios realizados:

- backend: nuevo modelo `Report` y rutas `GET /reports`, `POST /reports/generate`, `GET /reports/{id}/pdf`
- backend: generacion de PDF con `reportlab` desde datos del alumno y resumen
- frontend: nueva pantalla `/reports` para generar informes y descargar PDF
- frontend: acceso al modulo desde dashboard

Pendientes:

- templates institucionales avanzadas para informes
- almacenamiento del PDF en Drive (futuro)

## Sesion de avance - alembic y migraciones reales

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- pasar de `create_all` a migraciones controladas

Cambios realizados:

- se integro Alembic (`alembic.ini`, `alembic/env.py`, `alembic/versions/0001_initial_schema.py`)
- se agrego migracion inicial para `users`, `students`, `pedagogical_records`, `reports`
- backend ahora inicia asumiendo migraciones aplicadas (sin `create_all`)
- `docker-compose` ejecuta `alembic upgrade head` antes de levantar API

## Sesion de avance - tests base backend y frontend

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- dejar base de pruebas automatizadas para evolucion segura

Cambios realizados:

- backend: test unitario de seguridad JWT/hash en `backend/tests/unit/test_security.py`
- frontend: configuracion Vitest y test unitario en `frontend/src/lib/date-utils.test.ts`
- se agregaron scripts/comandos de prueba en README de frontend y backend

## Sesion de avance - CI base

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- automatizar validaciones minimas en push/pr

Cambios realizados:

- workflow `/.github/workflows/ci.yml` agregado
- job backend: instala dependencias y ejecuta `pytest`
- job frontend: `npm ci`, `npm run test`, `npm run build`

## Sesion de avance - auth hardening basico y runbook servidor trabajo

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- reforzar flujo de sesion y dejar documentado autostart para futura PC servidor

Cambios realizados:

- backend: endpoint `GET /api/v1/auth/me`
- frontend: guard de rutas privadas y boton de cierre de sesion
- docs: runbook `docs/runbooks/servidor-trabajo-autostart.md`
- docs: aclaracion explicita de que el autostart se implementara en la PC del trabajo

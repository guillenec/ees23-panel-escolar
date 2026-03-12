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

## Sesion de avance - fix login local y permisos por rol

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- resolver error de login en `.local` y reforzar controles por rol

Cambios realizados:

- backend: CORS habilitado para `localhost:3000` y `127.0.0.1:3000`
- backend: schemas de auth/usuario aceptan emails internos `.local`
- backend: endpoints de alumnos, seguimientos e informes usan `require_roles("ADMIN", "DOCENTE")`
- seed: agregado usuario `docente@ees23.local` para pruebas de rol DOCENTE

Resultado:

- login con `admin@ees23.local` funciona
- error `Failed to fetch` por CORS queda resuelto

## Sesion de avance - permisos por accion (ADMIN/DOCENTE)

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- aplicar permisos mas finos para operaciones sensibles

Cambios realizados:

- `POST /students` y `PATCH /students/{id}` quedan restringidos a `ADMIN`
- consultas de alumnos y modulos docentes mantienen acceso `ADMIN`/`DOCENTE`
- test unitario nuevo para `require_roles` en `backend/tests/unit/test_roles.py`

## Sesion de avance - permisos finos en seguimientos/informes + Swagger OAuth

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- cerrar permisos por autoria y corregir experiencia de autorizacion en Swagger

Cambios realizados:

- `oauth2_scheme` pasa a `tokenUrl=/api/v1/auth/token`
- nuevo endpoint `POST /api/v1/auth/token` compatible con formulario OAuth2
- seguimientos: `DOCENTE` solo puede editar/eliminar sus propios registros; `ADMIN` puede todo
- informes: `DOCENTE` solo lista/descarga informes propios; `ADMIN` ve todos

Validaciones:

- login JSON y OAuth form funcionando
- verificaciones E2E de 403 para docente no autor sobre recursos ajenos

## Sesion de avance - reflejo de permisos en frontend

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- alinear UI con reglas de autorizacion del backend

Cambios realizados:

- `seguimientos`: botones editar/eliminar visibles solo para ADMIN o docente autor
- `informes`: mensaje contextual para DOCENTE indicando que ve solo sus informes

## Sesion de avance - pruebas authz y dashboards por rol

Fecha: 2026-03-10
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- agregar pruebas de autorizacion por endpoint y separar dashboards por rol

Cambios realizados:

- backend: tests de integracion `backend/tests/integration/test_authz_endpoints.py`
- backend: dependencia `httpx` agregada para `TestClient`
- frontend: rutas nuevas `/dashboard/admin` y `/dashboard/docente`
- frontend: `/dashboard` ahora redirige segun rol obtenido desde `/auth/me`

## Sesion de avance - base de refresh token

Fecha: 2026-03-11
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- retomar continuidad del hardening de sesion con base de refresh token

Cambios realizados:

- backend: login JSON (`/auth/login`) y OAuth form (`/auth/token`) ahora devuelven `access_token` + `refresh_token`
- backend: nuevo endpoint `POST /api/v1/auth/refresh` para renovar sesion con refresh token valido
- backend: JWT incorpora claim `token_type` (`access` o `refresh`) para separar usos
- backend: tests unitarios actualizados en `backend/tests/unit/test_security.py`
- frontend: store de auth persiste `token` y `refreshToken`; login/logout ya usan sesion completa

Pendientes:

- integrar refresh automatico ante `401` en cliente frontend
- agregar pruebas de integracion para flujo `/auth/refresh`

## Sesion de avance - auto refresh en cliente + test de integracion

Fecha: 2026-03-11
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- cerrar el ciclo minimo de renovacion de sesion para evitar relogin manual por expiracion de access token

Cambios realizados:

- frontend: `apiFetch` ahora expone `ApiError` con `status` HTTP para control de errores de auth
- frontend: nuevo helper `apiFetchWithRefresh` que ante `401` intenta `POST /auth/refresh`, actualiza sesion y reintenta la request una vez
- frontend: pantallas `dashboard`, `students`, `students/[id]/records` y `reports` migradas a helper con refresh automatico
- backend: nuevo test de integracion `backend/tests/integration/test_auth_refresh.py` para validar renovacion valida y rechazo de access token en `/auth/refresh`

Pendientes:

- agregar cobertura frontend para helper de refresh en pruebas unitarias

## Sesion de avance - cobertura frontend helper refresh

Fecha: 2026-03-11
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- validar con pruebas unitarias el comportamiento de auto refresh en cliente

Cambios realizados:

- frontend: nuevo archivo `frontend/src/lib/api-client.test.ts`
- se cubren escenarios de request directa OK, `401` + refresh exitoso con retry, refresh fallido con limpieza de sesion y error por sesion inexistente
- ejecucion local frontend: `npm run test -- --no-cache` OK (6 tests)

Pendientes:

- ejecutar bateria backend cuando este disponible `pytest` en entorno

## Sesion de avance - base de integracion Drive por service account

Fecha: 2026-03-12
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- habilitar conectividad inicial segura con Drive personal para avanzar el modulo documental

Cambios realizados:

- backend: nuevas variables `GOOGLE_DRIVE_SERVICE_ACCOUNT_FILE`, `GOOGLE_DRIVE_ROOT_FOLDER_ID`, `GOOGLE_DRIVE_SOURCE`
- backend: endpoint protegido `GET /api/v1/integrations/drive/ping` (solo `ADMIN`) para validar acceso a carpeta raiz
- backend: servicio `drive_client` para leer credenciales de cuenta de servicio y consultar metadatos de carpeta
- backend: nuevas dependencias `google-auth` y `google-api-python-client`
- backend: test de integracion `backend/tests/integration/test_drive_ping.py`
- docs: worklog y bitacoras actualizadas con la estrategia Drive personal -> institucional

Decisiones:

- no guardar el JSON de credenciales dentro del repo
- usar ruta local segura (`/home/guillenec/.config/ees23/drive-sa.json`) y referenciarla por `.env`
- mantener fase actual en drive personal y replicar flujo luego en drive institucional

Pendientes:

- conectar UI de explorador documental a endpoints reales de integracion
- definir importador de alumnos/sedes desde CSV con validaciones de datos

## Cierre de sesion - commits y estado

Fecha: 2026-03-12
Responsable: OpenCode + Guillermo

Objetivo de la sesion:

- cerrar iteracion de documentacion, mejora visual frontend y base tecnica de integracion Drive

Cambios consolidados:

- commit `da2f7bf`: integracion base Drive por service account + endpoint ping + mejoras UI portada/dashboards + docs actualizadas
- commit `c8b5c29`: actualizacion de `front_back_pr_log.md` con registro del commit tecnico
- variables de entorno Drive definidas para backend (`GOOGLE_DRIVE_*`)
- credencial local movida a ruta segura fuera del repo (`/home/guillenec/.config/ees23/drive-sa.json`)

Estado al cierre:

- rama `main` queda adelantada localmente respecto a `origin/main`
- pruebas frontend OK (`npm run test -- --no-cache`)
- pruebas backend pendientes por entorno sin `pytest`

Pendiente proxima sesion:

- probar `GET /api/v1/integrations/drive/ping` en entorno activo con usuario `ADMIN`
- iniciar endpoint de listado documental filtrable (anio/localidad/nivel/institucion/docente/estudiante)

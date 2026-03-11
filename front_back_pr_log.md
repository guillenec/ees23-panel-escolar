# Front/Back PR Worklog

## Objetivo del archivo

Registrar por rama:

- objetivo tecnico
- cambios realizados
- commits
- validaciones locales/CI
- estado para merge

---

## Template de registro por rama

```markdown
# PR Worklog - <tipo> - <nombre-rama>

## Objetivo de la rama

Describir en una linea el objetivo principal de la rama.

## Alcance

- Frontend
- Backend
- Infra
- Docs

## Cambios realizados

- [ ] Cambio 1
- [ ] Cambio 2
- [ ] Cambio 3

## Commits realizados

- `tipo(scope): mensaje`

## Archivos clave

- `ruta/archivo-1`
- `ruta/archivo-2`

## Validaciones locales

Frontend (`frontend/`):

- `npm run lint` -> PENDIENTE
- `npm run test` -> PENDIENTE
- `npm run build` -> PENDIENTE

Backend (`backend/`):

- `ruff check .` -> PENDIENTE
- `pytest` -> PENDIENTE
- `alembic upgrade head` -> PENDIENTE

## Validaciones CI/CD

- Lint -> PENDIENTE
- Tests -> PENDIENTE
- Build -> PENDIENTE
- Security scan -> PENDIENTE

## Checklist antes de PR a develop

- [ ] Rama creada desde `develop`
- [ ] Commits convencionales y atomicos
- [ ] Lint OK
- [ ] Tests OK
- [ ] Build OK
- [ ] Migraciones probadas
- [ ] Documentacion actualizada

## Riesgos y notas

-

## Estado

- Draft / Ready for review / Merged
```

---

## Registro actual

### Rama: `docs/arquitectura-inicial-ees23`

Objetivo:

- definir arquitectura base, roadmap MVP y documentacion de contexto

Cambios realizados:

- [x] reescritura de vision general en `README_PROYECTO_EES23.md`
- [x] creacion de `arquitectura-sistema-ees23.md`
- [x] creacion de `roadmap-mvp-ees23.md`
- [x] creacion de `bitacora.md`
- [x] creacion de `front_back_pr_log.md`

Commits:

- pendiente

Validaciones:

- docs, sin ejecucion de build/tests por no existir aun frontend/backend implementados

---

### Rama sugerida: `feat/bootstrap-fullstack-mvp-base`

Objetivo:

- dejar base ejecutable para desarrollo MVP (frontend + backend + postgres)

Cambios realizados:

- [x] bootstrap backend FastAPI + SQLAlchemy + JWT
- [x] seed admin inicial para pruebas
- [x] endpoints base de autenticacion/usuarios/alumnos
- [x] bootstrap frontend Next.js + Tailwind + Zustand
- [x] pantallas iniciales: login, dashboard, alumnos
- [x] docker compose dev para stack local

Commits:

- pendiente

Archivos clave:

- `backend/app/main.py`
- `backend/app/api/v1/auth.py`
- `backend/app/api/v1/students.py`
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/students/page.tsx`
- `infra/docker/docker-compose.dev.yml`

Validaciones:

- pendientes de ejecucion local en siguiente sesion

---

### Rama activa: `main` (iteracion continua local)

Objetivo:

- completar modulo de seguimiento pedagogico y preparar siguientes hitos

Cambios realizados (iteracion actual):

- [x] `PATCH /api/v1/students/{student_id}/records/{record_id}`
- [x] `DELETE /api/v1/students/{student_id}/records/{record_id}`
- [x] UI frontend para editar/eliminar seguimientos
- [x] ajuste cliente API para respuestas HTTP 204
- [x] persistencia de sesion frontend con Zustand persist (`localStorage`)
- [x] modulo inicial de informes (API + UI + descarga PDF)
- [x] Alembic integrado con migracion inicial y upgrade automatico en compose
- [x] tests base backend/frontend agregados
- [x] CI base en GitHub Actions (`pytest`, `npm test`, `npm build`)
- [x] hardening auth basico (`/auth/me`, rutas privadas, logout)
- [x] runbook de autostart para futura PC servidor trabajo
- [x] fix login para cuentas `.local` + CORS frontend/backend
- [x] control de roles en alumnos/seguimientos/informes (`ADMIN`, `DOCENTE`)
- [x] permisos por accion: alta/edicion de alumnos restringida a `ADMIN`
- [x] permisos por autoria en seguimientos/informes (docente solo recursos propios)
- [x] endpoint OAuth form para Swagger (`/auth/token`)
- [x] UI alineada a permisos (acciones visibles segun rol/autoria)
- [x] tests integracion authz para endpoints (`backend/tests/integration/test_authz_endpoints.py`)
- [x] dashboards separados por rol + redireccion inteligente desde `/dashboard`
- [x] base de refresh token: endpoint `/auth/refresh` + sesion frontend con `refreshToken`
- [x] refresh automatico en cliente ante `401` con retry unico y logout si refresh falla
- [x] test integracion backend para `/auth/refresh` (caso valido + token invalido)

Commits:

- `feat(records): complete pedagogical record CRUD flow` (`545b473`)
- `feat(auth): persist frontend session with zustand` (`76833b2`)
- `feat(reports): add initial report generation and PDF export` (`55c35c8`)
- `feat(db): add Alembic migrations and startup integration` (`90baf90`)
- `test(base): add backend and frontend test foundations` (`f998f67`)
- `ci(base): add backend and frontend validation workflows` (`a4d0db2`)
- `docs(worklog): register ci commit in log` (`9bc3df7`)
- `feat(auth): add protected routes, logout, and work-server runbook` (`bb8ea0b`)
- `docs(worklog): record auth-hardening and runbook commit` (`e6df3d0`)
- `fix(auth): support local accounts and enforce role guards` (`3d533ae`)
- `feat(authz): restrict student write actions to admin` (`57df53d`)
- `feat(authz): enforce ownership rules and add oauth token endpoint` (`24c0aff`)
- `feat(frontend): align permission visibility with auth rules` (`160071b`)
- `test(authz): add integration checks for role-protected student writes` (`7be8490`)
- `feat(dashboard): split role dashboards and role-based redirect` (`4a590a3`)
- `docs(worklog): register latest authz and dashboard commits` (`9eb72f5`)
- `feat(auth): add refresh token foundation across API and frontend session` (`367e65f`)
- `feat(auth): add client auto-refresh flow and auth refresh integration tests` (`6ed376d`)

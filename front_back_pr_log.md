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

Commits:

- pendiente (se registran al cierre de cada subfase)

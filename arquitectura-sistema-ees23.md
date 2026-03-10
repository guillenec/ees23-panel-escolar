# Arquitectura tecnica - EES23

## 1) Contexto y objetivo

EES23 requiere un sistema interno para gestion docente que complemente SAJE.

Objetivos principales:

- organizacion de alumnos
- seguimiento pedagogico
- generacion de informes
- acceso a documentos institucionales
- centralizacion de herramientas docentes

Restricciones:

- hardware escolar limitado
- despliegue inicial local en red institucional
- operacion simple y bajo costo de mantenimiento

## 2) Decision de arquitectura de datos (hibrido)

Si, la recomendacion es correcta: **arrancar hibrido**.

### Modelo propuesto

- `PostgreSQL`: base de datos principal (verdad del sistema)
- `Google Sheets`: exportes, vistas compartidas y carga/descarga simple
- `Google Drive/Docs`: almacenamiento de documentos y plantillas

### Por que no usar solo Sheets

- dificulta integridad referencial
- complica concurrencia multiusuario
- limita auditoria y permisos finos
- encarece migracion cuando crece el sistema

## 3) Arquitectura logica por capas

1. Capa de presentacion (Frontend Next.js)
2. Capa de API (FastAPI)
3. Capa de dominio y servicios (reglas de negocio)
4. Capa de persistencia (PostgreSQL)
5. Capa de integraciones externas (Google APIs)
6. Capa de observabilidad y operacion (logs, metricas, backups)

## 4) Estructura completa de carpetas (monorepo sugerido)

```text
educacion_especial_2026/
├── README_PROYECTO_EES23.md
├── arquitectura-sistema-ees23.md
├── roadmap-mvp-ees23.md
├── bitacora.md
├── front_back_pr_log.md
├── .editorconfig
├── .gitignore
├── docs/
│   ├── decisiones/
│   │   ├── ADR-001-arquitectura-hibrida.md
│   │   └── ADR-002-autenticacion-jwt.md
│   ├── api/
│   │   └── openapi-export.json
│   ├── data/
│   │   └── diccionario-datos.md
│   └── runbooks/
│       ├── backup-restore.md
│       └── despliegue-local.md
├── infra/
│   ├── docker/
│   │   ├── docker-compose.dev.yml
│   │   └── docker-compose.prod-local.yml
│   ├── nginx/
│   │   └── ees23.conf
│   ├── scripts/
│   │   ├── backup_db.sh
│   │   ├── restore_db.sh
│   │   └── healthcheck.sh
│   └── systemd/
│       ├── ees23-backend.service
│       └── ees23-frontend.service
├── backend/
│   ├── pyproject.toml
│   ├── requirements.txt
│   ├── alembic.ini
│   ├── alembic/
│   │   ├── env.py
│   │   └── versions/
│   ├── app/
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   ├── logging.py
│   │   │   └── exceptions.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── seed.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── role.py
│   │   │   ├── student.py
│   │   │   ├── guardian.py
│   │   │   ├── enrollment.py
│   │   │   ├── pedagogical_record.py
│   │   │   ├── report.py
│   │   │   ├── institutional_document.py
│   │   │   ├── audit_log.py
│   │   │   └── sync_job.py
│   │   ├── schemas/
│   │   │   ├── auth.py
│   │   │   ├── user.py
│   │   │   ├── student.py
│   │   │   ├── pedagogical_record.py
│   │   │   ├── report.py
│   │   │   └── document.py
│   │   ├── api/
│   │   │   ├── deps.py
│   │   │   ├── router.py
│   │   │   └── v1/
│   │   │       ├── auth.py
│   │   │       ├── users.py
│   │   │       ├── students.py
│   │   │       ├── records.py
│   │   │       ├── reports.py
│   │   │       ├── documents.py
│   │   │       ├── dashboard.py
│   │   │       └── integrations.py
│   │   ├── services/
│   │   │   ├── auth_service.py
│   │   │   ├── student_service.py
│   │   │   ├── record_service.py
│   │   │   ├── report_service.py
│   │   │   ├── pdf_service.py
│   │   │   ├── drive_service.py
│   │   │   ├── docs_service.py
│   │   │   └── sheets_service.py
│   │   ├── repositories/
│   │   │   ├── user_repository.py
│   │   │   ├── student_repository.py
│   │   │   └── record_repository.py
│   │   ├── templates/
│   │   │   └── informes/
│   │   └── workers/
│   │       ├── jobs.py
│   │       └── scheduler.py
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
└── frontend/
    ├── package.json
    ├── next.config.ts
    ├── tailwind.config.ts
    ├── postcss.config.js
    ├── public/
    │   └── assets/
    ├── src/
    │   ├── app/
    │   │   ├── (auth)/
    │   │   │   └── login/page.tsx
    │   │   ├── (private)/
    │   │   │   ├── dashboard/page.tsx
    │   │   │   ├── alumnos/
    │   │   │   │   ├── page.tsx
    │   │   │   │   ├── nuevo/page.tsx
    │   │   │   │   └── [id]/page.tsx
    │   │   │   ├── seguimientos/
    │   │   │   │   ├── page.tsx
    │   │   │   │   └── nuevo/page.tsx
    │   │   │   ├── informes/page.tsx
    │   │   │   ├── documentos/page.tsx
    │   │   │   └── configuracion/page.tsx
    │   │   ├── api/
    │   │   │   └── auth/logout/route.ts
    │   │   ├── layout.tsx
    │   │   ├── page.tsx
    │   │   └── globals.css
    │   ├── components/
    │   │   ├── ui/
    │   │   ├── charts/
    │   │   ├── forms/
    │   │   ├── layout/
    │   │   └── documents/
    │   ├── features/
    │   │   ├── auth/
    │   │   ├── students/
    │   │   ├── records/
    │   │   ├── reports/
    │   │   └── documents/
    │   ├── lib/
    │   │   ├── api-client.ts
    │   │   ├── auth.ts
    │   │   ├── validators.ts
    │   │   └── constants.ts
    │   ├── store/
    │   │   ├── auth-store.ts
    │   │   ├── ui-store.ts
    │   │   └── filters-store.ts
    │   ├── hooks/
    │   ├── styles/
    │   └── types/
    └── tests/
        ├── unit/
        ├── integration/
        └── e2e/
```

## 5) Backend (FastAPI) - estructura funcional

### Responsabilidades

- exponer API REST para frontend
- aplicar autenticacion/autorizacion por roles
- ejecutar reglas de negocio
- persistir datos en PostgreSQL
- integrar Google Drive/Docs/Sheets
- generar PDFs de informes

### Convenciones

- versionado API por prefijo: `/api/v1`
- validacion con Pydantic
- capa `service` para logica, `repository` para acceso a datos
- migraciones con Alembic
- OpenAPI auto-generado

## 6) Frontend (Next.js) - estructura funcional

### Arquitectura de UI

- App Router con segmentos `(auth)` y `(private)`
- composicion por features para aislar dominio
- estado global con Zustand para auth/filtros/ui
- persistencia local de sesion con `zustand/persist` para continuidad operativa
- fetch server/client segun caso de uso

### Vistas MVP

- login
- dashboard docente
- listado y ficha de alumnos
- carga y consulta de seguimientos
- generacion de informes
- biblioteca de documentos institucionales

## 7) Modelo de base de datos (PostgreSQL)

### Tablas nucleares

1. `users`
   - `id` (uuid, pk)
   - `full_name`
   - `email` (unique)
   - `password_hash`
   - `is_active`
   - `created_at`, `updated_at`

2. `roles`
   - `id` (smallint, pk)
   - `name` (`ADMIN`, `DOCENTE`)

3. `user_roles`
   - `user_id` (fk users)
   - `role_id` (fk roles)
   - pk compuesta (`user_id`, `role_id`)

4. `students`
   - `id` (uuid, pk)
   - `first_name`, `last_name`
   - `dni` (unique)
   - `birth_date`
   - `school_year`
   - `shift` (maniana/tarde)
   - `status` (activo/inactivo)
   - `created_at`, `updated_at`

5. `guardians`
   - `id` (uuid, pk)
   - `student_id` (fk students)
   - `full_name`
   - `relation_type` (madre/padre/tutor)
   - `phone`, `email`

6. `enrollments`
   - `id` (uuid, pk)
   - `student_id` (fk students)
   - `academic_year`
   - `group_name`
   - `primary_teacher_id` (fk users)

7. `pedagogical_records`
   - `id` (uuid, pk)
   - `student_id` (fk students)
   - `teacher_id` (fk users)
   - `record_date`
   - `record_type`
   - `observation`
   - `actions_taken`
   - `agreements`
   - `next_steps`
   - `created_at`

8. `reports`
   - `id` (uuid, pk)
   - `student_id` (fk students)
   - `created_by` (fk users)
   - `period_label`
   - `template_key`
   - `status` (draft/generated/signed)
   - `pdf_path`
   - `drive_file_id` (nullable)
   - `created_at`

9. `institutional_documents`
   - `id` (uuid, pk)
   - `title`
   - `category`
   - `drive_file_id`
   - `is_template` (bool)
   - `created_by` (fk users)
   - `created_at`

10. `audit_logs`
    - `id` (bigserial, pk)
    - `actor_user_id` (fk users)
    - `action`
    - `entity_name`
    - `entity_id`
    - `payload_json`
    - `created_at`

11. `sync_jobs`
    - `id` (uuid, pk)
    - `job_type` (sheets_export/drive_sync)
    - `status` (pending/running/success/error)
    - `started_at`, `finished_at`
    - `result_json`

## 8) Endpoints principales

### 8.1 Autenticacion

- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

### 8.2 Usuarios y roles (ADMIN)

- `GET /api/v1/users`
- `POST /api/v1/users`
- `PATCH /api/v1/users/{user_id}`
- `POST /api/v1/users/{user_id}/roles`
- `DELETE /api/v1/users/{user_id}/roles/{role}`

### 8.3 Alumnos

- `GET /api/v1/students`
- `POST /api/v1/students`
- `GET /api/v1/students/{student_id}`
- `PATCH /api/v1/students/{student_id}`
- `GET /api/v1/students/{student_id}/profile`

### 8.4 Seguimientos

- `GET /api/v1/students/{student_id}/records`
- `POST /api/v1/students/{student_id}/records`
- `PATCH /api/v1/students/{student_id}/records/{record_id}`
- `DELETE /api/v1/students/{student_id}/records/{record_id}`

### 8.5 Informes

- `GET /api/v1/reports`
- `POST /api/v1/reports/generate`
- `GET /api/v1/reports/{report_id}/pdf`

### 8.6 Documentos institucionales

- `GET /api/v1/documents`
- `POST /api/v1/documents`
- `GET /api/v1/documents/{document_id}`
- `POST /api/v1/documents/{document_id}/duplicate-from-template`

### 8.7 Integraciones

- `POST /api/v1/integrations/sheets/export/students`
- `POST /api/v1/integrations/sheets/export/records`
- `POST /api/v1/integrations/drive/sync`
- `GET /api/v1/integrations/jobs/{job_id}`

## 9) Ejemplos de rutas API (request/response)

### Login

`POST /api/v1/auth/login`

```json
{
  "email": "docente@ees23.edu.ar",
  "password": "******"
}
```

```json
{
  "access_token": "jwt_access",
  "refresh_token": "jwt_refresh",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "8f66...",
    "full_name": "Docente Ejemplo",
    "roles": ["DOCENTE"]
  }
}
```

### Alta alumno

`POST /api/v1/students`

```json
{
  "first_name": "Ana",
  "last_name": "Perez",
  "dni": "40111222",
  "birth_date": "2014-05-09",
  "school_year": "2026",
  "shift": "maniana"
}
```

### Registrar seguimiento

`POST /api/v1/students/{student_id}/records`

```json
{
  "record_date": "2026-03-10",
  "record_type": "observacion_aula",
  "observation": "Participa con apoyo visual.",
  "actions_taken": "Se reforzo rutina de inicio.",
  "agreements": "Continuar con apoyos visuales.",
  "next_steps": "Evaluar avances en 2 semanas."
}
```

### Generar informe PDF

`POST /api/v1/reports/generate`

```json
{
  "student_id": "5aa1...",
  "period_label": "1er trimestre 2026",
  "template_key": "informe_pedagogico_base"
}
```

## 10) Esquema de autenticacion y autorizacion

### JWT recomendado

- Access token corto: 15 min
- Refresh token: 7 dias
- Rotacion de refresh token
- Revocacion de sesiones en logout

### Flujo

1. Usuario inicia sesion con email/password.
2. API valida credenciales y roles.
3. API devuelve access + refresh.
4. Frontend usa access en `Authorization: Bearer <token>`.
5. Al vencer access, usa refresh para renovar.

### Control de permisos

- `ADMIN`: usuarios, configuracion, acceso total.
- `DOCENTE`: alumnos, seguimientos, informes, documentos.

Implementacion sugerida:

- dependencia FastAPI `require_roles(["ADMIN"])`
- claims JWT con `sub`, `roles`, `exp`, `jti`

## 11) Integracion con Google Workspace

### Google Drive

- guardar `drive_file_id` en DB
- acceder via cuenta de servicio
- carpetas por alumno solo si aplica flujo documental

### Google Docs

- plantillas institucionales versionadas
- merge de datos para borradores de informes

### Google Sheets

- exporte no bloqueante mediante `sync_jobs`
- importes controlados solo para migraciones/carga inicial

## 12) Generacion de PDF

Opcion recomendada backend:

- implementacion inicial MVP con `reportlab`
- evolucion sugerida: motor HTML + CSS a PDF (`WeasyPrint` o `wkhtmltopdf`)
- guardar ruta local y/o subir copia a Drive

## 13) Despliegue inicial local (on-premise)

### Topologia base

- 1 PC Linux como servidor local
- servicios: `nginx` + `frontend` + `backend` + `postgres`
- acceso via IP local: `http://ip-servidor`

### Requisitos minimos sugeridos

- CPU: 4 hilos
- RAM: 8 GB (minimo operativo 4 GB)
- Disco: SSD 240 GB
- Backup diario a disco externo + semanal en nube

## 14) Observabilidad y mantenimiento

- logs estructurados en backend
- endpoint de salud: `/health`
- backup automatizado PostgreSQL
- restauracion probada mensualmente
- control de errores en UI con mensajes claros

## 15) Seguridad y cumplimiento basico

- contrasenias con hash fuerte (`bcrypt`/`argon2`)
- HTTPS en despliegue online futuro
- minimo privilegio por rol
- auditoria de operaciones sensibles
- politicas de retencion de datos

## 16) Escalabilidad futura

Diseño preparado para:

- integracion con SAJE (si se habilitan APIs/formatos)
- modulo IA asistiva para borradores de informes
- tableros estadisticos educativos
- portal institucional/blog (modulo opcional)

## 17) Modulo futuro sugerido: Novedades institucionales (blog liviano)

No es parte del MVP, pero puede agregarse despues con:

- publicaciones de noticias institucionales
- roles de editor y publicador
- carga de imagenes y documentos
- opcion de publicar resumen en Facebook

Esto puede vivir dentro del mismo frontend como modulo desacoplado.

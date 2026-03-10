# Roadmap MVP - EES23

## Objetivo del MVP

Entregar un sistema interno usable por docentes para alumnos, seguimientos, informes y documentos, en red local institucional.

## Estado rapido

- Completado: base tecnica inicial (frontend, backend, docker)
- Completado parcial: modulo de seguimiento pedagogico (alta, listado, edicion, borrado)
- Completado: persistencia de sesion frontend con Zustand persist
- Completado parcial: modulo de informes (generacion + descarga PDF)
- Completado: migraciones Alembic iniciales
- Completado: tests base backend/frontend
- Completado: CI base en GitHub Actions (tests + build)
- Completado parcial: hardening auth (ruta privada + logout + `/auth/me`)
- Completado parcial: roles finos en API (`ADMIN`/`DOCENTE`) para modulos nucleares
- Completado parcial: permisos por accion en alumnos (alta/edicion solo `ADMIN`)
- Siguiente foco: cobertura de pruebas funcionales de autorizacion por endpoint

## Fase 0 - Definicion (semana 1)

- cerrar alcance funcional MVP
- validar campos de alumnos/seguimientos con docentes
- definir plantillas institucionales iniciales
- acordar politicas de acceso y roles

Entregables:

- backlog priorizado
- diccionario de datos v1
- criterios de aceptacion por modulo

## Fase 1 - Base tecnica (semanas 2-3)

- inicializar `backend/` con FastAPI + SQLAlchemy + Alembic
- inicializar `frontend/` con Next.js + Tailwind + Zustand
- montar PostgreSQL local (docker o servicio nativo)
- configurar autenticacion JWT
- configurar CI basica (lint + tests)

Entregables:

- login funcional
- estructura de proyecto lista para crecer

## Fase 2 - Modulo Alumnos (semanas 4-5)

- CRUD alumnos
- ficha individual
- filtros de busqueda (nombre, DNI, estado)
- validaciones de datos de entrada

Entregables:

- modulo alumnos operativo

## Fase 3 - Seguimiento pedagogico (semanas 6-7)

- alta de registros por fecha/docente
- historial cronologico por alumno
- edicion de registros con auditoria minima

Entregables:

- seguimiento pedagogico operativo

## Fase 4 - Informes y PDF (semanas 8-9)

- plantillas de informe (HTML/Docs)
- generacion automatica de informe
- exportacion PDF descargable

Entregables:

- informe institucional base generado desde sistema

## Fase 5 - Documentos institucionales e integraciones (semanas 10-11)

- listado de documentos institucionales
- vinculo con Google Drive/Docs
- exportes a Google Sheets (alumnos y seguimientos)

Entregables:

- modulo documentos activo
- primer flujo de interoperabilidad con Workspace

## Fase 6 - Estabilizacion y salida a produccion local (semana 12)

- pruebas integrales (funcionales + seguridad basica)
- capacitacion corta a usuarios clave
- despliegue en servidor Linux local
- estrategia de backup y recuperacion

Entregables:

- MVP en uso interno
- guia operativa para soporte

## Backlog posterior al MVP

- dashboard de estadisticas educativas
- sincronizacion avanzada con sistemas externos (ej. SAJE)
- asistente IA para borradores de informes
- modulo de novedades institucionales (blog)
- despliegue online con HTTPS y acceso remoto seguro

## Criterios de aceptacion del MVP

- autenticacion y roles funcionando
- docentes pueden registrar y consultar seguimientos
- informes se generan y exportan a PDF
- documentos institucionales accesibles desde panel
- sistema estable en red local escolar

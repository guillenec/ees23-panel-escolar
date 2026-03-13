import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { RequireAuth } from "@/components/auth/require-auth";

export default function DocenteDashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
        <header className="mb-6 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
                Rol docente
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">Panel de seguimiento pedagogico</h1>
              <p className="mt-1 text-sm text-slate-600">
                Vista de trabajo diario para alumnos asignados, registros e informes propios.
              </p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <section className="mb-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Ciclo activo</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Planificacion y seguimiento 2026</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Objetivo diario</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Registrar avances y acuerdos por alumno</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Integracion</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Apertura directa de documentos en Drive</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/students"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
          >
            <h2 className="text-base font-semibold text-slate-900">Alumnos</h2>
            <p className="mt-1 text-sm text-slate-600">Consulta de perfiles y acceso directo al historial de registros.</p>
          </Link>
          <Link
            href="/reports"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
          >
            <h2 className="text-base font-semibold text-slate-900">Informes</h2>
            <p className="mt-1 text-sm text-slate-600">Generacion y descarga de PDF para seguimiento institucional.</p>
          </Link>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Permisos</h2>
            <p className="mt-1 text-sm text-slate-600">Edicion limitada a recursos propios y datos no sensibles.</p>
          </article>
          <Link
            href="/documents"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
          >
            <h2 className="text-base font-semibold text-slate-900">Documentos</h2>
            <p className="mt-1 text-sm text-slate-600">Acceso a carpetas institucionales y archivos de trabajo.</p>
          </Link>
        </section>
      </main>
    </RequireAuth>
  );
}

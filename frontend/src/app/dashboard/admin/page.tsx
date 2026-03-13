import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { RequireAuth } from "@/components/auth/require-auth";

export default function AdminDashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-6xl px-6 py-8">
        <header className="mb-6 rounded-3xl border border-white/70 bg-white/85 p-6 shadow-xl shadow-slate-200/70 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700">
                Rol administrador
              </p>
              <h1 className="mt-3 text-2xl font-semibold text-slate-900 md:text-3xl">Panel de gestion institucional</h1>
              <p className="mt-1 text-sm text-slate-600">
                Coordinacion operativa de alumnos, informes y usuarios con control de permisos.
              </p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <section className="mb-6 grid gap-3 md:grid-cols-3">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Estado sistema</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Servicios principales operativos</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Prioridad</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Validar registros y carga documental 2026</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs uppercase tracking-wide text-slate-500">Accion sugerida</p>
            <p className="mt-2 text-sm font-semibold text-slate-900">Revisar permisos de edicion por rol</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Link
            href="/students"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
          >
            <h2 className="text-base font-semibold text-slate-900">Alumnos</h2>
            <p className="mt-1 text-sm text-slate-600">Alta, edicion y consulta integral de fichas.</p>
          </Link>
          <Link
            href="/reports"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
          >
            <h2 className="text-base font-semibold text-slate-900">Informes</h2>
            <p className="mt-1 text-sm text-slate-600">Seguimiento global y exportacion institucional en PDF.</p>
          </Link>
          <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Usuarios</h2>
            <p className="mt-1 text-sm text-slate-600">
              Gestion avanzada disponible por API, UI administrativa en proxima iteracion.
            </p>
          </article>
          <Link
            href="/documents"
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow"
          >
            <h2 className="text-base font-semibold text-slate-900">Documentos</h2>
            <p className="mt-1 text-sm text-slate-600">Explorador Drive para navegacion y acceso directo.</p>
          </Link>
        </section>
      </main>
    </RequireAuth>
  );
}

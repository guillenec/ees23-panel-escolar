import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { RequireAuth } from "@/components/auth/require-auth";

export default function DashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-5xl p-6">
        <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-700">Panel docente</h1>
              <p className="text-sm text-gray-600">Acceso rapido a modulos del sistema.</p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/students" className="rounded-xl bg-white p-5 shadow-sm hover:shadow">
            <h2 className="font-medium">Alumnos</h2>
            <p className="mt-1 text-sm text-gray-600">Consulta y gestion de fichas.</p>
          </Link>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="font-medium">Seguimientos</h2>
            <p className="mt-1 text-sm text-gray-600">Carga desde ficha del alumno.</p>
          </div>
          <Link href="/reports" className="rounded-xl bg-white p-5 shadow-sm hover:shadow">
            <h2 className="font-medium">Informes</h2>
            <p className="mt-1 text-sm text-gray-600">Generacion y descarga PDF.</p>
          </Link>
        </section>
      </main>
    </RequireAuth>
  );
}

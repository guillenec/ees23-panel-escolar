import Link from "next/link";

import { LogoutButton } from "@/components/auth/logout-button";
import { RequireAuth } from "@/components/auth/require-auth";

export default function AdminDashboardPage() {
  return (
    <RequireAuth>
      <main className="mx-auto min-h-screen max-w-5xl p-6">
        <header className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold text-brand-700">Panel ADMIN</h1>
              <p className="text-sm text-gray-600">Gestion institucional y supervision general.</p>
            </div>
            <LogoutButton />
          </div>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <Link href="/students" className="rounded-xl bg-white p-5 shadow-sm hover:shadow">
            <h2 className="font-medium">Alumnos</h2>
            <p className="mt-1 text-sm text-gray-600">Alta, edicion y consulta.</p>
          </Link>
          <Link href="/reports" className="rounded-xl bg-white p-5 shadow-sm hover:shadow">
            <h2 className="font-medium">Informes</h2>
            <p className="mt-1 text-sm text-gray-600">Vision global y PDF.</p>
          </Link>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <h2 className="font-medium">Usuarios</h2>
            <p className="mt-1 text-sm text-gray-600">Gestion desde API (UI proxima iteracion).</p>
          </div>
        </section>
      </main>
    </RequireAuth>
  );
}

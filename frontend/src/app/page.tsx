import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center p-6">
      <div className="w-full rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold text-brand-700">EES23 - Sistema Interno</h1>
        <p className="mt-2 text-sm text-gray-600">
          Plataforma para gestion docente y seguimiento pedagogico.
        </p>
        <div className="mt-6 flex gap-3">
          <Link className="rounded-lg bg-brand-500 px-4 py-2 text-white" href="/login">
            Iniciar sesion
          </Link>
          <Link className="rounded-lg border border-gray-300 px-4 py-2" href="/dashboard">
            Ver dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}

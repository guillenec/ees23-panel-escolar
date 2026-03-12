import Link from "next/link";

export default function HomePage() {
  return (
    <main className="relative isolate overflow-hidden px-6 py-10 md:px-10 md:py-16">
      <div className="absolute -left-24 top-8 -z-10 h-64 w-64 rounded-full bg-brand-100 blur-3xl" />
      <div className="absolute -right-20 top-24 -z-10 h-56 w-56 rounded-full bg-sky-100 blur-3xl" />

      <div className="mx-auto grid min-h-[82vh] w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-200/70 backdrop-blur">
          <p className="inline-flex rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
            Escuela Especial 23
          </p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
            Gestion docente clara, trazable y pensada para el trabajo real.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
            Plataforma interna para organizar alumnos, registrar seguimientos, generar informes y
            acceder a documentos de Drive sin perder contexto pedagogico.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              className="rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-700"
              href="/login"
            >
              Iniciar sesion
            </Link>
            <Link
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
              href="/dashboard"
            >
              Ir al dashboard
            </Link>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Seguimiento por estudiante</h2>
              <p className="mt-1 text-sm text-slate-600">
                Historial ordenado por fecha, docente y acuerdos de continuidad.
              </p>
            </article>
            <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <h2 className="text-sm font-semibold text-slate-900">Documentos integrados</h2>
              <p className="mt-1 text-sm text-slate-600">
                Apertura directa en Drive para lectura o edicion segun permisos.
              </p>
            </article>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-slate-100 shadow-xl shadow-slate-300/50">
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-300">
            Flujo de trabajo
          </h2>
          <ol className="mt-5 space-y-3 text-sm">
            <li className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              1. Ingresar por rol y abrir panel operativo.
            </li>
            <li className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              2. Consultar alumnos, registros e informes del ciclo actual.
            </li>
            <li className="rounded-xl border border-slate-700 bg-slate-800/70 p-4">
              3. Continuar la edicion documental en Drive desde la app.
            </li>
          </ol>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <article className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Modo actual</p>
              <p className="mt-1 text-sm font-semibold">MVP local</p>
            </article>
            <article className="rounded-xl bg-slate-800 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-400">Integracion Drive</p>
              <p className="mt-1 text-sm font-semibold">En progreso</p>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}

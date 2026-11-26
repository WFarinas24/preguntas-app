export default function ThemeSelector({ temas, onIniciar, onRepasar }) {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-white">Elige un tema</h1>
      <p className="mt-2 text-slate-400">
        Cada intento mezcla las preguntas y sus opciones en un orden aleatorio.
      </p>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        <li>
          <button
            type="button"
            onClick={onRepasar}
            className="h-full w-full rounded-2xl border border-indigo-500/50 bg-indigo-500/5 p-5 text-left transition hover:border-indigo-400 hover:bg-indigo-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            <span className="block text-lg font-semibold text-indigo-200">
              Repasar preguntas falladas
            </span>
            <span className="mt-1 block text-sm text-slate-400">
              Elige temas y cantidad: se priorizan las que más has fallado.
            </span>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400">
              Configurar repaso
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4"
              >
                <path d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 0 1-1.08-.02Z" />
              </svg>
            </span>
          </button>
        </li>
        {temas.map((tema) => (
          <li key={tema.id}>
            <button
              type="button"
              onClick={() => onIniciar(tema)}
              className="h-full w-full rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-left transition hover:border-indigo-400/70 hover:bg-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              <span className="block text-lg font-semibold text-white">
                {tema.titulo}
              </span>
              <span className="mt-1 block text-sm text-slate-400">
                {tema.descripcion}
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-400">
                Comenzar
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.94 10 7.23 6.29a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 0 1-1.08-.02Z" />
                </svg>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

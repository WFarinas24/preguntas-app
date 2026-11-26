import Button from './Button'

export default function Header({
  vista,
  onIrHistorial,
  onIrEstadisticas,
  onIrConfiguracion,
  onNuevoExamen,
}) {
  const pestañas = [
    { id: 'historial', etiqueta: 'Exámenes', accion: onIrHistorial },
    { id: 'estadisticas', etiqueta: 'Estadísticas', accion: onIrEstadisticas },
    { id: 'configuracion', etiqueta: 'Configuración', accion: onIrConfiguracion },
  ]
  const enCuestionario = ['jugando', 'resultado', 'revision'].includes(vista)

  return (
    <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-sm font-bold text-white">
            ?
          </span>
          <span className="font-semibold tracking-tight">Preguntas</span>
        </div>

        <nav aria-label="Navegación principal" className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="flex gap-1">
            {pestañas.map((pestaña) => {
              const activa =
                pestaña.id === vista ||
                (pestaña.id === 'historial' && enCuestionario)
              return (
                <li key={pestaña.id}>
                  <button
                    type="button"
                    onClick={pestaña.accion}
                    aria-current={activa ? 'page' : undefined}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                      activa
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-100'
                    }`}
                  >
                    {pestaña.etiqueta}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <Button onClick={onNuevoExamen}>Nuevo examen</Button>
      </div>
    </header>
  )
}

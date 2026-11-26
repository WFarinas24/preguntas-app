import { useState } from 'react'
import Button from './Button'
import QuestionCard from './QuestionCard'
import Timer from './Timer'

export default function Quiz({
  pregunta,
  indice,
  total,
  inicio,
  seleccion,
  onSeleccionar,
  onAnterior,
  onSiguiente,
  onSalir,
}) {
  const [confirmandoSalir, setConfirmandoSalir] = useState(false)

  if (!pregunta) return null

  const esUltima = indice === total - 1
  const progreso = total > 0 ? ((indice + 1) / total) * 100 : 0

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-medium text-slate-300">
            Pregunta {indice + 1} de {total}
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-4 w-4 text-slate-500"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-12.25a.75.75 0 0 0-1.5 0v4.5c0 .2.08.39.22.53l2.5 2.5a.75.75 0 1 0 1.06-1.06l-2.28-2.28v-3.69Z"
                  clipRule="evenodd"
                />
              </svg>
              Tiempo: <Timer inicio={inicio} />
            </span>
            <button
              type="button"
              onClick={() => setConfirmandoSalir(true)}
              className="text-slate-500 transition hover:text-rose-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Salir
            </button>
          </div>
        </div>
        <div
          className="h-2 overflow-hidden rounded-full bg-slate-800"
          role="progressbar"
          aria-label="Progreso del cuestionario"
          aria-valuenow={indice + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      </div>

      <QuestionCard
        pregunta={pregunta}
        seleccion={seleccion}
        onSeleccionar={onSeleccionar}
      />

      <div className="flex items-center justify-between gap-3 border-t border-slate-800 pt-6">
        <Button variante="secundario" onClick={onAnterior} disabled={indice === 0}>
          Anterior
        </Button>
        <Button onClick={onSiguiente} disabled={!seleccion}>
          {esUltima ? 'Finalizar' : 'Siguiente'}
        </Button>
      </div>

      {confirmandoSalir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-salir"
            className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl"
          >
            <h2 id="titulo-salir" className="text-lg font-semibold text-white">
              ¿Salir del examen?
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              El examen actual se descartará. No se guardará ni se tendrá en cuenta en
              las estadísticas; se tratará como si nunca hubiera ocurrido.
            </p>
            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <Button
                variante="secundario"
                autoFocus
                onClick={() => setConfirmandoSalir(false)}
              >
                Cancelar
              </Button>
              <Button onClick={onSalir}>Salir y descartar</Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

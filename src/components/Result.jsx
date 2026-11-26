import Button from './Button'

function Stat({ valor, etiqueta }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-center">
      <p className="text-xl font-semibold text-white">{valor}</p>
      <p className="mt-1 text-xs text-slate-400">{etiqueta}</p>
    </div>
  )
}

export default function Result({ resultado, onRevision, onRepetir, onVolverTemas }) {
  const { tema, calificacion, puntajeMaximo, aciertos, total, pesoObtenido, pesoTotal } =
    resultado
  const porcentaje = puntajeMaximo > 0 ? (calificacion / puntajeMaximo) * 100 : 0
  const aprobado =
    tema.umbralAprobacion === null || tema.umbralAprobacion === undefined
      ? null
      : calificacion >= tema.umbralAprobacion

  return (
    <section className="space-y-6" aria-live="polite">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          Calificación final
        </p>
        <p className="mt-3 text-6xl font-bold text-white">
          {calificacion}
          <span className="text-2xl font-medium text-slate-500"> / {puntajeMaximo}</span>
        </p>
        <div className="mx-auto mt-6 h-3 max-w-md overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${porcentaje}%` }}
          />
        </div>
        {aprobado !== null && (
          <span
            className={`mt-5 inline-flex rounded-full border px-4 py-1.5 text-sm font-semibold ${
              aprobado
                ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
            }`}
          >
            {aprobado ? 'Aprobado' : 'Reprobado'} · Umbral {tema.umbralAprobacion}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat valor={`${aciertos} / ${total}`} etiqueta="Respuestas correctas" />
        <Stat valor={`${pesoObtenido} / ${pesoTotal}`} etiqueta="Puntos por ponderación" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <Button onClick={onRevision}>Revisar respuestas</Button>
        <Button variante="secundario" onClick={onRepetir}>
          Repetir tema
        </Button>
        <Button variante="fantasma" onClick={onVolverTemas}>
          Volver al inicio
        </Button>
      </div>
    </section>
  )
}

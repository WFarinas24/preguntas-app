import { useState } from 'react'
import Button from './Button'

const CANTIDADES = [5, 10, 20, 40]

export default function ExamenConfig({ tema, onComenzar, onVolver }) {
  const total = tema?.preguntas?.length ?? 0
  const [cantidad, setCantidad] = useState(() => Math.min(40, total))

  if (!tema) return null

  const fijarCantidad = (valor) => {
    const numero = Number.parseInt(valor, 10)
    setCantidad(Math.max(1, Math.min(Number.isNaN(numero) ? 1 : numero, total)))
  }

  return (
    <section className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Configurar examen
        </h1>
        <p className="mt-2 text-slate-400">
          {tema.titulo}
          {tema.descripcion ? ` · ${tema.descripcion}` : ''}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-white">Cantidad de preguntas</h2>
        <p className="mt-2 text-sm text-slate-400">
          El tema tiene {total} {total === 1 ? 'pregunta disponible' : 'preguntas disponibles'}.
          Se elegirán {cantidad} al azar sin repetir y se barajarán sus opciones.
        </p>

        {total < 40 && (
          <p className="mt-3 rounded-lg bg-slate-800/70 px-4 py-3 text-xs text-slate-400">
            El valor por defecto es 40, pero este tema solo tiene {total}. Por eso
            aparece limitado a {total}.
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CANTIDADES.filter((opcion) => opcion < total).map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setCantidad(opcion)}
              aria-pressed={cantidad === opcion}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                cantidad === opcion
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {opcion}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCantidad(total)}
            aria-pressed={cantidad === total}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
              cantidad === total
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Todas ({total})
          </button>
          <label className="flex items-center gap-2 text-sm text-slate-400">
            Otra:
            <input
              type="number"
              min="1"
              max={total}
              value={cantidad}
              onChange={(evento) => fijarCantidad(evento.target.value)}
              className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button disabled={cantidad < 1 || total < 1} onClick={() => onComenzar(cantidad)}>
          Comenzar examen
        </Button>
        <Button variante="secundario" onClick={onVolver}>
          Volver a temas
        </Button>
      </div>
    </section>
  )
}

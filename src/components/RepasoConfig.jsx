import { useMemo, useState } from 'react'
import Button from './Button'
import { contarFalladas } from '../lib/repaso'

const CANTIDADES = [5, 10, 20]

export default function RepasoConfig({ temas, intentos, onComenzar, onVolver }) {
  const [seleccionados, setSeleccionados] = useState(() => temas.map((tema) => tema.id))
  const [cantidad, setCantidad] = useState(10)

  const falladasPorTema = useMemo(() => {
    const conteo = new Map()
    for (const registro of contarFalladas(intentos)) {
      conteo.set(
        registro.temaId,
        (conteo.get(registro.temaId) ?? 0) + registro.falladas,
      )
    }
    return conteo
  }, [intentos])

  const falladasDisponibles = contarFalladas(intentos).filter((registro) =>
    seleccionados.includes(registro.temaId),
  ).length
  const todosSeleccionados = seleccionados.length === temas.length

  const alternarTema = (id) => {
    setSeleccionados((actuales) =>
      actuales.includes(id)
        ? actuales.filter((temaId) => temaId !== id)
        : [...actuales, id],
    )
  }

  return (
    <section className="space-y-7">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Repasar preguntas falladas
        </h1>
        <p className="mt-2 text-slate-400">
          Se priorizan las preguntas que más has fallado. Si no hay suficientes, se
          completan con preguntas aleatorias de los temas elegidos.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-white">Temas</h2>
        <label className="mt-4 flex cursor-pointer items-center gap-3 border-b border-slate-800 pb-3 text-sm text-slate-200">
          <input
            type="checkbox"
            checked={todosSeleccionados}
            onChange={() =>
              setSeleccionados(todosSeleccionados ? [] : temas.map((tema) => tema.id))
            }
            className="h-4 w-4 accent-indigo-500"
          />
          Todos los temas
        </label>
        <ul className="mt-3 space-y-3">
          {temas.map((tema) => (
            <li key={tema.id}>
              <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-slate-200">
                <span className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={seleccionados.includes(tema.id)}
                    onChange={() => alternarTema(tema.id)}
                    className="h-4 w-4 accent-indigo-500"
                  />
                  {tema.titulo}
                </span>
                <span className="text-xs text-slate-500">
                  {falladasPorTema.get(tema.id) ?? 0} fallos registrados
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-white">Cantidad de preguntas</h2>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {CANTIDADES.map((opcion) => (
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
          <label className="flex items-center gap-2 text-sm text-slate-400">
            Otra:
            <input
              type="number"
              min="1"
              max="100"
              value={cantidad}
              onChange={(evento) =>
                setCantidad(Number.parseInt(evento.target.value, 10) || 1)
              }
              className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-100"
            />
          </label>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          {falladasDisponibles} preguntas falladas disponibles en la selección.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          disabled={seleccionados.length === 0 || cantidad < 1}
          onClick={() =>
            onComenzar({ temaIds: seleccionados, cantidad })
          }
        >
          Comenzar repaso
        </Button>
        <Button variante="secundario" onClick={onVolver}>
          Volver
        </Button>
      </div>
    </section>
  )
}

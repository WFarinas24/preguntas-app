import { useState } from 'react'
import Button from './Button'
import { formatearDuracion, formatearFecha } from '../lib/format'

export default function History({
  intentos,
  onNuevoExamen,
  onVerIntento,
  onBorrarIntento,
  onLimpiarHistorial,
}) {
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [confirmandoLimpiar, setConfirmandoLimpiar] = useState(false)

  if (intentos.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">
        <h1 className="text-2xl font-semibold text-white">Aún no hay exámenes</h1>
        <p className="mt-2 text-slate-400">
          Cuando termines tu primer cuestionario aparecerá aquí con su calificación,
          duración y resultados.
        </p>
        <div className="mt-6">
          <Button onClick={onNuevoExamen}>Realizar mi primer examen</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Mis exámenes</h1>
          <p className="mt-1 text-sm text-slate-400">
            {intentos.length} {intentos.length === 1 ? 'examen realizado' : 'exámenes realizados'}
          </p>
        </div>
        <Button
          variante={confirmandoLimpiar ? 'primario' : 'fantasma'}
          onClick={() => {
            if (confirmandoLimpiar) {
              onLimpiarHistorial()
            } else {
              setConfirmandoLimpiar(true)
            }
          }}
          onBlur={() => setConfirmandoLimpiar(false)}
        >
          {confirmandoLimpiar ? 'Confirmar borrado' : 'Limpiar historial'}
        </Button>
      </header>

      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th scope="col" className="px-4 py-3 font-semibold">Tema</th>
              <th scope="col" className="px-4 py-3 font-semibold">Fecha y hora</th>
              <th scope="col" className="px-4 py-3 font-semibold">Duración</th>
              <th scope="col" className="px-4 py-3 font-semibold">Calificación</th>
              <th scope="col" className="px-4 py-3 font-semibold">Falladas</th>
              <th scope="col" className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {intentos.map((intento) => (
              <tr key={intento.id} className="bg-slate-950/40 hover:bg-slate-900/60">
                <td className="px-4 py-4 font-medium text-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {intento.tema.titulo}
                    {intento.esRepaso && (
                      <span className="rounded-full border border-indigo-500/40 bg-indigo-500/15 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                        Repaso
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 text-slate-400">
                  {formatearFecha(intento.finalizadoEn)}
                </td>
                <td className="px-4 py-4 tabular-nums text-slate-300">
                  {formatearDuracion(intento.duracionMs)}
                </td>
                <td className="px-4 py-4">
                  <span className="font-semibold text-white">
                    {intento.calificacion}
                  </span>
                  <span className="text-slate-500"> / {intento.puntajeMaximo}</span>
                </td>
                <td className="px-4 py-4 tabular-nums text-slate-300">
                  {intento.falladas}
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => onVerIntento(intento)}
                      className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 transition hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
                    >
                      Ver revisión
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirmandoId === intento.id) {
                          onBorrarIntento(intento.id)
                          setConfirmandoId(null)
                        } else {
                          setConfirmandoId(intento.id)
                        }
                      }}
                      onBlur={() => setConfirmandoId(null)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 ${
                        confirmandoId === intento.id
                          ? 'bg-rose-500 text-white'
                          : 'text-slate-500 hover:bg-slate-800 hover:text-rose-300'
                      }`}
                    >
                      {confirmandoId === intento.id ? 'Confirmar' : 'Borrar'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

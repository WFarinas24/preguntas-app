import Button from './Button'
import RemoteImage from './RemoteImage'
import { getRespuesta } from '../lib/score'

function RespuestaDetalle({ opcion, placeholder }) {
  if (!opcion) {
    return <dd className="mt-0.5 text-slate-500">{placeholder}</dd>
  }

  return (
    <dd className="mt-1 flex items-center gap-2 text-slate-200">
      {opcion.imagen && (
        <RemoteImage
          imagen={opcion.imagen}
          className="h-10 w-14 shrink-0 rounded border border-slate-700 object-cover"
        />
      )}
      <span>{opcion.texto || 'Opción con imagen'}</span>
    </dd>
  )
}

export default function Review({ resultado, onVolver, onRepetir }) {
  const { tema, preguntas, respuestas } = resultado

  return (
    <section className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Revisión de respuestas</h2>
          <p className="mt-1 text-sm text-slate-400">
            {tema.titulo} · Calificación: {resultado.calificacion} /{' '}
            {resultado.puntajeMaximo}
          </p>
        </div>
        <Button variante="secundario" onClick={onVolver}>
          Volver al resultado
        </Button>
      </header>

      <ol className="space-y-4">
        {preguntas.map((pregunta, indice) => {
          const detalle = getRespuesta(pregunta, respuestas[pregunta.id])
          return (
            <li
              key={pregunta.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
                    {indice + 1}
                  </span>
                  <div>
                    <h3 className="font-medium leading-snug text-white">
                      {pregunta.enunciado}
                    </h3>
                    {pregunta.temaTitulo && pregunta.temaTitulo !== tema.titulo && (
                      <p className="mt-1 text-xs text-indigo-300">
                        Tema: {pregunta.temaTitulo}
                      </p>
                    )}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${
                    detalle.esCorrecta
                      ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-500/15 text-rose-300'
                  }`}
                >
                  {detalle.esCorrecta ? 'Correcta' : 'Incorrecta'}
                </span>
              </div>

              {pregunta.imagen && (
                <RemoteImage
                  imagen={pregunta.imagen}
                  className="mt-4 w-full rounded-lg border border-slate-800 object-contain"
                />
              )}

              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-slate-500">Tu respuesta</dt>
                  <RespuestaDetalle opcion={detalle.elegida} placeholder="Sin responder" />
                </div>
                {tema.mostrarRespuestaCorrecta !== false && (
                  <div>
                    <dt className="text-slate-500">Respuesta correcta</dt>
                    <RespuestaDetalle opcion={detalle.correcta} placeholder="—" />
                  </div>
                )}
              </dl>

              <p className="mt-3 text-xs text-slate-500">
                Puntos obtenidos: {detalle.puntos} de {pregunta.peso}
              </p>

              {pregunta.explicacion && (
                <p className="mt-3 rounded-lg bg-slate-800/60 p-3 text-sm text-slate-300">
                  {pregunta.explicacion}
                </p>
              )}
            </li>
          )
        })}
      </ol>

      <div className="flex justify-center pt-2">
        <Button onClick={onRepetir}>Repetir tema</Button>
      </div>
    </section>
  )
}

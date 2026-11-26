import RemoteImage from './RemoteImage'

const LETRAS = ['A', 'B', 'C', 'D', 'E', 'F']

export default function QuestionCard({ pregunta, seleccion, onSeleccionar }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold leading-snug text-white">
          {pregunta.enunciado}
        </h2>
        {pregunta.imagen && (
          <RemoteImage
            imagen={pregunta.imagen}
            className="mt-5 w-full rounded-xl border border-slate-800 object-contain"
          />
        )}
      </div>

      <fieldset>
        <legend className="sr-only">Opciones de respuesta</legend>
        <div className="space-y-3">
          {pregunta.opciones.map((opcion, indice) => {
            const activa = seleccion === opcion.id
            return (
              <label
                key={opcion.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-400 ${
                  activa
                    ? 'border-indigo-400 bg-indigo-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900'
                }`}
              >
                <input
                  type="radio"
                  name={`pregunta-${pregunta.id}`}
                  value={opcion.id}
                  checked={activa}
                  onChange={() => onSeleccionar(opcion.id)}
                  className="sr-only"
                />
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    activa
                      ? 'border-indigo-400 bg-indigo-500 text-white'
                      : 'border-slate-600 text-slate-400'
                  }`}
                >
                  {LETRAS[indice] ?? indice + 1}
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  {opcion.imagen && (
                    <RemoteImage
                      imagen={opcion.imagen}
                      className="h-28 w-full rounded-lg border border-slate-800 object-cover"
                    />
                  )}
                  {opcion.texto && (
                    <span className="block text-slate-100">{opcion.texto}</span>
                  )}
                </div>
                {activa && (
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-5 w-5 shrink-0 text-indigo-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.86-9.47a.75.75 0 0 0-1.22-.87l-3.02 4.03-1.6-1.6a.75.75 0 0 0-1.06 1.06l2.13 2.14a.75.75 0 0 0 1.14-.09l3.63-4.67Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </label>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatearDuracion } from '../lib/format'
import {
  calcularIndicadores,
  calcularRanking,
  calcularTendencia,
} from '../lib/stats'

const ESTILO_TOOLTIP = {
  backgroundColor: '#0f172a',
  border: '1px solid #334155',
  borderRadius: 12,
  color: '#f1f5f9',
  fontSize: 12,
}

function Tarjeta({ etiqueta, valor }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
      <p className="text-xs text-slate-400">{etiqueta}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-white">{valor}</p>
    </div>
  )
}

export default function Stats({ intentos, onNuevoExamen }) {
  const [modo, setModo] = useState('falladas')
  const indicadores = calcularIndicadores(intentos)
  const tendencia = calcularTendencia(intentos)
  const ranking = calcularRanking(intentos, modo)

  if (intentos.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-12 text-center">
        <h1 className="text-2xl font-semibold text-white">Sin estadísticas aún</h1>
        <p className="mt-2 text-slate-400">
          Realiza un examen para ver tu evolución y las preguntas más falladas o
          acertadas.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onNuevoExamen}
            className="rounded-xl bg-indigo-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
          >
            Nuevo examen
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Estadísticas</h1>
        <p className="mt-1 text-sm text-slate-400">
          Basado en los {indicadores.total}{' '}
          {indicadores.total === 1 ? 'examen realizado' : 'exámenes realizados'}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <Tarjeta etiqueta="Exámenes" valor={indicadores.total} />
        <Tarjeta etiqueta="Promedio" valor={`${indicadores.promedio}%`} />
        <Tarjeta etiqueta="Mejor nota" valor={`${indicadores.mejor}%`} />
        <Tarjeta
          etiqueta="Tiempo promedio"
          valor={formatearDuracion(indicadores.tiempoPromedioMs)}
        />
        <Tarjeta etiqueta="Preguntas" valor={indicadores.preguntas} />
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-white">Evolución de calificaciones</h2>
        <p className="mt-1 text-xs text-slate-400">
          Porcentaje obtenido en cada examen, en orden cronológico.
        </p>
        <div className="mt-5 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={tendencia} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="numero"
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={(valor) => `#${valor}`}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#64748b"
                tick={{ fontSize: 12 }}
                tickFormatter={(valor) => `${valor}%`}
              />
              <Tooltip
                contentStyle={ESTILO_TOOLTIP}
                labelFormatter={(valor) => `Examen #${valor}`}
                formatter={(valor, _nombre, item) => [
                  `${valor}% · ${item?.payload?.tema ?? ''}`,
                  'Calificación',
                ]}
              />
              <Line
                type="monotone"
                dataKey="nota"
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ r: 4, fill: '#818cf8' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-semibold text-white">
              Preguntas más {modo === 'falladas' ? 'falladas' : 'acertadas'}
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Frecuencia acumulada en todos los exámenes.
            </p>
          </div>
          <div className="flex rounded-lg bg-slate-800 p-1">
            {['falladas', 'correctas'].map((opcion) => (
              <button
                key={opcion}
                type="button"
                onClick={() => setModo(opcion)}
                aria-pressed={modo === opcion}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                  modo === opcion
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {opcion === 'falladas' ? 'Más falladas' : 'Más acertadas'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 h-80 w-full">
          {ranking.length === 0 ? (
            <p className="flex h-full items-center justify-center text-sm text-slate-500">
              No hay datos para este filtro.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={ranking}
                layout="vertical"
                margin={{ top: 0, right: 24, bottom: 0, left: 8 }}
              >
                <CartesianGrid stroke="#1e293b" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke="#64748b"
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="etiqueta"
                  width={190}
                  stroke="#64748b"
                  tick={{ fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={ESTILO_TOOLTIP}
                  formatter={(valor, _nombre, item) => [
                    `${valor} de ${item?.payload?.veces ?? 0} intentos (${item?.payload?.porcentaje ?? 0}%)`,
                    modo === 'falladas' ? 'Fallos' : 'Aciertos',
                  ]}
                />
                <Bar
                  dataKey="cantidad"
                  fill={modo === 'falladas' ? '#f87171' : '#34d399'}
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  )
}

import { useEffect, useState } from 'react'
import { formatearDuracion } from '../lib/format'

export default function Timer({ inicio }) {
  const [ahora, setAhora] = useState(() => Date.now())

  useEffect(() => {
    const intervalo = setInterval(() => setAhora(Date.now()), 1000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <span className="tabular-nums" aria-label="Tiempo transcurrido">
      {formatearDuracion(ahora - (inicio ?? ahora))}
    </span>
  )
}

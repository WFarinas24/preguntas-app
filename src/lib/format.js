export function formatearDuracion(ms) {
  if (typeof ms !== 'number' || !Number.isFinite(ms) || ms < 0) return '—'

  const total = Math.round(ms / 1000)
  const horas = Math.floor(total / 3600)
  const minutos = Math.floor((total % 3600) / 60)
  const segundos = total % 60
  const dosDigitos = (numero) => String(numero).padStart(2, '0')

  return horas > 0
    ? `${horas}:${dosDigitos(minutos)}:${dosDigitos(segundos)}`
    : `${dosDigitos(minutos)}:${dosDigitos(segundos)}`
}

export function formatearFecha(iso) {
  if (!iso) return '—'
  const fecha = new Date(iso)
  if (Number.isNaN(fecha.getTime())) return '—'
  return fecha.toLocaleString('es', { dateStyle: 'medium', timeStyle: 'short' })
}

import { useState } from 'react'

export default function RemoteImage({ imagen, className = '' }) {
  const url = imagen?.url
  const [estado, setEstado] = useState({ url: null, fallo: false })
  const fallo = estado.url === url && estado.fallo

  if (!url) return null

  if (fallo) {
    return (
      <div
        role="img"
        aria-label={imagen.alt}
        className={`flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900 px-4 py-8 text-center text-xs text-slate-500 ${className}`}
      >
        Imagen no disponible
      </div>
    )
  }

  return (
    <img
      src={url}
      alt={imagen.alt ?? ''}
      loading="lazy"
      onError={() => setEstado({ url, fallo: true })}
      className={className}
    />
  )
}

import Button from './Button'

export function LoadingState({ mensaje = 'Cargando…' }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-12 text-center">
      <span
        className="h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-indigo-400"
        aria-hidden="true"
      />
      <p className="text-sm text-slate-400" role="status">
        {mensaje}
      </p>
    </div>
  )
}

export function ErrorState({ mensaje, onReintentar, onVolver }) {
  return (
    <div
      role="alert"
      className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-6"
    >
      <h2 className="text-lg font-semibold text-rose-100">
        No pudimos cargar las preguntas
      </h2>
      <p className="mt-2 text-sm text-rose-200/80">{mensaje}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {onReintentar && <Button onClick={onReintentar}>Reintentar</Button>}
        {onVolver && (
          <Button variante="secundario" onClick={onVolver}>
            Volver al inicio
          </Button>
        )}
      </div>
    </div>
  )
}

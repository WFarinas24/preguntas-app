const VARIANTES = {
  primario:
    'bg-indigo-500 text-white shadow-lg shadow-indigo-950/40 hover:bg-indigo-400',
  secundario:
    'border border-slate-700 bg-slate-800 text-slate-200 hover:border-slate-500 hover:bg-slate-700',
  fantasma: 'text-slate-400 hover:bg-slate-800 hover:text-slate-100',
}

export default function Button({ variante = 'primario', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTES[variante]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

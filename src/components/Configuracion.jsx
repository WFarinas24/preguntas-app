import { useState } from 'react'
import Button from './Button'
import { formatearFecha } from '../lib/format'
import { parsearRespaldo, serializarHistorial } from '../lib/storage'

function Mensaje({ mensaje }) {
  if (!mensaje) return null
  return (
    <p
      role={mensaje.tipo === 'error' ? 'alert' : 'status'}
      className={`mt-4 rounded-lg px-4 py-3 text-sm ${
        mensaje.tipo === 'error'
          ? 'bg-rose-500/10 text-rose-300'
          : 'bg-emerald-500/10 text-emerald-300'
      }`}
    >
      {mensaje.texto}
    </p>
  )
}

export default function Configuracion({ intentos, onImportar, onLimpiar }) {
  const [mensaje, setMensaje] = useState(null)
  const [archivo, setArchivo] = useState(null)
  const [confirmandoImportar, setConfirmandoImportar] = useState(false)
  const [confirmandoLimpiar, setConfirmandoLimpiar] = useState(false)

  const descargar = () => {
    const contenido = serializarHistorial(intentos)
    const url = URL.createObjectURL(new Blob([contenido], { type: 'application/json' }))
    const enlace = document.createElement('a')
    enlace.href = url
    enlace.download = `preguntas-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(enlace)
    enlace.click()
    enlace.remove()
    URL.revokeObjectURL(url)
    setMensaje({
      tipo: 'exito',
      texto: `Respaldo descargado con ${intentos.length} ${
        intentos.length === 1 ? 'examen' : 'exámenes'
      }.`,
    })
  }

  const leerArchivo = async (evento) => {
    const seleccionado = evento.target.files?.[0]
    evento.target.value = ''
    if (!seleccionado) return

    setConfirmandoImportar(false)
    try {
      const importados = parsearRespaldo(await seleccionado.text())
      setArchivo({ nombre: seleccionado.name, intentos: importados })
      setMensaje(null)
    } catch (error) {
      setArchivo(null)
      setMensaje({
        tipo: 'error',
        texto: error.message || 'No se pudo leer el archivo seleccionado.',
      })
    }
  }

  const confirmarImportacion = () => {
    if (!archivo) return
    const cantidad = archivo.intentos.length
    onImportar(archivo.intentos)
    setArchivo(null)
    setConfirmandoImportar(false)
    setMensaje({
      tipo: 'exito',
      texto: `Se importaron ${cantidad} ${cantidad === 1 ? 'examen' : 'exámenes'}. El historial anterior fue reemplazado.`,
    })
  }

  const confirmarLimpieza = () => {
    onLimpiar()
    setConfirmandoLimpiar(false)
    setMensaje({ tipo: 'exito', texto: 'Se eliminaron todos los datos guardados.' })
  }

  return (
    <section className="mx-auto max-w-2xl space-y-7">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Configuración</h1>
        <p className="mt-2 text-slate-400">
          Tus datos viven solo en este navegador. Descarga una copia para no perderlos
          o restaura una copia anterior.
        </p>
      </div>

      <Mensaje mensaje={mensaje} />

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-white">Descargar mis datos</h2>
        <p className="mt-2 text-sm text-slate-400">
          Genera un archivo JSON con los {intentos.length}{' '}
          {intentos.length === 1 ? 'examen guardado' : 'exámenes guardados'}, incluidas
          las preguntas y respuestas de cada intento.
        </p>
        <div className="mt-4">
          <Button onClick={descargar} disabled={intentos.length === 0}>
            Descargar archivo JSON
          </Button>
          {intentos.length === 0 && (
            <p className="mt-2 text-xs text-slate-500">
              Realiza un examen para tener algo que respaldar.
            </p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <h2 className="font-semibold text-white">Subir mis datos</h2>
        <p className="mt-2 text-sm text-slate-400">
          Elige un respaldo generado por esta app. Antes de aplicarlo podrás revisar
          cuántos exámenes contiene; al confirmar, reemplazará el historial actual.
        </p>
        <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-700 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-indigo-400">
          Elegir archivo
          <input
            type="file"
            accept=".json,application/json"
            onChange={leerArchivo}
            className="sr-only"
          />
        </label>

        {archivo && (
          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-sm font-medium text-slate-100">{archivo.nombre}</p>
            <p className="mt-1 text-sm text-slate-400">
              {archivo.intentos.length}{' '}
              {archivo.intentos.length === 1 ? 'examen' : 'exámenes'}
              {archivo.intentos.length > 0 && (
                <>
                  {' · '}
                  {formatearFecha(archivo.intentos[archivo.intentos.length - 1].finalizadoEn)}{' '}
                  — {formatearFecha(archivo.intentos[0].finalizadoEn)}
                </>
              )}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button
                variante={confirmandoImportar ? 'primario' : 'secundario'}
                onClick={() => {
                  if (confirmandoImportar) confirmarImportacion()
                  else setConfirmandoImportar(true)
                }}
                onBlur={() => setConfirmandoImportar(false)}
              >
                {confirmandoImportar ? 'Confirmar reemplazo' : 'Reemplazar mis datos'}
              </Button>
              <Button
                variante="fantasma"
                onClick={() => {
                  setArchivo(null)
                  setConfirmandoImportar(false)
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-rose-900/60 bg-rose-500/5 p-5">
        <h2 className="font-semibold text-rose-200">Limpiar todos los datos</h2>
        <p className="mt-2 text-sm text-slate-400">
          Elimina permanentemente el historial de exámenes de este navegador. Esta
          acción no se puede deshacer; descarga antes una copia si quieres conservarla.
        </p>
        <div className="mt-4">
          <Button
            variante={confirmandoLimpiar ? 'primario' : 'secundario'}
            onClick={() => {
              if (confirmandoLimpiar) confirmarLimpieza()
              else setConfirmandoLimpiar(true)
            }}
            onBlur={() => setConfirmandoLimpiar(false)}
          >
            {confirmandoLimpiar ? 'Confirmar borrado' : 'Limpiar todos los datos'}
          </Button>
        </div>
      </div>
    </section>
  )
}

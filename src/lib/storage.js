const STORAGE_KEY = 'preguntas-app:historial:v1'
const VERSION = 1
const APP_ID = 'preguntas-app'

function esValido(intento) {
  return Boolean(
    intento &&
      typeof intento.id === 'string' &&
      intento.tema &&
      typeof intento.tema.id === 'string' &&
      typeof intento.tema.titulo === 'string' &&
      Array.isArray(intento.preguntas) &&
      intento.preguntas.length > 0 &&
      intento.preguntas.every(
        (pregunta) =>
          pregunta &&
          typeof pregunta.id === 'string' &&
          typeof pregunta.enunciado === 'string' &&
          Array.isArray(pregunta.opciones) &&
          pregunta.opciones.length > 0 &&
          typeof pregunta.peso === 'number',
      ) &&
      intento.respuestas &&
      typeof intento.respuestas === 'object' &&
      !Array.isArray(intento.respuestas) &&
      typeof intento.calificacion === 'number' &&
      typeof intento.finalizadoEn === 'string',
  )
}

function ordenar(intentos) {
  return [...intentos].sort(
    (a, b) => new Date(b.finalizadoEn) - new Date(a.finalizadoEn),
  )
}

export function loadHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const datos = JSON.parse(raw)
    if (datos?.version !== VERSION || !Array.isArray(datos.intentos)) return []

    return ordenar(datos.intentos.filter(esValido))
  } catch {
    return []
  }
}

function persistir(intentos) {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: VERSION, intentos }),
    )
  } catch {
    // Almacenamiento no disponible (modo privado, cuota llena, etc.).
  }
}

export function saveAttempt(intento) {
  persistir([intento, ...loadHistory()])
}

export function deleteAttempt(id) {
  persistir(loadHistory().filter((intento) => intento.id !== id))
}

export function reemplazarHistorial(intentos) {
  persistir(ordenar(intentos))
}

export function clearHistory() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // Almacenamiento no disponible.
  }
}

export function serializarHistorial(intentos) {
  return JSON.stringify(
    {
      app: APP_ID,
      version: VERSION,
      exportadoEn: new Date().toISOString(),
      intentos: ordenar(intentos),
    },
    null,
    2,
  )
}

export function parsearRespaldo(texto) {
  let datos
  try {
    datos = JSON.parse(texto)
  } catch {
    throw new Error('El archivo no contiene un JSON válido.')
  }

  if (datos?.app !== APP_ID) {
    throw new Error('El archivo no es un respaldo de esta aplicación.')
  }
  if (datos.version !== VERSION) {
    throw new Error(
      `Versión de respaldo no compatible. Se esperaba la versión ${VERSION}.`,
    )
  }
  if (!Array.isArray(datos.intentos)) {
    throw new Error('El respaldo no contiene una lista de exámenes.')
  }
  if (!datos.intentos.every(esValido)) {
    throw new Error('El respaldo contiene exámenes incompletos o inválidos.')
  }

  return ordenar(datos.intentos)
}

export function nuevoId() {
  return (
    globalThis.crypto?.randomUUID?.() ??
    `intento-${Date.now()}-${Math.random().toString(36).slice(2)}`
  )
}

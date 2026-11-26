import { loadTheme } from './questions'
import { getRespuesta } from './score'
import { prepararPreguntas, shuffle } from './shuffle'

function claveDe(pregunta) {
  return `${pregunta.temaId}::${pregunta.id}`
}

export function contarFalladas(intentos) {
  const agrupadas = new Map()

  for (const intento of intentos) {
    for (const pregunta of intento.preguntas ?? []) {
      const temaId = pregunta.temaId ?? intento.tema?.id
      if (!temaId) continue

      const registrada = {
        ...pregunta,
        temaId,
        temaTitulo: pregunta.temaTitulo ?? intento.tema?.titulo ?? '',
      }
      const clave = claveDe(registrada)
      const detalle = getRespuesta(pregunta, intento.respuestas?.[pregunta.id])

      if (!agrupadas.has(clave)) {
        agrupadas.set(clave, {
          clave,
          pregunta: registrada,
          temaId,
          temaTitulo: registrada.temaTitulo,
          falladas: 0,
          aciertos: 0,
        })
      }

      const registro = agrupadas.get(clave)
      if (detalle.esCorrecta) registro.aciertos += 1
      else registro.falladas += 1
    }
  }

  return [...agrupadas.values()]
    .filter((registro) => registro.falladas > 0)
    .sort(
      (a, b) =>
        b.falladas - a.falladas ||
        a.aciertos - b.aciertos ||
        a.clave.localeCompare(b.clave),
    )
}

export async function prepararRepaso({ intentos, temas, temaIds, cantidad }) {
  const seleccionados = temas.filter((tema) => temaIds.includes(tema.id))
  if (seleccionados.length === 0) {
    throw new Error('Selecciona al menos un tema para el repaso.')
  }
  if (!Number.isInteger(cantidad) || cantidad < 1) {
    throw new Error('La cantidad de preguntas debe ser al menos 1.')
  }

  const falladas = contarFalladas(intentos).filter((registro) =>
    temaIds.includes(registro.temaId),
  )
  const elegidas = falladas.slice(0, cantidad)
  const usadas = new Set(elegidas.map((registro) => registro.clave))

  if (elegidas.length < cantidad) {
    const temasCompletos = await Promise.all(
      seleccionados.map((tema) => loadTheme(tema)),
    )
    const banco = temasCompletos.flatMap((tema) =>
      tema.preguntas.map((pregunta) => ({
        ...pregunta,
        temaId: tema.id,
        temaTitulo: tema.titulo,
        clave: `${tema.id}::${pregunta.id}`,
      })),
    )
    const repuesto = shuffle(banco.filter((pregunta) => !usadas.has(pregunta.clave)))
    elegidas.push(
      ...repuesto.slice(0, cantidad - elegidas.length).map((pregunta) => ({
        pregunta,
        clave: pregunta.clave,
      })),
    )
  }

  const preguntas = elegidas.map(({ pregunta }) => ({
    id: pregunta.id,
    enunciado: pregunta.enunciado,
    peso: pregunta.peso,
    imagen: pregunta.imagen,
    opciones: pregunta.opciones,
    explicacion: pregunta.explicacion,
    temaId: pregunta.temaId,
    temaTitulo: pregunta.temaTitulo,
  }))

  if (preguntas.length === 0) {
    throw new Error('No hay preguntas disponibles en los temas seleccionados.')
  }

  return {
    id: 'repaso-falladas',
    titulo: 'Repaso de falladas',
    descripcion: `Repaso de ${preguntas.length} preguntas`,
    config: {
      puntajeMaximo: 100,
      umbralAprobacion: 70,
      mostrarRespuestaCorrecta: true,
    },
    esRepaso: true,
    preguntas: prepararPreguntas(preguntas),
  }
}

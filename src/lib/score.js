export function getRespuesta(pregunta, opcionId) {
  const elegida = pregunta.opciones.find((opcion) => opcion.id === opcionId) ?? null
  const correcta = pregunta.opciones.find((opcion) => opcion.esCorrecta) ?? null

  return {
    elegida,
    correcta,
    esCorrecta: Boolean(elegida?.esCorrecta),
    puntos: elegida?.esCorrecta ? pregunta.peso : 0,
  }
}

export function calculateScore(preguntas, respuestas, puntajeMaximo) {
  const pesoTotal = preguntas.reduce((total, pregunta) => total + pregunta.peso, 0)

  const detalles = preguntas.map((pregunta) =>
    getRespuesta(pregunta, respuestas[pregunta.id]),
  )

  const aciertos = detalles.filter((detalle) => detalle.esCorrecta).length
  const pesoObtenido = detalles.reduce((total, detalle) => total + detalle.puntos, 0)
  const calificacion =
    pesoTotal > 0 ? Math.round((pesoObtenido / pesoTotal) * puntajeMaximo) : 0

  return {
    aciertos,
    total: preguntas.length,
    pesoObtenido,
    pesoTotal,
    calificacion,
    puntajeMaximo,
  }
}

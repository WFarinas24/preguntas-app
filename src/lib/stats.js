function porcentaje(intentos) {
  const maximo = intentos.puntajeMaximo || 100
  return Math.round((intentos.calificacion / maximo) * 100)
}

export function calcularIndicadores(intentos) {
  if (intentos.length === 0) {
    return {
      total: 0,
      promedio: 0,
      mejor: 0,
      tiempoPromedioMs: 0,
      preguntas: 0,
    }
  }

  const porcentajes = intentos.map(porcentaje)
  const duraciones = intentos
    .map((intento) => intento.duracionMs)
    .filter((ms) => typeof ms === 'number' && Number.isFinite(ms) && ms >= 0)

  return {
    total: intentos.length,
    promedio: Math.round(
      porcentajes.reduce((suma, nota) => suma + nota, 0) / porcentajes.length,
    ),
    mejor: Math.max(...porcentajes),
    tiempoPromedioMs: duraciones.length
      ? Math.round(duraciones.reduce((suma, ms) => suma + ms, 0) / duraciones.length)
      : 0,
    preguntas: intentos.reduce((suma, intento) => suma + (intento.total ?? 0), 0),
  }
}

export function calcularTendencia(intentos) {
  return [...intentos]
    .sort((a, b) => new Date(a.finalizadoEn) - new Date(b.finalizadoEn))
    .map((intento, indice) => ({
      numero: indice + 1,
      tema: intento.tema.titulo,
      nota: porcentaje(intento),
    }))
}

export function calcularRanking(intentos, tipo = 'falladas', limite = 8) {
  const agrupadas = new Map()

  for (const intento of intentos) {
    for (const pregunta of intento.preguntas ?? []) {
      const temaId = pregunta.temaId ?? intento.tema.id
      const clave = `${temaId}::${pregunta.id}`
      const elegida = pregunta.opciones?.find(
        (opcion) => opcion.id === intento.respuestas?.[pregunta.id],
      )
      const esCorrecta = Boolean(elegida?.esCorrecta)

      if (!agrupadas.has(clave)) {
        agrupadas.set(clave, {
          clave,
          enunciado: pregunta.enunciado,
          tema: pregunta.temaTitulo ?? intento.tema.titulo,
          correctas: 0,
          falladas: 0,
          veces: 0,
        })
      }

      const registro = agrupadas.get(clave)
      registro.veces += 1
      if (esCorrecta) registro.correctas += 1
      else registro.falladas += 1
    }
  }

  return [...agrupadas.values()]
    .filter((registro) => registro[tipo] > 0)
    .sort((a, b) => b[tipo] - a[tipo] || b.veces - a.veces)
    .slice(0, limite)
    .map((registro) => ({
      ...registro,
      cantidad: registro[tipo],
      porcentaje: Math.round((registro[tipo] / registro.veces) * 100),
      etiqueta:
        registro.enunciado.length > 58
          ? `${registro.enunciado.slice(0, 58)}…`
          : registro.enunciado,
    }))
}

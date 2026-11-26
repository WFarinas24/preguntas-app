// Fisher-Yates sobre una copia: no muta el arreglo original.
export function shuffle(items) {
  const resultado = [...items]

  for (let i = resultado.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const temporal = resultado[i]
    resultado[i] = resultado[j]
    resultado[j] = temporal
  }

  return resultado
}

export function prepararPreguntas(preguntas) {
  return shuffle(preguntas).map((pregunta) => ({
    ...pregunta,
    opciones: shuffle(pregunta.opciones),
  }))
}

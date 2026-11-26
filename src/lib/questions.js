const BASE_URL = import.meta.env.BASE_URL || '/'

function esObjeto(valor) {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor)
}

function esTexto(valor) {
  return typeof valor === 'string' && valor.trim().length > 0
}

function esNumeroPositivo(valor) {
  return typeof valor === 'number' && Number.isFinite(valor) && valor > 0
}

function afirmar(condicion, mensaje) {
  if (!condicion) throw new Error(mensaje)
}

async function fetchJson(archivo) {
  let respuesta
  try {
    respuesta = await fetch(`${BASE_URL}preguntas/${archivo}`)
  } catch {
    throw new Error(`No se pudo conectar para cargar "${archivo}".`)
  }

  if (!respuesta.ok) {
    throw new Error(`No se pudo cargar "${archivo}" (HTTP ${respuesta.status}).`)
  }

  try {
    return await respuesta.json()
  } catch {
    throw new Error(`"${archivo}" no contiene un JSON válido.`)
  }
}

function validarImagen(imagen, contexto) {
  if (imagen === undefined || imagen === null) return null
  afirmar(esObjeto(imagen), `${contexto}: "imagen" debe ser un objeto con url y alt.`)
  afirmar(
    esTexto(imagen.url) && /^https?:\/\//i.test(imagen.url),
    `${contexto}: "imagen.url" debe ser una URL absoluta http(s).`,
  )
  afirmar(esTexto(imagen.alt), `${contexto}: "imagen.alt" es obligatorio.`)
  return { url: imagen.url, alt: imagen.alt }
}

export async function loadCatalog() {
  const datos = await fetchJson('index.json')

  afirmar(esObjeto(datos), 'index.json debe contener un objeto.')
  afirmar(Array.isArray(datos.temas), 'index.json: "temas" debe ser un arreglo.')
  afirmar(datos.temas.length > 0, 'index.json: debe haber al menos un tema.')

  const vistos = new Set()
  const temas = datos.temas.map((tema, indice) => {
    const contexto = `index.json: tema ${indice + 1}`
    afirmar(esObjeto(tema), `${contexto} debe ser un objeto.`)
    afirmar(esTexto(tema.id), `${contexto}: "id" es obligatorio.`)
    afirmar(esTexto(tema.titulo), `${contexto}: "titulo" es obligatorio.`)
    afirmar(
      esTexto(tema.archivo) && /^[\w.-]+\.json$/i.test(tema.archivo),
      `${contexto}: "archivo" debe ser un nombre de archivo .json válido.`,
    )
    afirmar(!vistos.has(tema.id), `${contexto}: el id "${tema.id}" está duplicado.`)
    vistos.add(tema.id)

    return {
      id: tema.id,
      titulo: tema.titulo,
      descripcion: esTexto(tema.descripcion) ? tema.descripcion : '',
      archivo: tema.archivo,
    }
  })

  return temas
}

function normalizarTema(datos, temaCatalogo) {
  const contexto = `Tema "${temaCatalogo.titulo}"`
  afirmar(esObjeto(datos), `${contexto}: el JSON debe contener un objeto.`)

  const config = datos.config ?? {}
  afirmar(esObjeto(config), `${contexto}: "config" debe ser un objeto.`)

  const puntajeMaximo =
    config.puntajeMaximo === undefined ? 100 : config.puntajeMaximo
  afirmar(
    esNumeroPositivo(puntajeMaximo),
    `${contexto}: "config.puntajeMaximo" debe ser mayor a 0.`,
  )

  const umbralAprobacion =
    config.umbralAprobacion === undefined ? null : config.umbralAprobacion
  afirmar(
    umbralAprobacion === null ||
      (typeof umbralAprobacion === 'number' && Number.isFinite(umbralAprobacion)),
    `${contexto}: "config.umbralAprobacion" debe ser un número.`,
  )

  afirmar(
    Array.isArray(datos.preguntas) && datos.preguntas.length > 0,
    `${contexto}: "preguntas" debe tener al menos una pregunta.`,
  )

  const idsPreguntas = new Set()
  const preguntas = datos.preguntas.map((pregunta, indice) => {
    const ctx = `${contexto}, pregunta ${indice + 1}`
    afirmar(esObjeto(pregunta), `${ctx} debe ser un objeto.`)
    afirmar(esTexto(pregunta.id), `${ctx}: "id" es obligatorio.`)
    afirmar(!idsPreguntas.has(pregunta.id), `${ctx}: el id "${pregunta.id}" está duplicado.`)
    idsPreguntas.add(pregunta.id)
    afirmar(esTexto(pregunta.enunciado), `${ctx}: "enunciado" es obligatorio.`)

    const peso = pregunta.peso === undefined ? 1 : pregunta.peso
    afirmar(esNumeroPositivo(peso), `${ctx}: "peso" debe ser mayor a 0.`)

    const imagen = validarImagen(pregunta.imagen, ctx)

    afirmar(
      Array.isArray(pregunta.opciones) && pregunta.opciones.length >= 2,
      `${ctx}: debe tener al menos 2 opciones.`,
    )

    const idsOpciones = new Set()
    const opciones = pregunta.opciones.map((opcion, i) => {
      const octx = `${ctx}, opción ${i + 1}`
      afirmar(esObjeto(opcion), `${octx} debe ser un objeto.`)
      afirmar(esTexto(opcion.id), `${octx}: "id" es obligatorio.`)
      afirmar(!idsOpciones.has(opcion.id), `${octx}: el id "${opcion.id}" está duplicado.`)
      idsOpciones.add(opcion.id)
      afirmar(
        esTexto(opcion.texto) || opcion.imagen !== undefined,
        `${octx}: "texto" o "imagen" es obligatorio.`,
      )
      afirmar(
        typeof opcion.esCorrecta === 'boolean',
        `${octx}: "esCorrecta" debe ser true o false.`,
      )

      return {
        id: opcion.id,
        texto: esTexto(opcion.texto) ? opcion.texto : '',
        imagen: validarImagen(opcion.imagen, octx),
        esCorrecta: opcion.esCorrecta,
      }
    })

    const correctas = opciones.filter((opcion) => opcion.esCorrecta)
    afirmar(
      correctas.length === 1,
      `${ctx}: debe tener exactamente una opción correcta (tiene ${correctas.length}).`,
    )

    return {
      id: pregunta.id,
      enunciado: pregunta.enunciado,
      peso,
      imagen,
      opciones,
      explicacion: esTexto(pregunta.explicacion) ? pregunta.explicacion : '',
    }
  })

  return {
    id: esTexto(datos.id) ? datos.id : temaCatalogo.id,
    titulo: esTexto(datos.titulo) ? datos.titulo : temaCatalogo.titulo,
    descripcion: esTexto(datos.descripcion) ? datos.descripcion : '',
    config: {
      puntajeMaximo,
      umbralAprobacion,
      mostrarRespuestaCorrecta: config.mostrarRespuestaCorrecta !== false,
    },
    preguntas,
  }
}

export async function loadTheme(temaCatalogo) {
  const datos = await fetchJson(temaCatalogo.archivo)
  return normalizarTema(datos, temaCatalogo)
}

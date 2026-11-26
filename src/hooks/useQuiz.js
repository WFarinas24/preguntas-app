import { useCallback, useEffect, useState } from 'react'
import { loadCatalog, loadTheme } from '../lib/questions'
import { calculateScore } from '../lib/score'
import { prepararRepaso } from '../lib/repaso'
import { prepararPreguntas } from '../lib/shuffle'
import {
  clearHistory,
  deleteAttempt,
  loadHistory,
  nuevoId,
  reemplazarHistorial,
  saveAttempt,
} from '../lib/storage'

const VISTAS = {
  HISTORIAL: 'historial',
  TEMAS: 'temas',
  REPASO: 'repaso',
  JUGANDO: 'jugando',
  RESULTADO: 'resultado',
  REVISION: 'revision',
  ESTADISTICAS: 'estadisticas',
  CONFIGURACION: 'configuracion',
}

export function useQuiz() {
  const [vista, setVista] = useState(VISTAS.HISTORIAL)
  const [temas, setTemas] = useState([])
  const [intentos, setIntentos] = useState([])
  const [temaActual, setTemaActual] = useState(null)
  const [orden, setOrden] = useState([])
  const [indice, setIndice] = useState(0)
  const [respuestas, setRespuestas] = useState({})
  const [resultado, setResultado] = useState(null)
  const [iniciadoEn, setIniciadoEn] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const cargarCatalogo = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      setTemas(await loadCatalog())
    } catch (e) {
      setError(e.message || 'No se pudo cargar el catálogo de temas.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    let activo = true

    async function inicializar() {
      try {
        const [catalogo, historial] = await Promise.all([
          loadCatalog(),
          Promise.resolve(loadHistory()),
        ])
        if (!activo) return
        setTemas(catalogo)
        setIntentos(historial)
      } catch (e) {
        if (activo) setError(e.message || 'No se pudo cargar el catálogo de temas.')
      } finally {
        if (activo) setCargando(false)
      }
    }

    inicializar()
    return () => {
      activo = false
    }
  }, [])

  const empezar = useCallback((tema, fechaInicio) => {
    setTemaActual(tema)
    setOrden(prepararPreguntas(tema.preguntas))
    setIndice(0)
    setRespuestas({})
    setResultado(null)
    setIniciadoEn(fechaInicio)
    setError(null)
    setVista(VISTAS.JUGANDO)
  }, [])

  const iniciar = useCallback(
    async (temaCatalogo) => {
      setCargando(true)
      setError(null)
      try {
        const tema = await loadTheme(temaCatalogo)
        empezar(tema, Date.now())
      } catch (e) {
        setError(e.message || 'No se pudo cargar el tema.')
      } finally {
        setCargando(false)
      }
    },
    [empezar],
  )

  const seleccionar = useCallback(
    (opcionId) => {
      const pregunta = orden[indice]
      if (!pregunta) return
      setRespuestas((anteriores) => ({ ...anteriores, [pregunta.id]: opcionId }))
    },
    [orden, indice],
  )

  const finalizar = useCallback(() => {
    if (!temaActual || orden.length === 0) return

    const finalizadoEn = Date.now()
    const calculo = calculateScore(
      orden,
      respuestas,
      temaActual.config.puntajeMaximo,
    )
    const intento = {
      id: nuevoId(),
      esRepaso: Boolean(temaActual.esRepaso),
      tema: {
        id: temaActual.id,
        titulo: temaActual.titulo,
        puntajeMaximo: temaActual.config.puntajeMaximo,
        umbralAprobacion: temaActual.config.umbralAprobacion,
        mostrarRespuestaCorrecta: temaActual.config.mostrarRespuestaCorrecta,
      },
      iniciadoEn: new Date(iniciadoEn ?? finalizadoEn).toISOString(),
      finalizadoEn: new Date(finalizadoEn).toISOString(),
      duracionMs: finalizadoEn - (iniciadoEn ?? finalizadoEn),
      falladas: calculo.total - calculo.aciertos,
      preguntas: orden.map((pregunta) => ({
        ...pregunta,
        temaId: pregunta.temaId ?? temaActual.id,
        temaTitulo: pregunta.temaTitulo ?? temaActual.titulo,
      })),
      respuestas,
      ...calculo,
    }

    saveAttempt(intento)
    setIntentos((anteriores) => [intento, ...anteriores])
    setResultado(intento)
    setVista(VISTAS.RESULTADO)
  }, [temaActual, orden, respuestas, iniciadoEn])

  const siguiente = useCallback(() => {
    if (indice < orden.length - 1) {
      setIndice((actual) => actual + 1)
    } else {
      finalizar()
    }
  }, [indice, orden.length, finalizar])

  const anterior = useCallback(() => {
    setIndice((actual) => Math.max(0, actual - 1))
  }, [])

  const repetir = useCallback(() => {
    const origen = temaActual?.preguntas ?? resultado?.preguntas
    if (!origen?.length) return
    empezar({ ...temaActual, preguntas: origen }, Date.now())
  }, [temaActual, resultado, empezar])

  const verIntento = useCallback((intento) => {
    setResultado(intento)
    setTemaActual({
      id: intento.tema.id,
      titulo: intento.tema.titulo,
      esRepaso: Boolean(intento.esRepaso),
      config: {
        puntajeMaximo: intento.puntajeMaximo,
        umbralAprobacion: intento.tema.umbralAprobacion ?? null,
        mostrarRespuestaCorrecta: intento.tema.mostrarRespuestaCorrecta !== false,
      },
      preguntas: intento.preguntas,
    })
    setVista(VISTAS.RESULTADO)
  }, [])

  const borrarIntento = useCallback(
    (id) => {
      deleteAttempt(id)
      setIntentos((anteriores) => anteriores.filter((intento) => intento.id !== id))
      if (resultado?.id === id) {
        setResultado(null)
        setVista(VISTAS.HISTORIAL)
      }
    },
    [resultado],
  )

  const limpiarHistorial = useCallback(() => {
    clearHistory()
    setTemaActual(null)
    setOrden([])
    setIndice(0)
    setRespuestas({})
    setResultado(null)
    setIniciadoEn(null)
    setIntentos([])
  }, [])

  const importarHistorial = useCallback((intentosImportados) => {
    reemplazarHistorial(intentosImportados)
    setTemaActual(null)
    setOrden([])
    setIndice(0)
    setRespuestas({})
    setResultado(null)
    setIniciadoEn(null)
    setError(null)
    setIntentos(intentosImportados)
  }, [])

  const nuevoExamen = useCallback(() => {
    setError(null)
    setVista(VISTAS.TEMAS)
  }, [])

  const irARepaso = useCallback(() => {
    setError(null)
    setVista(VISTAS.REPASO)
  }, [])

  const comenzarRepaso = useCallback(
    async ({ temaIds, cantidad }) => {
      setCargando(true)
      setError(null)
      try {
        const tema = await prepararRepaso({ intentos, temas, temaIds, cantidad })
        empezar(tema, Date.now())
      } catch (e) {
        setError(e.message || 'No se pudo preparar el repaso.')
        setVista(VISTAS.TEMAS)
      } finally {
        setCargando(false)
      }
    },
    [intentos, temas, empezar],
  )

  // Salir del examen lo descarta por completo: no se guarda ni se contabiliza.
  const irAHistorial = useCallback(() => {
    setTemaActual(null)
    setOrden([])
    setIndice(0)
    setRespuestas({})
    setResultado(null)
    setIniciadoEn(null)
    setError(null)
    setVista(VISTAS.HISTORIAL)
  }, [])

  const irAEstadisticas = useCallback(() => {
    setError(null)
    setVista(VISTAS.ESTADISTICAS)
  }, [])

  const irAConfiguracion = useCallback(() => {
    setError(null)
    setVista(VISTAS.CONFIGURACION)
  }, [])

  return {
    vista,
    VISTAS,
    temas,
    intentos,
    temaActual,
    preguntaActual: orden[indice] ?? null,
    indice,
    total: orden.length,
    respuestas,
    resultado,
    iniciadoEn,
    cargando,
    error,
    cargarCatalogo,
    iniciar,
    irARepaso,
    comenzarRepaso,
    seleccionar,
    siguiente,
    anterior,
    repetir,
    verIntento,
    borrarIntento,
    limpiarHistorial,
    importarHistorial,
    nuevoExamen,
    irAHistorial,
    irAEstadisticas,
    irAConfiguracion,
    irARevision: () => setVista(VISTAS.REVISION),
    irAResultado: () => setVista(VISTAS.RESULTADO),
  }
}

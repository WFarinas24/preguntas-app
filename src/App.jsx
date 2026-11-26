import { lazy, Suspense } from 'react'
import { ErrorState, LoadingState } from './components/AsyncState'
import Configuracion from './components/Configuracion'
import ExamenConfig from './components/ExamenConfig'
import Header from './components/Header'
import History from './components/History'
import Quiz from './components/Quiz'
import RepasoConfig from './components/RepasoConfig'
import Result from './components/Result'
import Review from './components/Review'
import ThemeSelector from './components/ThemeSelector'
import { useQuiz } from './hooks/useQuiz'

const Stats = lazy(() => import('./components/Stats'))

export default function App() {
  const quiz = useQuiz()
  const { VISTAS } = quiz

  const mensajeCarga =
    quiz.vista === VISTAS.TEMAS && quiz.temas.length === 0
      ? 'Cargando temas…'
      : quiz.vista === VISTAS.CONFIGURAR_EXAMEN
        ? 'Cargando tema…'
        : quiz.vista === VISTAS.JUGANDO
          ? 'Preparando el cuestionario…'
          : 'Cargando…'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Header
        vista={quiz.vista}
        onIrHistorial={quiz.irAHistorial}
        onIrEstadisticas={quiz.irAEstadisticas}
        onIrConfiguracion={quiz.irAConfiguracion}
        onNuevoExamen={quiz.nuevoExamen}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10">
        {quiz.cargando && <LoadingState mensaje={mensajeCarga} />}

        {!quiz.cargando && quiz.error && (
          <ErrorState
            mensaje={quiz.error}
            onReintentar={quiz.temas.length === 0 ? quiz.cargarCatalogo : undefined}
            onVolver={quiz.temas.length > 0 ? quiz.irAHistorial : undefined}
          />
        )}

        {!quiz.cargando && !quiz.error && (
          <>
            {quiz.vista === VISTAS.HISTORIAL && (
              <History
                intentos={quiz.intentos}
                onNuevoExamen={quiz.nuevoExamen}
                onVerIntento={quiz.verIntento}
                onBorrarIntento={quiz.borrarIntento}
                onLimpiarHistorial={quiz.limpiarHistorial}
              />
            )}

            {quiz.vista === VISTAS.ESTADISTICAS && (
              <Suspense fallback={<LoadingState mensaje="Cargando estadísticas…" />}>
                <Stats intentos={quiz.intentos} onNuevoExamen={quiz.nuevoExamen} />
              </Suspense>
            )}

            {quiz.vista === VISTAS.CONFIGURACION && (
              <Configuracion
                intentos={quiz.intentos}
                onImportar={quiz.importarHistorial}
                onLimpiar={quiz.limpiarHistorial}
              />
            )}

            {quiz.vista === VISTAS.TEMAS && (
              <div className="mx-auto max-w-2xl">
                <ThemeSelector
                  temas={quiz.temas}
                  onElegir={quiz.elegirTema}
                  onRepasar={quiz.irARepaso}
                />
              </div>
            )}

            {quiz.vista === VISTAS.CONFIGURAR_EXAMEN && quiz.temaSeleccionado && (
              <div className="mx-auto max-w-2xl">
                <ExamenConfig
                  key={quiz.temaSeleccionado.id}
                  tema={quiz.temaSeleccionado}
                  onComenzar={quiz.comenzarExamen}
                  onVolver={quiz.nuevoExamen}
                />
              </div>
            )}

            {quiz.vista === VISTAS.REPASO && (
              <div className="mx-auto max-w-2xl">
                <RepasoConfig
                  temas={quiz.temas}
                  intentos={quiz.intentos}
                  onComenzar={quiz.comenzarRepaso}
                  onVolver={quiz.nuevoExamen}
                />
              </div>
            )}

            {quiz.vista === VISTAS.JUGANDO && (
              <div className="mx-auto max-w-2xl">
                <Quiz
                  pregunta={quiz.preguntaActual}
                  indice={quiz.indice}
                  total={quiz.total}
                  inicio={quiz.iniciadoEn}
                  seleccion={quiz.respuestas[quiz.preguntaActual?.id]}
                  onSeleccionar={quiz.seleccionar}
                  onAnterior={quiz.anterior}
                  onSiguiente={quiz.siguiente}
                  onSalir={quiz.irAHistorial}
                />
              </div>
            )}

            {quiz.vista === VISTAS.RESULTADO && quiz.resultado && (
              <div className="mx-auto max-w-2xl">
                <Result
                  resultado={quiz.resultado}
                  onRevision={quiz.irARevision}
                  onRepetir={quiz.repetir}
                  onVolverTemas={quiz.irAHistorial}
                />
              </div>
            )}

            {quiz.vista === VISTAS.REVISION && quiz.resultado && (
              <div className="mx-auto max-w-2xl">
                <Review
                  resultado={quiz.resultado}
                  onVolver={quiz.irAResultado}
                  onRepetir={quiz.repetir}
                />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

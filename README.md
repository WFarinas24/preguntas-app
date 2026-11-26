# Preguntas

SPA de cuestionarios de opción única hecha con React, Vite y Tailwind CSS. Incluye
historial de exámenes y estadísticas con gráficos (Recharts).

## Ejecutar

```bash
npm install
npm run dev
```

`npm run build` genera la versión de producción y `npm run lint` verifica el código.

La app está configurada con `base: '/preguntas-app/'` en `vite.config.js` para
GitHub Pages. En desarrollo abre `http://localhost:5173/preguntas-app/` y en preview
`http://localhost:4173/preguntas-app/`. Los JSON de temas se cargan desde
`/preguntas-app/preguntas/` usando `import.meta.env.BASE_URL`.

## Uso

- La página principal lista los exámenes realizados con tema, fecha y hora, duración,
  calificación y cantidad de preguntas falladas. Desde cada fila se abre la revisión
  completa y se puede borrar el registro.
- El botón **Nuevo examen** de la cabecera abre el selector de temas, donde también
  está la opción de **Repasar preguntas falladas**.
- Al elegir un tema se abre una pantalla para indicar cuántas preguntas se van a
  usar. El valor por defecto es 40, limitado al total del tema; se toman preguntas
  aleatorias sin repetir. **Repetir tema** vuelve a usar el mismo subconjunto.
- Durante el examen se muestra el tiempo transcurrido. El botón **Salir** pide
  confirmación: al confirmar, el examen se descarta por completo (no se guarda ni
  afecta las estadísticas).
- La pestaña **Estadísticas** muestra indicadores generales, la evolución de las
  calificaciones y un ranking de preguntas más falladas o más acertadas.
- La pestaña **Configuración** permite descargar el historial como JSON, subir un
  respaldo y borrar todos los datos guardados.
- El historial se guarda en `localStorage` (`preguntas-app:historial:v1`). No hay
  usuarios ni backend; todo permanece en el navegador.

## Respaldos

En **Configuración** puedes descargar un archivo JSON con todos los exámenes
(`app`, `version`, `exportadoEn` e `intentos`). Al subirlo, la app valida el formato,
muestra cuántos exámenes contiene y, tras confirmar, reemplaza el historial actual.
Un archivo de otra app, con otra versión o con exámenes incompletos se rechaza con un
mensaje. El botón **Limpiar todos los datos** también pide confirmación y elimina el
historial de forma permanente.

## Agregar un tema

Los temas se leen en tiempo de ejecución desde `public/preguntas/`. No hace falta
tocar código ni recompilar:

1. Crea `public/preguntas/mi-tema.json` con la estructura descrita abajo.
2. Agrega una entrada en `public/preguntas/index.json` apuntando a ese archivo.

Las imágenes se cargan desde URLs externas (http/https), no desde el servidor de la
app. Si una URL falla, se muestra un placeholder en lugar de una imagen rota.

### `index.json`

```json
{
  "version": 1,
  "temas": [
    {
      "id": "mi-tema",
      "titulo": "Mi tema",
      "descripcion": "Descripción corta",
      "archivo": "mi-tema.json"
    }
  ]
}
```

### Archivo de tema

```json
{
  "id": "mi-tema",
  "titulo": "Mi tema",
  "descripcion": "Descripción corta",
  "version": 1,
  "config": {
    "puntajeMaximo": 100,
    "umbralAprobacion": 70,
    "mostrarRespuestaCorrecta": true
  },
  "preguntas": [
    {
      "id": "q-01",
      "enunciado": "¿Cuánto es 7 × 8?",
      "peso": 2,
      "imagen": {
        "url": "https://ejemplo.com/imagen.png",
        "alt": "Descripción de la imagen"
      },
      "opciones": [
        { "id": "a", "texto": "54", "esCorrecta": false },
        { "id": "b", "texto": "56", "esCorrecta": true }
      ],
      "explicacion": "7 × 8 = 56."
    }
  ]
}
```

| Campo | Tipo | Regla |
| --- | --- | --- |
| `config.puntajeMaximo` | number > 0 | Opcional, default `100` |
| `config.umbralAprobacion` | number | Opcional; si existe se muestra Aprobado/Reprobado |
| `config.mostrarRespuestaCorrecta` | boolean | Opcional, default `true`; aplica a la revisión |
| `preguntas[].peso` | number > 0 | Opcional, default `1` |
| `preguntas[].imagen` | `{ url, alt }` | Opcional; `url` absoluta http(s) y `alt` obligatorio |
| `preguntas[].opciones` | array | Mínimo 2, ids únicos, exactamente una con `esCorrecta: true` |
| `opciones[].imagen` | `{ url, alt }` | Opcional, misma forma (para respuestas con imagen) |
| `preguntas[].explicacion` | string | Opcional, se muestra en la revisión |

Si algún JSON no cumple estas reglas, la app muestra el error en pantalla en vez de
quedarse en blanco.

## Examen de repaso

Desde el selector de temas, **Repasar preguntas falladas** abre una configuración
donde se eligen uno, varios o todos los temas y la cantidad de preguntas. Se toman
primero las preguntas falladas con más fallos; si no hay suficientes, se completan
aleatoriamente con preguntas del banco de los temas seleccionados. El orden de
preguntas y opciones se baraja como en un examen normal.

El repaso usa `puntajeMaximo: 100` y `umbralAprobacion: 70`, se guarda en el
historial con la etiqueta **Repaso** y cuenta en todas las estadísticas. Cada
pregunta conserva el tema al que pertenece para que el ranking siga agrupándola
correctamente.

## Calificación

Cada pregunta tiene un `peso`. La nota final es:

```
calificación = round( Σ pesos de respuestas correctas / Σ pesos de todas las preguntas × puntajeMaximo )
```

## Comportamiento

- Las preguntas y las opciones se barajan una sola vez al iniciar cada intento.
- Se puede avanzar y retroceder cambiando la respuesta hasta finalizar.
- La duración se mide desde que se elige el tema hasta que se pulsa "Finalizar".
- Al terminar se guarda el intento y se muestra la calificación con su revisión
  detallada (respuesta elegida, correcta, puntos y explicación).
- Las estadísticas normalizan las notas a porcentaje para comparar temas con escalas
  distintas, y agrupan las preguntas por tema e id usando los datos guardados.

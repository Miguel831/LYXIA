# LYXIA — Experiencia web neuronal interactiva

Web desarrollada con React, TypeScript y Vite. La experiencia incluye tres
escenas controladas por scroll: un cerebro de partículas, su transformación
en un globo terráqueo con continentes reconocibles y una explosión envolvente
de partículas. Todo se genera en tiempo real mediante Canvas 2D con
proyección tridimensional.

## Requisitos

- Node.js 20.19 o posterior; se recomienda Node.js 22 o posterior.
- npm.

## Ejecutar el proyecto

```bash
npm install
npm run dev
```

Abre la dirección que aparezca en la terminal; normalmente:

```text
http://localhost:5173
```

## Preparar una versión para producción

```bash
npm run build
npm run preview
```

La versión lista para publicar se genera dentro de `dist/`.

## Archivos principales

- `src/App.tsx`: experiencia 3D, animaciones, scroll, textos y secciones.
- `src/styles.css`: diseño, colores, tipografía y adaptación a móviles.
- `src/main.tsx`: punto de entrada de React.
- `index.html`: metadatos y documento HTML principal.
- `vite.config.ts`: configuración del servidor y la compilación.
- `package.json`: dependencias y comandos del proyecto.

## Personalización

En `src/App.tsx` puedes modificar:

- `COLORS`: paleta del cerebro y las conexiones.
- `CONTINENTS`: coordenadas simplificadas de los continentes del planeta.
- `isLand`: comprobación geográfica utilizada para dibujar la Tierra.
- `createPoints`: forma, distribución y cantidad de partículas.
- `createSynapses`: cantidad y aspecto de las neuronas interiores.
- `NeuralCanvas`: perspectiva, profundidad, velocidad y transiciones.
- Los bloques `chapter`: textos de cada etapa del recorrido.
- Las secciones `vision`, `capacidades` y `contacto`.

En `src/styles.css` puedes ajustar los colores definidos en `:root`,
el diseño de cada sección y las reglas específicas para móviles.

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

## Formulario de contacto y correos

El formulario llama a la Cloud Function `submitContactRequest`, ubicada en
`functions/index.js`. La función valida la solicitud, aplica un límite básico
por IP, guarda el estado en Firestore y envía mediante Zoho Mail:

- Una notificación a `miguelpp2003@gmail.com` con los datos del cliente.
- Una confirmación al cliente desde `contacto@lyxia.es`.

Las colecciones `contactRequests` y `contactRateLimits` están cerradas al
navegador mediante `firestore.rules`; solo la función usa el SDK Admin.

### Configurar Zoho y desplegar

1. En Zoho Mail, abre la configuración de la cuenta `contacto@lyxia.es` y
   consulta el servidor SMTP exacto asignado a la cuenta. Para cuentas europeas
   suele ser `smtp.zoho.eu`; algunas cuentas de organización de pago utilizan
   `smtppro.zoho.eu`. Se usa SSL en el puerto `465`.
2. Si la cuenta tiene verificación en dos pasos, crea en Zoho una contraseña de
   aplicación llamada, por ejemplo, `LYXIA Firebase`. No guardes esa contraseña
   en ningún archivo del proyecto.
3. Crea Firestore desde la consola de Firebase en modo producción si todavía no
   existe.
4. Asegúrate de usar Node.js 20.19 o posterior e inicia sesión:

   ```bash
   npx firebase-tools@latest login
   ```

5. Guarda la contraseña SMTP en Secret Manager. El comando la solicita de forma
   interactiva y no la añade al repositorio:

   ```bash
   npx firebase-tools@latest functions:secrets:set ZOHO_SMTP_PASSWORD
   ```

6. Si el SMTP mostrado por Zoho no es `smtp.zoho.eu`, crea el archivo local
   `functions/.env.lyxia-b752e`:

   ```dotenv
   ZOHO_SMTP_HOST=smtppro.zoho.eu
   ZOHO_SMTP_PORT=465
   ```

7. Despliega la función y las reglas:

   ```bash
   npx firebase-tools@latest deploy --only functions,firestore:rules
   ```

8. Compila y publica la web:

   ```bash
   npm run build
   npx firebase-tools@latest deploy --only hosting
   ```

### Protección adicional con App Check

El formulario ya incluye validación en servidor, reintentos idempotentes,
honeypot y límite por IP. Antes de activar la obligatoriedad de App Check en la
función, registra la aplicación web con reCAPTCHA Enterprise en Firebase, copia
`.env.example` como `.env.local`, establece `VITE_FIREBASE_APPCHECK_KEY` y
comprueba primero las métricas de solicitudes válidas en la consola. Cuando la
web ya esté enviando tokens válidos, añade `enforceAppCheck: true` a las opciones
de `submitContactRequest` en `functions/index.js` y vuelve a desplegar la función.

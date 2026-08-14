# Constitution — SmartSpend App

Reglas y lineamientos técnicos que rigen el desarrollo de la aplicación SmartSpend.

---

## Stack Tecnológico

- **Framework:** Expo SDK 51+, React Native.
- **Navegación:** `expo-router` (file-based routing).
- **Lenguaje:** JavaScript (ES6+).
- **Estilos:** `StyleSheet` nativo de React Native. No se permite el uso de librerías externas de estilos (e.g., NativeWind, Tailwind, Styled Components).

## Arquitectura de Datos

- **Fuente de datos:** Funciones asíncronas mock ubicadas en `/services/mockApi.js`.
- **Retardo simulado:** Todas las funciones mock deben incluir un retardo de **800ms** (`setTimeout` / `Promise`) para simular latencia de red.
- **Sin backend real:** No se conecta a ningún servidor, API REST ni base de datos SQL/NoSQL. Todos los datos viven en memoria durante la sesión.

## Convenciones de Código

- **Idioma del código:** Inglés (nombres de variables, funciones, componentes y comentarios).
- **Idioma de la interfaz:** Español (textos visibles al usuario: labels, placeholders, títulos, mensajes de error y estados vacíos).
- **Estructura de carpetas:**
  ```
  /app              → Pantallas (expo-router file-based routing)
  /components       → Componentes reutilizables
  /services         → Funciones mock de datos (mockApi.js)
  /constants        → Colores, categorías y datos de configuración
  /assets           → Imágenes e íconos estáticos
  ```

## Regla de UI — 3 Estados Obligatorios

Toda pantalla que consuma datos debe implementar los siguientes **3 estados de UI**:

| Estado | Descripción | Componente sugerido |
|--------|-------------|---------------------|
| **Carga** | Se muestra mientras se resuelve la promesa de datos. | `ActivityIndicator` centrado en pantalla. |
| **Vacío** | Se muestra cuando la respuesta no contiene elementos. | Mensaje amigable con ícono ilustrativo (Empty State). |
| **Contenido** | Se muestra cuando hay datos disponibles. | Lista, tarjetas o visualización correspondiente. |

## Reglas Adicionales

- **Validación de formularios:** Todo campo de entrada debe validarse antes del envío. Montos deben ser numéricos y mayores a cero. Campos de texto no pueden estar vacíos.
- **Componentes reutilizables:** Elementos comunes como tarjetas de gasto, botones y campos de entrada deben abstraerse en `/components`.
- **Navegación:** Se usa exclusivamente `expo-router` con rutas basadas en archivos. No se permite `@react-navigation` directamente.
- **Control de versiones:** Commits descriptivos en español siguiendo el formato: `tipo: descripción` (e.g., `feat: agregar pantalla de detalle de gasto`).

# Tareas Atómicas — SmartSpend

Checklist de tareas de implementación ordenadas por dependencia. Cada tarea es autocontenida y verificable de forma independiente.

---

## Progreso General

| Completadas | En progreso | Pendientes | Total |
|:-----------:|:-----------:|:----------:|:-----:|
| 7 | 0 | 1 | **8** |

---

## T01: Configuración inicial de expo-router y layout base

- **Estado:** `[x]` Completada
- **Archivos:** `app/_layout.js`, `package.json`, `app.json`
- **Descripción:**
  - Crear el proyecto Expo con el template de `expo-router`.
  - Configurar `app/_layout.js` con un `Stack` navigator.
  - Definir opciones globales de navegación (título, colores del header).
  - Verificar que la app corre sin errores en Expo Go.
- **Criterios de aceptación:**
  - [x] El proyecto se inicia sin errores con `npx expo start`.
  - [x] El layout raíz renderiza correctamente el Stack navigator.
  - [x] La estructura de carpetas base está creada (`/app`, `/components`, `/services`, `/constants`).

---

## T02: Crear servicio mock de datos

- **Estado:** `[x]` Completada
- **Archivos:** `services/mockExpenses.js`, `constants/categories.js`
- **Descripción:**
  - Crear el archivo `constants/categories.js` con la definición de las 7 categorías (clave, label en español, ícono emoji).
  - Crear `services/mockExpenses.js` con:
    - Array mutable `expenses` con **6 gastos semilla** precargados.
    - Función `getExpenses()` — retorna todos los gastos ordenados por fecha descendente.
    - Función `getExpenseById(id)` — retorna un gasto por ID o `null`.
    - Función `addExpense(data)` — genera ID único, agrega al array, retorna el gasto creado.
    - Función `getExpensesByCategory()` — agrupa y totaliza por categoría con porcentajes.
  - Todas las funciones retornan `Promise` con `setTimeout` de **800ms**.
- **Criterios de aceptación:**
  - [x] Las 4 funciones están exportadas y retornan Promises.
  - [x] Cada función tiene un retardo simulado de 800ms.
  - [x] `getExpenses()` retorna los 6 gastos semilla ordenados por fecha.
  - [x] `getExpenseById("1")` retorna el primer gasto; `getExpenseById("999")` retorna `null`.
  - [x] `addExpense({...})` incrementa el array y retorna el nuevo gasto con ID generado.
  - [x] `getExpensesByCategory()` retorna objetos con `category`, `label`, `icon`, `total`, `percentage`, `count`.

---

## T03: Implementar pantalla principal (Dashboard)

- **Estado:** `[x]` Completada
- **Archivos:** `app/index.js`
- **Dependencias:** T01, T02, T04
- **Descripción:**
  - Implementar la pantalla principal con `useEffect` + `useState` para consumir `getExpenses()`.
  - Mostrar el **total acumulado** de gastos en la parte superior.
  - Renderizar un `FlatList` con componentes `ExpenseCard`.
  - Implementar los **3 estados de UI**:
    - **Carga:** `LoadingSpinner` mientras se resuelve la promesa.
    - **Vacío:** `EmptyState` con mensaje *"Aún no tenés gastos registrados"*.
    - **Contenido:** Lista de gastos con total.
  - `onPress` en un gasto navega a `/gasto/[id]`.
  - Botón para navegar a `/nuevo`.
- **Criterios de aceptación:**
  - [x] Se muestra `ActivityIndicator` durante los primeros 800ms.
  - [x] Se muestra el total acumulado formateado como moneda.
  - [x] El `FlatList` renderiza los 6 gastos semilla con `ExpenseCard`.
  - [x] Al presionar un gasto se navega a `/gasto/[id]`.
  - [x] El botón de agregar navega a `/nuevo`.

---

## T04: Crear componentes reutilizables

- **Estado:** `[x]` Completada
- **Archivos:** `components/ExpenseCard.js`, `components/LoadingSpinner.js`, `components/EmptyState.js`, `components/CategoryBar.js`, `components/FormField.js`
- **Dependencias:** T01
- **Descripción:**
  - **`ExpenseCard.js`** — Tarjeta con ícono de categoría, título, fecha y monto. Recibe `onPress`.
  - **`LoadingSpinner.js`** — `ActivityIndicator` centrado con mensaje opcional.
  - **`EmptyState.js`** — Ícono grande + mensaje centrado para estados sin datos.
  - **`CategoryBar.js`** — Fila con ícono, label, monto total y barra de progreso visual.
  - **`FormField.js`** — Label + `TextInput` + mensaje de error en rojo.
- **Criterios de aceptación:**
  - [x] Cada componente recibe props documentadas y renderiza correctamente.
  - [x] `ExpenseCard` muestra ícono, título, fecha formateada y monto con formato moneda.
  - [x] `LoadingSpinner` muestra un spinner centrado en pantalla.
  - [x] `EmptyState` muestra un mensaje e ícono centrados.
  - [x] `CategoryBar` renderiza una barra proporcional al porcentaje.
  - [x] `FormField` muestra error en rojo cuando la prop `error` tiene contenido.

---

## T05: Crear pantalla de detalle dinámico

- **Estado:** `[x]` Completada
- **Archivos:** `app/gasto/[id].js`
- **Dependencias:** T02, T04
- **Descripción:**
  - Obtener el parámetro `id` con `useLocalSearchParams()`.
  - Consumir `getExpenseById(id)` con `useEffect` + `useState`.
  - Implementar los **3 estados de UI**:
    - **Carga:** `LoadingSpinner` mientras se resuelve la promesa.
    - **Error:** Mensaje *"Gasto no encontrado"* si el ID no existe.
    - **Contenido:** Vista con todos los campos del gasto.
  - Mostrar: título, monto (formato moneda), categoría con ícono, fecha formateada y nota (si existe).
  - Botón para volver al listado (`router.back()`).
- **Criterios de aceptación:**
  - [x] Se lee el `id` del parámetro de ruta dinámico.
  - [x] Se muestra `ActivityIndicator` durante la carga.
  - [x] Si el gasto no existe, se muestra *"Gasto no encontrado"*.
  - [x] Si el gasto existe, se muestran todos sus campos.
  - [x] El botón de volver regresa al Dashboard.

---

## T06: Construir formulario de alta de gasto

- **Estado:** `[x]` Completada
- **Archivos:** `app/nuevo.js`
- **Dependencias:** T02, T04
- **Descripción:**
  - Campos del formulario: título, monto, categoría (selector), fecha y nota (opcional).
  - Validaciones al presionar "Guardar":
    - Título no vacío → *"El título es obligatorio"*.
    - Monto numérico y > 0 → *"Ingresá un monto válido mayor a cero"*.
    - Categoría seleccionada → *"Seleccioná una categoría"*.
    - Fecha no futura → *"La fecha no puede ser futura"*.
  - Mensajes de error debajo de cada campo usando `FormField`.
  - Al enviar exitosamente:
    - Llamar a `addExpense(data)`.
    - Mostrar estado de carga en el botón: *"Guardando..."*.
    - Mostrar `Alert` de éxito.
    - Navegar de vuelta al Dashboard con `router.replace("/")`.
- **Criterios de aceptación:**
  - [x] Todos los campos se renderizan correctamente.
  - [x] Se muestran errores de validación debajo de cada campo con error.
  - [x] No se puede enviar el formulario con campos inválidos.
  - [x] Al enviar correctamente, el gasto se agrega y se navega al Dashboard.
  - [x] El botón muestra *"Guardando..."* durante la operación.

---

## T07: Implementar pantalla de resumen por categorías

- **Estado:** `[x]` Completada
- **Archivos:** `app/categorias.js`
- **Dependencias:** T02, T04
- **Descripción:**
  - Consumir `getExpensesByCategory()` con `useEffect` + `useState`.
  - Implementar los **3 estados de UI**:
    - **Carga:** `LoadingSpinner`.
    - **Vacío:** `EmptyState` con mensaje *"No hay datos de categorías todavía"*.
    - **Contenido:** Lista de categorías con `CategoryBar`.
  - Cada categoría muestra: ícono, nombre, monto total, porcentaje y barra de progreso.
  - Mostrar el **total general** en la parte superior.
  - Ordenar categorías de mayor a menor monto.
- **Criterios de aceptación:**
  - [x] Se muestra `ActivityIndicator` durante la carga.
  - [x] Las categorías se listan ordenadas de mayor a menor gasto.
  - [x] Cada categoría muestra ícono, nombre, total formateado y porcentaje.
  - [x] La barra de progreso es proporcional al porcentaje.
  - [x] Se muestra el total general de todos los gastos.

---

## T08: Verificación y pulido de UI

- **Estado:** `[ ]` Pendiente
- **Archivos:** Todos los archivos del proyecto
- **Dependencias:** T01–T07
- **Descripción:**
  - Probar la app completa en dispositivo físico con **Expo Go**.
  - Verificar todos los flujos de navegación:
    - Dashboard → Detalle → Volver.
    - Dashboard → Nuevo → Guardar → Dashboard (con nuevo gasto visible).
    - Dashboard → Categorías (con datos actualizados).
  - Verificar los 3 estados de UI en cada pantalla.
  - Revisar y pulir estilos:
    - Consistencia de colores, tipografía y espaciado.
    - Correcta visualización en diferentes tamaños de pantalla.
    - Textos en español sin errores ortográficos.
  - Revisar que el código y comentarios estén en inglés.
- **Criterios de aceptación:**
  - [ ] La app corre sin errores ni warnings en Expo Go.
  - [ ] Todos los flujos de navegación funcionan correctamente.
  - [ ] Los 3 estados de UI están implementados en todas las pantallas con datos.
  - [ ] La interfaz es visualmente consistente y está en español.
  - [ ] El código y los comentarios están en inglés.

---

## Orden de Ejecución (Dependencias)

```
T01 ──────────────┐
                  ├──► T02 ──────┐
                  │              ├──► T03
                  ├──► T04 ──────┤
                  │              ├──► T05
                  │              ├──► T06
                  │              └──► T07
                  │                     │
                  └─────────────────────┴──► T08
```

> **T01** y **T04** pueden desarrollarse en paralelo.  
> **T02** debe completarse antes de T03, T05, T06 y T07.  
> **T08** es la tarea final que requiere que todas las anteriores estén completas.

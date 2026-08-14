# Especificación Funcional: SmartSpend

**Versión:** 1.0  
**Fecha:** 14 de agosto de 2026  
**Estado:** Pendiente de aprobación docente

---

## 1. Visión General

SmartSpend es una aplicación móvil desarrollada con **React Native y Expo Router** que permite a los usuarios registrar, categorizar y visualizar sus gastos personales de forma sencilla e intuitiva. La aplicación ofrece un dashboard con resumen de gastos, un formulario validado para agregar nuevos registros, detalle individual de cada gasto y una vista de distribución por categorías.

> **Nota:** La aplicación no utiliza backend real. Todos los datos se gestionan mediante funciones mock asíncronas con retardo simulado de 800ms (definidas en `/services/mockApi.js`).

---

## 2. Historias de Usuario

### US1 — Listado de gastos recientes
> **Como** usuario, **quiero** ver el listado de mis gastos recientes ordenados por fecha descendente, mostrando el ícono de categoría, título y monto, **para** tener una visión rápida de en qué he gastado.

**Criterios de aceptación:**
- Los gastos se muestran en un `FlatList` ordenado del más reciente al más antiguo.
- Cada ítem muestra: ícono de categoría, título del gasto, fecha formateada y monto en formato moneda.
- Se muestra un `ActivityIndicator` durante la carga.
- Si no hay gastos, se muestra un Empty State con mensaje: *"Aún no tenés gastos registrados"*.
- Se muestra el total acumulado de gastos en la parte superior de la pantalla.

### US2 — Detalle de un gasto
> **Como** usuario, **quiero** ver el detalle completo de un gasto específico al tocarlo en la lista, **para** revisar toda la información asociada a ese registro.

**Criterios de aceptación:**
- Al presionar un gasto en la lista, se navega a la pantalla de detalle usando ruta dinámica `/gasto/[id]`.
- Se muestra: título, monto, categoría (con ícono), fecha y descripción/nota opcional.
- Se incluye un botón para volver al listado.
- Se muestra un `ActivityIndicator` mientras se obtienen los datos del gasto.
- Si el gasto no existe (ID inválido), se muestra un mensaje de error: *"Gasto no encontrado"*.

### US3 — Agregar un nuevo gasto
> **Como** usuario, **quiero** agregar un nuevo gasto ingresando monto, título, categoría y fecha mediante un formulario validado, **para** mantener actualizado mi registro de gastos.

**Criterios de aceptación:**
- El formulario incluye los campos: título (texto), monto (numérico), categoría (selector/picker) y fecha.
- **Validaciones antes del envío:**
  - El título no puede estar vacío.
  - El monto debe ser un número mayor a cero.
  - La categoría debe estar seleccionada.
  - La fecha no puede ser futura.
- Los mensajes de error de validación se muestran debajo de cada campo correspondiente en español.
- Al enviar exitosamente, se muestra un feedback visual (alerta o toast) y se navega de vuelta al listado.
- Se muestra un estado de carga en el botón de envío mientras se procesa la operación mock.

### US4 — Resumen por categorías
> **Como** usuario, **quiero** ver un resumen numérico con el total gastado por cada categoría, **para** entender cómo se distribuyen mis gastos.

**Criterios de aceptación:**
- Se muestra una lista de categorías con su ícono, nombre y monto total acumulado.
- Las categorías se ordenan de mayor a menor gasto.
- Se muestra el porcentaje que cada categoría representa del total.
- Se incluye una barra visual de progreso proporcional al porcentaje de cada categoría.
- Se muestra un `ActivityIndicator` durante la carga.
- Si no hay gastos, se muestra un Empty State: *"No hay datos de categorías todavía"*.

---

## 3. Pantallas

La aplicación consta de **4 pantallas** mínimas, organizadas según el file-based routing de `expo-router`:

| # | Ruta | Nombre | Descripción |
|---|------|--------|-------------|
| 1 | `/app/index.js` | **Dashboard / Listado de Gastos** | Pantalla principal. Muestra el total acumulado y un `FlatList` con los gastos recientes. Cada ítem es navegable al detalle. |
| 2 | `/app/gasto/[id].js` | **Detalle de Gasto** | Pantalla de detalle con ruta dinámica. Recibe el `id` del gasto por parámetro y muestra toda la información del registro. |
| 3 | `/app/nuevo.js` | **Formulario de Alta** | Formulario para crear un nuevo gasto con validación completa de campos. |
| 4 | `/app/categorias.js` | **Categorías y Resumen** | Vista de distribución de gastos agrupados por categoría, con totales y porcentajes. |

### Navegación

```
┌─────────────────────────────────────────────────┐
│                    _layout.js                    │
│              (Tab Navigation / Stack)            │
├──────────┬──────────┬───────────┬───────────────┤
│  index   │  nuevo   │categorias │  gasto/[id]   │
│(Dashboard│ (Form)   │ (Summary) │  (Detail)     │
│  + List) │          │           │               │
└──────────┴──────────┴───────────┴───────────────┘
     │                                   ▲
     │          onPress item             │
     └───────────────────────────────────┘
```

---

## 4. Modelo de Datos

### Entidad: `Expense` (Gasto)

```javascript
{
  id: "uuid-string",        // Identificador único
  title: "String",          // Título del gasto (e.g., "Almuerzo")
  amount: Number,           // Monto en pesos (e.g., 2500.50)
  category: "String",       // Clave de categoría (e.g., "food")
  date: "ISO-8601 String",  // Fecha del gasto (e.g., "2026-08-10")
  note: "String | null"     // Nota opcional descriptiva
}
```

### Categorías predefinidas

| Clave | Nombre (UI) | Ícono sugerido |
|-------|-------------|----------------|
| `food` | Alimentación | 🍔 |
| `transport` | Transporte | 🚌 |
| `entertainment` | Entretenimiento | 🎬 |
| `services` | Servicios | 💡 |
| `health` | Salud | 💊 |
| `shopping` | Compras | 🛍️ |
| `other` | Otros | 📦 |

---

## 5. Servicios Mock — API Simulada

Archivo: `/services/mockApi.js`

Todas las funciones retornan una `Promise` con retardo simulado de **800ms**.

| Función | Descripción | Retorno |
|---------|-------------|---------|
| `getExpenses()` | Obtiene el listado completo de gastos. | `Promise<Expense[]>` |
| `getExpenseById(id)` | Obtiene un gasto por su ID. | `Promise<Expense \| null>` |
| `addExpense(expense)` | Agrega un nuevo gasto al arreglo en memoria. | `Promise<Expense>` |
| `getExpensesByCategory()` | Retorna los gastos agrupados y totalizados por categoría. | `Promise<CategorySummary[]>` |

### Estructura de `CategorySummary`

```javascript
{
  category: "String",      // Clave de categoría
  label: "String",         // Nombre visible en español
  icon: "String",          // Emoji/ícono
  total: Number,           // Suma de montos de esa categoría
  percentage: Number,      // Porcentaje sobre el total general
  count: Number            // Cantidad de gastos en esa categoría
}
```

---

## 6. Componentes Reutilizables

| Componente | Ubicación | Descripción |
|------------|-----------|-------------|
| `ExpenseCard` | `/components/ExpenseCard.js` | Tarjeta de gasto para usar en el `FlatList`. Muestra ícono, título, fecha y monto. |
| `EmptyState` | `/components/EmptyState.js` | Componente para estados vacíos. Recibe `message` e `icon` como props. |
| `LoadingScreen` | `/components/LoadingScreen.js` | `ActivityIndicator` centrado en pantalla con mensaje de carga opcional. |
| `CategoryBar` | `/components/CategoryBar.js` | Barra visual de progreso para representar el porcentaje de una categoría. |
| `FormField` | `/components/FormField.js` | Campo de formulario con label, input y mensaje de error de validación. |

---

## 7. Reglas de UI — 3 Estados por Pantalla

Según la [constitution.md](file:///c:/Users/HP/Desktop/tp/constitution.md), toda pantalla que consuma datos debe implementar:

| Pantalla | Estado Carga | Estado Vacío | Estado Contenido |
|----------|-------------|-------------|-----------------|
| Dashboard | `ActivityIndicator` centrado | *"Aún no tenés gastos registrados"* + ícono 📝 | `FlatList` con `ExpenseCard` |
| Detalle | `ActivityIndicator` centrado | *"Gasto no encontrado"* + ícono ❌ | Tarjeta con datos completos |
| Formulario | Botón con estado *"Guardando..."* | N/A (siempre tiene contenido) | Formulario con campos |
| Categorías | `ActivityIndicator` centrado | *"No hay datos de categorías todavía"* + ícono 📊 | Lista de categorías con barras |

---

## 8. Fuera de Alcance (Out of Scope)

Las siguientes funcionalidades **no** se incluyen en esta versión:

- ❌ Autenticación de usuarios / Login / Registro.
- ❌ Sincronización en la nube o backend con base de datos SQL/NoSQL.
- ❌ Exportación de datos a PDF, Excel o CSV.
- ❌ Edición o eliminación de gastos existentes.
- ❌ Notificaciones push o recordatorios.
- ❌ Soporte multi-moneda o conversión de divisas.
- ❌ Modo oscuro (dark mode).
- ❌ Tests unitarios o de integración (fuera del alcance de esta etapa).

---

## 9. Datos Semilla (Seed Data)

El archivo `mockApi.js` debe incluir al menos **6 gastos precargados** que cubran distintas categorías para facilitar el desarrollo y la demostración:

| # | Título | Monto | Categoría | Fecha |
|---|--------|-------|-----------|-------|
| 1 | Almuerzo en restaurante | $3,500 | Alimentación | 2026-08-13 |
| 2 | Boleto de colectivo | $650 | Transporte | 2026-08-13 |
| 3 | Entrada de cine | $4,200 | Entretenimiento | 2026-08-12 |
| 4 | Factura de internet | $12,800 | Servicios | 2026-08-10 |
| 5 | Farmacia — Ibuprofeno | $1,900 | Salud | 2026-08-09 |
| 6 | Remera nueva | $15,000 | Compras | 2026-08-08 |

---

## 10. Criterios de Entrega

- [ ] Las 4 pantallas están implementadas y son navegables.
- [ ] Todas las pantallas implementan los 3 estados de UI (Carga, Vacío, Contenido).
- [ ] El formulario valida correctamente todos los campos.
- [ ] Los datos provienen exclusivamente de `mockApi.js` con retardo de 800ms.
- [ ] La interfaz de usuario está completamente en español.
- [ ] El código y los comentarios están en inglés.
- [ ] Se utilizan componentes reutilizables desde `/components`.
- [ ] La estructura de carpetas sigue las convenciones definidas en `constitution.md`.

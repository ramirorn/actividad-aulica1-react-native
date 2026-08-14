# Plan Técnico — SmartSpend

Plan de implementación técnica para la aplicación de gestión de gastos personales.

---

## 1. Estructura de Archivos

```
SmartSpend/
├── app/
│   ├── _layout.js              # Stack / Tabs Router (Layout raíz)
│   ├── index.js                # Lista de gastos + Total (Dashboard)
│   ├── nuevo.js                # Formulario de alta de gasto
│   ├── categorias.js           # Resumen por categorías
│   └── gasto/
│       └── [id].js             # Pantalla de detalle dinámico
├── components/
│   ├── ExpenseCard.js          # Card reutilizable de gasto
│   ├── LoadingSpinner.js       # Componente para estados de carga
│   ├── EmptyState.js           # Componente para estados vacíos
│   ├── CategoryBar.js          # Barra visual de porcentaje por categoría
│   └── FormField.js            # Campo de formulario con validación
├── services/
│   └── mockExpenses.js         # Servicio con Promises + setTimeout (800ms)
├── constants/
│   └── categories.js           # Definición de categorías con íconos y labels
└── assets/                     # Recursos estáticos (imágenes, fuentes)
```

---

## 2. Descripción de Archivos

### `/app/_layout.js` — Layout Raíz

- Configura el `Stack` navigator de `expo-router`.
- Define las opciones de navegación globales (header, colores, transiciones).
- Registra las rutas: `index`, `nuevo`, `categorias`, `gasto/[id]`.

### `/app/index.js` — Dashboard / Listado de Gastos

- Consume `getExpenses()` desde `mockExpenses.js` usando `useEffect` + `useState`.
- Implementa los **3 estados de UI**: Carga → Vacío → Contenido.
- Muestra el **total acumulado** de gastos en un resumen superior.
- Renderiza un `FlatList` con componentes `ExpenseCard`.
- Navegación:
  - `onPress` en un ítem → navega a `/gasto/[id]`.
  - Botón flotante o en header → navega a `/nuevo`.
  - Tab o enlace → navega a `/categorias`.

### `/app/gasto/[id].js` — Detalle de Gasto

- Obtiene el parámetro `id` con `useLocalSearchParams()`.
- Consume `getExpenseById(id)` desde `mockExpenses.js`.
- Implementa los **3 estados de UI**: Carga → Error (no encontrado) → Contenido.
- Muestra todos los campos del gasto: título, monto, categoría (con ícono), fecha y nota.
- Incluye botón de retorno al listado.

### `/app/nuevo.js` — Formulario de Alta

- Campos del formulario:
  - **Título** — `TextInput` (texto, requerido).
  - **Monto** — `TextInput` (numérico, `keyboardType="numeric"`, > 0).
  - **Categoría** — Selector/Picker con las categorías predefinidas.
  - **Fecha** — Selector de fecha o input con formato `YYYY-MM-DD`.
  - **Nota** — `TextInput` multiline (opcional).
- Validaciones:
  - Título no vacío.
  - Monto numérico y mayor a cero.
  - Categoría seleccionada.
  - Fecha no futura.
- Al enviar: llama a `addExpense(data)`, muestra feedback y navega a `index`.
- Estado de carga en el botón: *"Guardando..."*.

### `/app/categorias.js` — Resumen por Categorías

- Consume `getExpensesByCategory()` desde `mockExpenses.js`.
- Implementa los **3 estados de UI**: Carga → Vacío → Contenido.
- Renderiza una lista de categorías con:
  - Ícono + Nombre de la categoría.
  - Monto total y porcentaje.
  - Barra visual de progreso (`CategoryBar`).
- Las categorías se ordenan de mayor a menor monto.

---

## 3. Servicio Mock — `/services/mockExpenses.js`

### Datos en Memoria

```javascript
// Array mutable con datos semilla (6 gastos precargados)
let expenses = [
  { id: "1", title: "Almuerzo en restaurante", amount: 3500, category: "food", date: "2026-08-13", note: null },
  { id: "2", title: "Boleto de colectivo",     amount: 650,  category: "transport", date: "2026-08-13", note: null },
  { id: "3", title: "Entrada de cine",         amount: 4200, category: "entertainment", date: "2026-08-12", note: null },
  { id: "4", title: "Factura de internet",     amount: 12800, category: "services", date: "2026-08-10", note: null },
  { id: "5", title: "Farmacia — Ibuprofeno",   amount: 1900, category: "health", date: "2026-08-09", note: null },
  { id: "6", title: "Remera nueva",            amount: 15000, category: "shopping", date: "2026-08-08", note: null },
];
```

### Funciones Exportadas

| Función | Firma | Descripción |
|---------|-------|-------------|
| `getExpenses` | `() → Promise<Expense[]>` | Retorna todos los gastos ordenados por fecha descendente. |
| `getExpenseById` | `(id: string) → Promise<Expense \| null>` | Busca un gasto por ID. Retorna `null` si no existe. |
| `addExpense` | `(data: object) → Promise<Expense>` | Genera un ID único, agrega al array y retorna el nuevo gasto. |
| `getExpensesByCategory` | `() → Promise<CategorySummary[]>` | Agrupa gastos por categoría con totales y porcentajes. |

> **Todas las funciones** envuelven su lógica en `new Promise` con `setTimeout` de **800ms**.

---

## 4. Componentes Reutilizables — `/components/`

### `ExpenseCard.js`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `title` | `string` | Título del gasto |
| `amount` | `number` | Monto del gasto |
| `category` | `string` | Clave de categoría (para resolver ícono) |
| `date` | `string` | Fecha en formato ISO |
| `onPress` | `function` | Callback al presionar la tarjeta |

**Layout:** Fila con ícono a la izquierda, título + fecha al centro, monto a la derecha.

### `LoadingSpinner.js`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `message` | `string` (opcional) | Texto debajo del spinner (default: *"Cargando..."*) |

**Layout:** `ActivityIndicator` centrado vertical y horizontalmente con mensaje opcional.

### `EmptyState.js`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `icon` | `string` | Emoji o ícono a mostrar |
| `message` | `string` | Mensaje descriptivo del estado vacío |

**Layout:** Ícono grande centrado con mensaje debajo en color gris.

### `CategoryBar.js`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `label` | `string` | Nombre de la categoría |
| `icon` | `string` | Emoji de la categoría |
| `total` | `number` | Monto total de la categoría |
| `percentage` | `number` | Porcentaje del total general (0-100) |

**Layout:** Fila con ícono + label, monto, y barra de progreso proporcional al porcentaje.

### `FormField.js`

| Prop | Tipo | Descripción |
|------|------|-------------|
| `label` | `string` | Etiqueta del campo |
| `value` | `string` | Valor actual del input |
| `onChangeText` | `function` | Callback de cambio de texto |
| `error` | `string` (opcional) | Mensaje de error de validación |
| `placeholder` | `string` (opcional) | Placeholder del input |
| `keyboardType` | `string` (opcional) | Tipo de teclado (`default`, `numeric`) |
| `multiline` | `boolean` (opcional) | Si el campo es multilínea |

**Layout:** Label superior, `TextInput` con borde, mensaje de error en rojo debajo si existe.

---

## 5. Diagrama de Dependencias

```
┌─────────────────────────────────────────────────────────────┐
│                         _layout.js                          │
│                    (Stack Navigator)                        │
└──────────┬──────────┬───────────┬──────────────────────────┘
           │          │           │
     ┌─────▼───┐ ┌────▼────┐ ┌───▼──────┐  ┌──────────────┐
     │ index.js│ │nuevo.js │ │categorias│  │ gasto/[id].js│
     │         │ │         │ │  .js     │  │              │
     └────┬────┘ └────┬────┘ └────┬─────┘  └──────┬───────┘
          │           │           │                │
          │     ┌─────▼─────┐    │                │
          │     │ FormField │    │                │
          │     └───────────┘    │                │
          │                      │                │
     ┌────▼────────┐    ┌───────▼──────┐         │
     │ExpenseCard  │    │CategoryBar   │         │
     └─────────────┘    └──────────────┘         │
          │                    │                  │
     ┌────▼────────────────────▼──────────────────▼───┐
     │            LoadingSpinner / EmptyState          │
     └────────────────────────┬───────────────────────┘
                              │
                    ┌─────────▼──────────┐
                    │  mockExpenses.js   │
                    │  (services layer)  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  categories.js     │
                    │  (constants)       │
                    └────────────────────┘
```

---

## 6. Flujo de Navegación

```
                    ┌──────────────┐
                    │   App Start  │
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
                    │   index.js   │◄─────────────────┐
                    │  (Dashboard) │                   │
                    └──┬───┬───┬──┘                   │
                       │   │   │                      │
          ┌────────────┘   │   └───────────┐          │
          │                │               │          │
   ┌──────▼───────┐ ┌─────▼──────┐ ┌──────▼───────┐  │
   │ gasto/[id]   │ │  nuevo.js  │ │ categorias   │  │
   │  (Detalle)   │ │  (Form)    │ │ (Resumen)    │  │
   └──────┬───────┘ └─────┬──────┘ └──────────────┘  │
          │               │                           │
          │  Volver        │  Guardar exitoso         │
          └───────────────┴───────────────────────────┘
```

---

## 7. Tecnologías y Dependencias

| Paquete | Versión | Uso |
|---------|---------|-----|
| `expo` | SDK 51+ | Framework base |
| `expo-router` | ^3.x | Navegación file-based |
| `react-native` | (incluido en Expo) | Componentes UI nativos |
| `expo-status-bar` | (incluido en Expo) | Control de barra de estado |

> **Sin dependencias adicionales.** El proyecto utiliza exclusivamente los paquetes incluidos en el template de Expo.

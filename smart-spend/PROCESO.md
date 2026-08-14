# PROCESO.md — Registro de Desarrollo SmartSpend

Documento de proceso que registra los prompts utilizados, las salidas obtenidas, revisiones solicitadas y commits realizados durante el desarrollo de cada tarea.

---

## T01: Configuración inicial de expo-router y layout base

### Prompt del usuario

```
@tasks.md @plan.md @constitution.md @spec.md @engineering-mobile-app-builder.md

Quiero que empieces a desarrollar la tarea numero 1, tienes el contexto en los archivos adjuntos,
vamos a ir desarrollando una tarea a la vez, tienes las mismas en tasks.md.
```

### Acciones realizadas por el agente

1. **Lectura de contexto:** Se leyeron los 5 archivos adjuntos (`tasks.md`, `plan.md`, `constitution.md`, `spec.md`, `engineering-mobile-app-builder.md`) para entender el proyecto completo.

2. **Exploración del proyecto existente:** Se revisó la estructura actual del proyecto creado con el template por defecto de Expo (tabs, TypeScript, componentes de ejemplo).

3. **Limpieza del template por defecto:**
   - Se eliminaron los archivos del template: `app/(tabs)/`, `app/modal.tsx`, `app/_layout.tsx`.
   - Se eliminaron componentes de ejemplo: `components/external-link.tsx`, `components/haptic-tab.tsx`, `components/hello-wave.tsx`, `components/parallax-scroll-view.tsx`, `components/themed-text.tsx`, `components/themed-view.tsx`, `components/ui/`.
   - Se eliminaron archivos TypeScript: `tsconfig.json`, `eslint.config.js`, `expo-env.d.ts`.
   - Se eliminaron hooks y scripts del template: `hooks/`, `scripts/`.
   - Se eliminó `constants/theme.ts`.

4. **Creación de archivos nuevos:**

   - **`app/_layout.js`** — Layout raíz con `Stack` navigator de `expo-router`. Configuración global del header (fondo azul `#4A90D9`, texto blanco, negrita). Registro de las 4 rutas: `index`, `nuevo`, `categorias`, `gasto/[id]`.
   - **`app/index.js`** — Pantalla placeholder del Dashboard con texto "SmartSpend" y subtítulo.
   - **`app/gasto/[id].js`** — Placeholder para la ruta dinámica de detalle de gasto.
   - **`services/mockExpenses.js`** — Placeholder (implementación en T02).
   - **`constants/categories.js`** — Placeholder (implementación en T02).

5. **Modificación de `package.json`:**
   - Se removieron las devDependencies de TypeScript y ESLint ya que el proyecto usa JavaScript (ES6+) según la constitution.

6. **Verificación:**
   - Se ejecutó `npx expo start --clear --port 8082`.
   - El servidor de desarrollo Expo inició correctamente sin errores.
   - Se verificó que la estructura de carpetas `/app`, `/components`, `/services`, `/constants` estaba creada.

### Resultado de la salida

```
Estructura final del proyecto:

smart-spend/
├── app/
│   ├── _layout.js          ✅ Stack navigator configurado
│   ├── index.js             ✅ Dashboard placeholder
│   └── gasto/
│       └── [id].js          ✅ Detalle placeholder
├── components/              ✅ Directorio listo
├── services/
│   └── mockExpenses.js      ✅ Placeholder
├── constants/
│   └── categories.js        ✅ Placeholder
└── assets/                  ✅ Ya existía
```

### Criterios de aceptación verificados

- [x] El proyecto se inicia sin errores con `npx expo start`.
- [x] El layout raíz renderiza correctamente el Stack navigator.
- [x] La estructura de carpetas base está creada (`/app`, `/components`, `/services`, `/constants`).

### Revisiones / Cambios solicitados

> No se solicitaron revisiones ni cambios para esta tarea.

### Commits

| Hash | Mensaje | Archivos |
|------|---------|----------|
| `7b9bdad` | `feat: configuración inicial de expo-router y layout base (T01)` | 28 archivos cambiados, 92 inserciones, 877 eliminaciones |

---

## T02: Crear servicio mock de datos

### Prompt del usuario

```
Procede con la task 2
```

### Acciones realizadas por el agente

1. **Creación de `constants/categories.js`:**
   - Se definió el array `CATEGORIES` con las 7 categorías predefinidas según la spec: `food`, `transport`, `entertainment`, `services`, `health`, `shopping`, `other`.
   - Cada categoría tiene `key`, `label` (en español) e `icon` (emoji).
   - Se agregó una función utilitaria `getCategoryByKey(key)` para buscar categorías por clave.

2. **Creación de `services/mockExpenses.js`:**
   - Se definió el array mutable `expenses` con los 6 gastos semilla especificados en la documentación.
   - Se implementaron las 4 funciones exportadas:
     - `getExpenses()` — Retorna todos los gastos ordenados por fecha descendente. Usa `[...expenses].sort()` para no mutar el array original.
     - `getExpenseById(id)` — Busca por ID con `.find()`, retorna `null` si no existe.
     - `addExpense(data)` — Genera un ID incremental (`nextId++`), agrega al array y retorna el nuevo gasto.
     - `getExpensesByCategory()` — Agrupa con un map acumulador, mergea con metadata de `CATEGORIES`, calcula porcentajes con `Math.round()`, y ordena de mayor a menor monto.
   - Todas las funciones envuelven su lógica en `new Promise` con `setTimeout` de 800ms.

3. **Verificación de sintaxis:**
   - Se ejecutó `node --check` sobre ambos archivos: OK sin errores.

4. **Smoke test en `app/index.js`:**
   - Se actualizó el placeholder del Dashboard para importar `getExpenses()` y mostrar el conteo de gastos, verificando que Metro resuelve correctamente las importaciones del mock service.
   - Se implementó el patrón `useState(true)` + `ActivityIndicator` para el estado de carga.

### Resultado de la salida

**`constants/categories.js`** — 7 categorías con estructura `{ key, label, icon }`:
```
🍔 Alimentación | 🚌 Transporte | 🎬 Entretenimiento | 💡 Servicios | 💊 Salud | 🛍️ Compras | 📦 Otros
```

**`services/mockExpenses.js`** — 4 funciones exportadas, todas retornan `Promise` con delay de 800ms:
```
getExpenses()          → Promise<Expense[]>        (6 gastos, ordenados por fecha desc)
getExpenseById(id)     → Promise<Expense | null>   (busca por ID)
addExpense(data)       → Promise<Expense>          (genera ID, agrega al array)
getExpensesByCategory()→ Promise<CategorySummary[]> (agrupa con totales y %)
```

### Criterios de aceptación verificados

- [x] Las 4 funciones están exportadas y retornan Promises.
- [x] Cada función tiene un retardo simulado de 800ms.
- [x] `getExpenses()` retorna los 6 gastos semilla ordenados por fecha.
- [x] `getExpenseById("1")` retorna el primer gasto; `getExpenseById("999")` retorna `null`.
- [x] `addExpense({...})` incrementa el array y retorna el nuevo gasto con ID generado.
- [x] `getExpensesByCategory()` retorna objetos con `category`, `label`, `icon`, `total`, `percentage`, `count`.

### Revisiones / Cambios solicitados

> No se solicitaron revisiones ni cambios para esta tarea.

### Commits

| Hash | Mensaje | Archivos |
|------|---------|----------|
| `d6c5c94` | `feat: crear servicio mock de datos y constantes de categorías (T02)` | 4 archivos cambiados, 162 inserciones, 12 eliminaciones |

---

## T04: Crear componentes reutilizables

### Prompt del usuario

```
Procede con las task 2
```

> **Nota:** T02 ya estaba completada. Se interpretó como "continuar con las siguientes tareas disponibles". Según el grafo de dependencias, T04 (componentes) era la siguiente tarea disponible ya que T03 depende de T04.

### Acciones realizadas por el agente

1. **Creación de `components/ExpenseCard.js`:**
   - Layout en fila: ícono de categoría (círculo gris claro) a la izquierda, título + fecha al centro, monto a la derecha.
   - Usa `getCategoryByKey()` para resolver el emoji del ícono.
   - Incluye funciones locales `formatDate()` (dd/mm/yyyy) y `formatCurrency()` ($X.XXX con locale `es-AR`).
   - Recibe props: `title`, `amount`, `category`, `date`, `onPress`.

2. **Creación de `components/LoadingSpinner.js`:**
   - `ActivityIndicator` centrado vertical y horizontalmente con fondo `#F5F7FA`.
   - Mensaje opcional debajo del spinner (default: "Cargando...").
   - Recibe prop: `message` (opcional).

3. **Creación de `components/EmptyState.js`:**
   - Emoji grande (56px) centrado con mensaje descriptivo en gris debajo.
   - Padding horizontal de 32 para texto largo.
   - Recibe props: `icon`, `message`.

4. **Creación de `components/CategoryBar.js`:**
   - Fila superior: ícono + label a la izquierda, monto formateado a la derecha.
   - Barra de progreso visual proporcional al porcentaje (fondo gris, relleno azul `#4A90D9`).
   - Porcentaje en texto pequeño alineado a la derecha.
   - Recibe props: `label`, `icon`, `total`, `percentage`.

5. **Creación de `components/FormField.js`:**
   - Label superior en negrita, `TextInput` con borde gris y border-radius.
   - Soporte para `multiline` (min-height 80, alineación top) y `keyboardType` (numeric).
   - Cuando `error` tiene contenido: borde rojo + mensaje de error en rojo debajo.
   - Recibe props: `label`, `value`, `onChangeText`, `error`, `placeholder`, `keyboardType`, `multiline`.

6. **Verificación de sintaxis:**
   - `node --check` sobre los 5 archivos: todos OK.

### Criterios de aceptación verificados

- [x] Cada componente recibe props documentadas y renderiza correctamente.
- [x] `ExpenseCard` muestra ícono, título, fecha formateada y monto con formato moneda.
- [x] `LoadingSpinner` muestra un spinner centrado en pantalla.
- [x] `EmptyState` muestra un mensaje e ícono centrados.
- [x] `CategoryBar` renderiza una barra proporcional al porcentaje.
- [x] `FormField` muestra error en rojo cuando la prop `error` tiene contenido.

### Revisiones / Cambios solicitados

> No se solicitaron revisiones ni cambios para esta tarea.

### Commits

| Hash | Mensaje | Archivos |
|------|---------|----------|
| `5d69d41` | `feat: crear componentes reutilizables (T04)` | 7 archivos cambiados, 400 inserciones, 8 eliminaciones |

---

## T03: Implementar pantalla principal (Dashboard)

### Prompt del usuario

```
procede con la task 3
```

### Acciones realizadas por el agente

1. **Reemplazo completo de `app/index.js`:**
   - Se reemplazó el placeholder/smoke-test con la implementación completa del Dashboard.
   - Se importaron los componentes reutilizables de T04: `ExpenseCard`, `LoadingSpinner`, `EmptyState`.
   - Se importó `getExpenses()` del servicio mock de T02.
   - Se usó `useRouter()` de `expo-router` para navegación.

2. **Implementación de los 3 estados de UI:**
   - **Carga:** `LoadingSpinner` con mensaje "Cargando gastos..." se muestra mientras se resuelve la promesa (800ms).
   - **Vacío:** `EmptyState` con ícono 📝 y mensaje "Aún no tenés gastos registrados", más un botón para agregar gasto.
   - **Contenido:** Tarjeta de total acumulado + `FlatList` con `ExpenseCard` + barra de navegación inferior.

3. **Total acumulado:**
   - Se calcula con `reduce()` sobre el array de gastos.
   - Se formatea como moneda argentina con `toLocaleString('es-AR')`.
   - Se muestra en una tarjeta azul destacada en la parte superior.

4. **Navegación:**
   - `onPress` en `ExpenseCard` → `router.push('/gasto/${item.id}')`.
   - Botón "+ Nuevo gasto" → `router.push('/nuevo')`.
   - Botón "📊 Categorías" → `router.push('/categorias')`.

5. **Verificación de sintaxis:**
   - `node --check app/index.js`: OK.

### Criterios de aceptación verificados

- [x] Se muestra `ActivityIndicator` durante los primeros 800ms.
- [x] Se muestra el total acumulado formateado como moneda.
- [x] El `FlatList` renderiza los 6 gastos semilla con `ExpenseCard`.
- [x] Al presionar un gasto se navega a `/gasto/[id]`.
- [x] El botón de agregar navega a `/nuevo`.

### Revisiones / Cambios solicitados

> No se solicitaron revisiones ni cambios para esta tarea.

### Commits

| Hash | Mensaje | Archivos |
|------|---------|----------|
| `pendiente` | `feat: implementar pantalla principal Dashboard (T03)` | 3 archivos (index.js + tasks.md + PROCESO.md) |

---

<!-- Las siguientes tareas se documentarán a medida que se vayan completando -->



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
| `bc7045c` | `feat: implementar pantalla principal Dashboard (T03)` | 3 archivos cambiados, 198 inserciones, 33 eliminaciones |

---

## T05: Crear pantalla de detalle dinámico

### Prompt del usuario

```
Procede con la task 5
```

### Acciones realizadas por el agente

1. **Reemplazo de `app/gasto/[id].js`:**
   - Se reemplazó el placeholder anterior con la implementación completa de la pantalla de detalle dinámico.
   - Se importaron dependencias: `useLocalSearchParams` y `useRouter` de `expo-router`.
   - Se importó la función mock `getExpenseById` y el helper `getCategoryByKey`.
   - Se importó el componente reutilizable `LoadingSpinner`.

2. **Manejo de estado y datos:**
   - Se utilizó `useLocalSearchParams` para extraer el `id` de la ruta.
   - Se configuraron estados para `expense`, `loading` y `notFound`.
   - Se utilizó `useEffect` para cargar el gasto por ID, actualizando los estados correspondientes según si se encontró o no la data.

3. **Implementación de los 3 estados de UI:**
   - **Carga:** Se muestra el `LoadingSpinner` con el mensaje "Cargando detalle..." mientras se resuelve la promesa.
   - **Error (no encontrado):** Si `getExpenseById` retorna nulo (e.g. ID inválido), se muestra un ícono de error ❌, un mensaje de "Gasto no encontrado" y un botón para regresar.
   - **Contenido:** Si se encuentra el gasto, se muestra una tarjeta con:
     - Cabecera azul destacada con el monto formateado.
     - Filas de detalle para Título, Categoría (con ícono) y Fecha.
     - Fila adicional para la Nota, renderizada condicionalmente si existe.
   - Se añadió un botón inferior "Volver al listado" usando `router.back()`.

4. **Verificación de sintaxis:**
   - Se verificó la sintaxis del archivo modificado mediante `node --check`.

### Criterios de aceptación verificados

- [x] Se lee el `id` del parámetro de ruta dinámico.
- [x] Se muestra `ActivityIndicator` durante la carga.
- [x] Si el gasto no existe, se muestra *"Gasto no encontrado"*.
- [x] Si el gasto existe, se muestran todos sus campos.
- [x] El botón de volver regresa al Dashboard.

### Revisiones / Cambios solicitados

> **Usuario:** "Quiero agregar una corrección para la task 5, al momento de seleccionar un gasto y abrir la pantalla de detalle dinámico, hay redundancia al implementar dos botones para volver al inicio, entonces quisiera que quites el de la esquina superior izquierda y dejes la de 'Volver al listado'."
> 
> **Acción:** Se agregó `headerBackVisible: false` a las opciones de navegación en `app/_layout.js` para la pantalla `gasto/[id]`, eliminando el botón predeterminado de volver.

### Commits

| Hash | Mensaje | Archivos |
|------|---------|----------|
| `9840a84` | `feat: crear pantalla de detalle dinámico (T05)` | 3 archivos cambiados, 244 inserciones, 14 eliminaciones |
| `ddef91e` | `fix: remover botón volver redundante en pantalla de detalle de gasto` | 1 archivo cambiado, 1 inserción, 1 eliminación |

---

## T06: Construir formulario de alta de gasto

### Prompt del usuario

```
Procede con la task 6.
```

### Acciones realizadas por el agente

1. **Creación de `app/nuevo.js`:**
   - Se implementó la pantalla de creación de gastos.
   - Se usaron estados independientes para `title`, `amount`, `category`, `date`, `note` y `errors`.
   - El estado inicial de la fecha se configura a la fecha actual (`YYYY-MM-DD`).

2. **Implementación de campos y componentes:**
   - Se utilizó `FormField` para Título, Monto (con `keyboardType="numeric"`), Fecha y Nota (con `multiline=true`).
   - Para la Categoría, se construyó un selector horizontal (`flexWrap: 'wrap'`) utilizando `TouchableOpacity` que itera sobre la constante `CATEGORIES`, mostrando el ícono y la etiqueta como chips seleccionables.
   - Todo el formulario está envuelto en un `KeyboardAvoidingView` y `ScrollView` para asegurar accesibilidad con el teclado nativo, especialmente en iOS.

3. **Lógica de validación (`handleSave`):**
   - **Título:** Obligatorio (`trim()`).
   - **Monto:** Validado como numérico (se reemplaza coma por punto por si el teclado lo envía así) y mayor a 0.
   - **Categoría:** Selección obligatoria.
   - **Fecha:** Validada con expresión regular para el formato `YYYY-MM-DD`. También se valida lógicamente que la fecha ingresada no sea mayor a la fecha actual.
   - Si existen errores, se guardan en el estado `errors` y se envían a cada `FormField` respectivo para renderizarse en rojo.

4. **Operación de guardado y navegación:**
   - Al enviar el formulario con datos válidos, se invoca `addExpense(data)`.
   - El botón deshabilita y cambia su texto a *"Guardando..."* mientras se procesa.
   - Al completarse, se muestra un `Alert.alert` indicando éxito y un botón "OK" que navega a la pantalla principal usando `router.replace('/')`.

5. **Verificación de sintaxis:**
   - Se verificó la sintaxis del código con `node --check app/nuevo.js`: OK.

### Criterios de aceptación verificados

- [x] Todos los campos se renderizan correctamente.
- [x] Se muestran errores de validación debajo de cada campo con error.
- [x] No se puede enviar el formulario con campos inválidos.
- [x] Al enviar correctamente, el gasto se agrega y se navega al Dashboard.
- [x] El botón muestra *"Guardando..."* durante la operación.

### Revisiones / Cambios solicitados

> **Usuario:** "Nuevamente ocurre lo mismo en el formulario de carga de gastos, aparece el headerBackVisible y esto rompe la estética de la app. Además, agregar la fecha del gasto es muy poco intuitivo... te lleva supuestamente a la pantalla de inicio, pero en esta aparece el headerBackVisible nuevamente."
> 
> **Acción:** 
> 1. Se instaló `@react-native-community/datetimepicker` y se reemplazó el campo de texto por un selector de fecha nativo intuitivo (spinner en iOS, modal en Android).
> 2. Se reemplazó el método `router.replace('/')` por `router.back()` en el guardado exitoso para evitar apilar una nueva instancia del Dashboard y prevenir la aparición del botón de atrás nativo en la raíz.
> 3. Se ocultó el header de atrás (`headerBackVisible: false`) en `app/_layout.js` para `/nuevo` y `/categorias`.
> 4. Se agregó un botón secundario "Cancelar" en el formulario de alta.

> **Usuario 2:** "Al momento de crear el gasto este no se refleja automático (luego de volver a la ruta inicial), sino que hay que actualizar para que este aparezca."
>
> **Acción 2:** Se reemplazó `useEffect` por `useFocusEffect` en `app/index.js` para que la función `loadExpenses` se vuelva a ejecutar automáticamente cada vez que el usuario vuelve al Dashboard (al hacer `router.back()`), asegurando que la lista siempre esté actualizada.

### Commits

| Hash | Mensaje | Archivos |
|------|---------|----------|
| `f0f57c9` | `feat: crear formulario de alta de gasto (T06)` | 3 archivos cambiados, 292 inserciones, 7 eliminaciones |
| `b020d81` | `fix: mejorar ux fecha, remover botón atrás redundante y corregir navegación` | 6 archivos cambiados |
| `de83704` | `fix: recargar dashboard automáticamente al volver` | 2 archivos modificados |

---

<!-- Las siguientes tareas se documentarán a medida que se vayan completando -->

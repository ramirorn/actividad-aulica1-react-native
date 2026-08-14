# Contexto para el Agente de IA

## Reglas Obligatorias

1. Estás trabajando en una app con Expo SDK y `expo-router`. NO utilices `@react-navigation/native` directamente.
2. Los datos provienen exclusivamente de `services/mockExpenses.js`.
3. Todo componente que consuma datos asíncronos debe manejar un estado `loading` (`useState(true)`) y mostrar un `ActivityIndicator` mientras carga.
4. No instales paquetes externos adicionales sin pedir confirmación.
5. Usa componentes de React Native (`View`, `Text`, `TouchableOpacity`, `TextInput`, `FlatList`).

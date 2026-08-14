// Root layout — configures the Stack navigator for the entire app.
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#4A90D9' },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen
          name="index"
          options={{ title: 'SmartSpend' }}
        />
        <Stack.Screen
          name="nuevo"
          options={{ title: 'Nuevo Gasto', headerBackVisible: false }}
        />
        <Stack.Screen
          name="categorias"
          options={{ title: 'Categorías', headerBackVisible: false }}
        />
        <Stack.Screen
          name="gasto/[id]"
          options={{ title: 'Detalle del Gasto', headerBackVisible: false }}
        />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

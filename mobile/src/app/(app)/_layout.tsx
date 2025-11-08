import { Stack } from "expo-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Stack.Screen name="exercise" component={ExerciseScreen} /> */}
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}

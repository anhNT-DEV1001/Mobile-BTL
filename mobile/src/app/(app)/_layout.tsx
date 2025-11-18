import { Stack } from "expo-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../common/apis/query.client";

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Stack.Screen name="exercise" component={ExerciseScreen} /> */}
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}

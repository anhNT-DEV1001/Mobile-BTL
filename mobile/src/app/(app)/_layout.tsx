import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../common/apis/query.client";
import HomeScreenMainLayout from "@/src/screens/home/layout/HomeScreenMainLayout";

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Stack.Screen name="exercise" component={ExerciseScreen} /> */}
      {/* <Stack screenOptions={{ headerShown: false }} /> */}
      <HomeScreenMainLayout/>
    </QueryClientProvider>
  );
}

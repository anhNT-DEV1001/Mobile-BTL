import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "../../common/apis/query.client";
import { Slot } from "expo-router";

export default function AppLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}

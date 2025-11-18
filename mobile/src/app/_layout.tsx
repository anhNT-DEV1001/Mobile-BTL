import { Slot } from "expo-router";
import { useAuthStore, useIsLoggedIn } from "../common/stores";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const isLogin = useIsLoggedIn();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) return null;
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

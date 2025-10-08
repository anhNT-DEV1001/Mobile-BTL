import { Slot } from "expo-router";
import { useAuthStore, useIsLoggedIn } from "../common/stores";

export default function RootLayout() {
  const isLogin = useIsLoggedIn();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) return null;
  return <Slot />;
}

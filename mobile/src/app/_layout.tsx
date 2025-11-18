import { Slot } from "expo-router";
import { useAuthStore, useIsLoggedIn } from "../common/stores";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PaperProvider, MD3LightTheme } from "react-native-paper";

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1976d2',
    secondary: '#424242',
    background: '#ffffff',
    surface: '#ffffff',
    error: '#d32f2f',
    onPrimary: '#ffffff',
    onSecondary: '#ffffff',
    onBackground: '#212121',
    onSurface: '#212121',
  },
};

export default function RootLayout() {
  const isLogin = useIsLoggedIn();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) return null;
  return (
    <SafeAreaProvider>
<<<<<<< HEAD
      <PaperProvider>
=======
      <PaperProvider theme={theme}>
>>>>>>> 263cd9eaf7bedbdb8782a17fde89eee3cac21258
        <Slot />
      </PaperProvider>
    </SafeAreaProvider>
  );
}

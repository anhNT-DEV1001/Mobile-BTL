import { Redirect } from "expo-router";
import React from "react";
import { useAuthStore, useIsLoggedIn } from "../common/stores";

export default function Index() {
  const isLogin = useIsLoggedIn();
  const hasHydrated = useAuthStore.persist.hasHydrated();

  if (!hasHydrated) return null;

  // Điều hướng dựa trên trạng thái đăng nhập
  if (!isLogin) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)" />;
}

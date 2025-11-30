import { Redirect, router } from "expo-router";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuthStore, useIsLoggedIn } from "../common/stores";
import { usePushNotifications } from "../common/hooks/useNotification"; 

export default function Index() {
  const isLogin = useIsLoggedIn();
  const hasHydrated = useAuthStore.persist.hasHydrated();
  const { expoPushToken, notification } = usePushNotifications();
  if (!hasHydrated) return null;
  const handleNavigate = () => {
    if (!isLogin) {
      router.replace("/(auth)/login");
    } else {
      router.replace("/(app)");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>System Check & Debug</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Expo Push Token:</Text>
        {expoPushToken ? (
          <Text selectable={true} style={styles.token}>
            {expoPushToken}
          </Text>
        ) : (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#0000ff" />
            <Text style={styles.waiting}> Đang kết nối Expo Server...</Text>
          </View>
        )}
      </View>

      <View style={styles.infoBox}>
        <Text>Trạng thái Login: {isLogin ? "Đã đăng nhập" : "Chưa đăng nhập"}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNavigate}>
        <Text style={styles.buttonText}>
          TIẾP TỤC VÀO APP
        </Text>
      </TouchableOpacity>

      <Text style={styles.hint}>
        (Copy token ở trên, sau đó bấm nút để vào app như bình thường)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#666",
  },
  token: {
    fontSize: 14,
    color: "#007AFF", 
    backgroundColor: "#F0F8FF",
    padding: 10,
    borderRadius: 5,
    textAlign: "center",
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },
  waiting: {
    marginLeft: 10,
    color: "#888",
  },
  infoBox: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  hint: {
    marginTop: 15,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});
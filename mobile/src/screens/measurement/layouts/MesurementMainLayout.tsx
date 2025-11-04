import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Slot, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function MesurementMainLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return(
    <View style={[styles.container, { paddingTop: insets.top }]}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Mesurement</Text>
            <View style={styles.headerRight}>
              <TouchableOpacity 
              onPress={() => router.back()}
              >
                <Text style={styles.headerAction}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
    
          <View style={styles.content}>
            <Slot />
          </View>
        </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#003366" },
  header: {
    height: 56,
    backgroundColor: "#003366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  headerAction: { color: "white", marginLeft: 12 },
  content: { flex: 1 },
});
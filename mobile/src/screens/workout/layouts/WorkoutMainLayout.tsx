import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import Workouts from "../includes/Workouts";
import Templates from "../includes/Templates";

type ViewMode = "workouts" | "templates";

export default function WorkoutMainLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>("workouts");

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header - tương tự như measurement */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={() => router.push("/(app)")}
          />
          <Text style={styles.headerTitle}>Workout</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {viewMode === "workouts" ? <Workouts /> : <Templates />}
      </View>

      {/* Footer - Tab Navigation */}
      <View style={[styles.footer, { paddingBottom: insets.bottom }]}>
        <TouchableOpacity
          style={[
            styles.footerTab,
            viewMode === "workouts" && styles.footerTabActive,
          ]}
          onPress={() => setViewMode("workouts")}
        >
          <Text
            style={[
              styles.footerTabText,
              viewMode === "workouts" && styles.footerTabTextActive,
            ]}
          >
            My Workouts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.footerTab,
            viewMode === "templates" && styles.footerTabActive,
          ]}
          onPress={() => setViewMode("templates")}
        >
          <Text
            style={[
              styles.footerTabText,
              viewMode === "templates" && styles.footerTabTextActive,
            ]}
          >
            My Templates
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
  },
  header: {
    height: 56,
    backgroundColor: "#003366",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  footer: {
    minHeight: 56,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  footerTab: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  footerTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: "#003366",
  },
  footerTabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#757575",
  },
  footerTabTextActive: {
    color: "#003366",
    fontWeight: "700",
  },
});

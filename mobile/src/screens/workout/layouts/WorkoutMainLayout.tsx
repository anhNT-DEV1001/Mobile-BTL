import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomNavigation, IconButton } from "react-native-paper";
import { Slot, useRouter, useSegments } from "expo-router";

export default function WorkoutMainLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const segments = useSegments();

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "index", title: "Template", focusedIcon: "menu" },
    { key: "workout", title: "Workout", focusedIcon: "dumbbell" },
    { key: "stats", title: "Statistc", focusedIcon: "chart-line" },
    { key: "schedule", title: "Schedule", focusedIcon: "calendar" },
  ]);

  const handleNavigate = (newIndex: number) => {
    setIndex(newIndex);
    const selectedRoute = routes[newIndex].key;

    if (selectedRoute === "index") {
      router.push("/workout");
    } else if (selectedRoute === "workout") {
      router.push("/(app)/workout/workoutInclude");
    } else if (selectedRoute === "stats") {
      router.push("/(app)");
    } else {
      // fallback to base workout route if an unknown key appears
      router.push("/workout");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      
      <View style={styles.header}>
        <View style={styles.headerLeft}>
              <IconButton
                icon="arrow-left"
                iconColor="white"
                size={24}
                onPress={() => router.back()}
              />
          <Text style={styles.headerTitle}>Workout</Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={() => router.push("/")}
          >
            <Text style={styles.headerAction}>Add Template</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Nội dung con */}
      <View style={styles.content}>
        <Slot />
      </View>

      {/* Bottom Navigation */}
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={handleNavigate}
        renderScene={() => null}
        activeColor="#ffffff"
        inactiveColor="#cccccc"
        barStyle={{
          backgroundColor: "#003366",
          paddingBottom: insets.bottom,
        }}
      />
    </View>
  );
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
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: { color: "white", fontSize: 18, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  headerAction: { color: "white", marginLeft: 12 },
  content: { flex: 1 },
});

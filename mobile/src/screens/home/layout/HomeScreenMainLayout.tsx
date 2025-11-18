import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Slot, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";

export default function HomeScreenMainLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return(
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.content}>
        <Slot />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f5f5f5" 
  },
  content: { 
    flex: 1 
  },
});
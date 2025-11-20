import React from "react";
import { View, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreenMainLayout({ children }: { children: React.ReactNode }) {
  const insets = useSafeAreaInsets();
  return(
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {children}
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
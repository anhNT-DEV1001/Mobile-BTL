import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, Button } from "react-native-paper";
import { Link, router } from "expo-router";

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register Page</Text>
            <Button 
                mode="outlined"
                onPress={() => router.push("/(auth)/login")}
                style={styles.button}
            >
                Quay lại Login
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    button: {
        marginTop: 10,
        width: "100%",
    },
});

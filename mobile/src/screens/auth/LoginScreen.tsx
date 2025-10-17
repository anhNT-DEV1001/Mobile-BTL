import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Button, Text, useTheme } from "react-native-paper";
import { useAuth } from "./hooks/useAuth";
import { Link } from "expo-router";

export default function LoginScreen() {
    const theme = useTheme();
    const [email , setEmail ] = useState("");
    const [password , setPassword ] = useState("");
    const { login, loginMutation } = useAuth();



    const handleLogin = async () => {
        if(!email || !password) return; 
        
        console.log("🔐 Đang đăng nhập với email:", email);
        
        try {
            await login({email, password});
        } catch (error : any) {
            console.error("Lỗi đăng nhập:", error.message);
        }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>
        <Text style={styles.text}>
            Chưa có tài khoản?{" "}
            <Link href="/(auth)/register" style={styles.link}>
                Đăng kí ngay
            </Link>
        </Text>

        <TextInput
            label="Email"
            mode="outlined"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
        />

        <TextInput
            label="Mật khẩu"
            mode="outlined"
            value={password}
            onChangeText={setPassword}
            style={styles.input}
            secureTextEntry
        />

        {loginMutation.isError && (
        <Text style={styles.errorText}>
            {(loginMutation.error as any)?.response?.data?.message || "Đăng nhập thất bại"}
        </Text>
        )}
        <Button
            mode="contained"
            onPress={handleLogin}
            loading={loginMutation.isPending}
            disabled={loginMutation.isPending}
            style={styles.button}
        >
            Đăng nhập
        </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 15,
    },
    button: {
        marginTop: 10,
        paddingVertical: 5,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    link: {
        color: "blue",
        fontWeight: "bold",
        textDecorationLine: "underline"
    },
    text: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: "center"
    }
});

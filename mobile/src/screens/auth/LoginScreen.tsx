import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { TextInput, Button, Text, Surface, Card } from "react-native-paper";
import { useAuth } from "./hooks/useAuth";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LoginScreen() {
    const [email , setEmail ] = useState("");
    const [password , setPassword ] = useState("");
    const [showPassword, setShowPassword] = useState(false);
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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            <View style={styles.container}>
                {/* Header Section */}
                <View style={styles.header}>
                    <MaterialCommunityIcons name="dumbbell" size={60} color="#0096F3" />
                    <Text style={styles.appName}>My strength level</Text>
                    <Text style={styles.headerSubtitle}>Bắt đầu hành trình của bạn</Text>
                </View>

                {/* Form Card */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.title}>Đăng nhập</Text>
                        <Text style={styles.subtitle}>
                            Hãy đăng nhập vào tài khoản của bạn
                        </Text>

                        <TextInput
                            label="Email"
                            mode="outlined"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#0096F3"
                            left={<TextInput.Icon icon="email-outline" />}
                        />

                        <TextInput
                            label="Mật khẩu"
                            mode="outlined"
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                            secureTextEntry={!showPassword}
                            outlineColor="#E0E0E0"
                            activeOutlineColor="#0096F3"
                            left={<TextInput.Icon icon="lock-outline" />}
                            right={
                                <TextInput.Icon 
                                    icon={showPassword ? "eye-off" : "eye"}
                                    onPress={() => setShowPassword(!showPassword)}
                                />
                            }
                        />

                        {loginMutation.isError && (
                            <Surface style={styles.errorContainer}>
                                <MaterialCommunityIcons name="alert-circle" size={20} color="#FF3B30" />
                                <Text style={styles.errorText}>
                                    {(loginMutation.error as any)?.response?.data?.message || "Đăng nhập thất bại"}
                                </Text>
                            </Surface>
                        )}

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={loginMutation.isPending}
                            disabled={loginMutation.isPending}
                            style={styles.button}
                            labelStyle={styles.buttonLabel}
                        >
                            Đăng nhập
                        </Button>

                        <View style={styles.linkContainer}>
                            <Text style={styles.linkText}>Chưa có tài khoản? </Text>
                            <Link href="/(auth)/register" style={styles.link}>
                                Đăng ký ngay
                            </Link>
                        </View>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    scrollContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        paddingTop: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 30,
        textAlign: "center",
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#0096F3",
        marginTop: 10,
        letterSpacing: 1,
        textAlign: "center",
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
        textAlign: "center",
    },
    card: {
        borderRadius: 20,
        elevation: 4,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#1C1C1C",
        textAlign: "center",
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
    },
    input: {
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    button: {
        marginTop: 16,
        paddingVertical: 8,
        backgroundColor: "#0096F3",
        borderRadius: 12,
        elevation: 2,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 0.5,
    },
    errorContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFE5E5",
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        gap: 8,
    },
    errorText: {
        color: "#FF3B30",
        fontSize: 14,
        flex: 1,
    },
    linkContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 20,
        alignItems: "center",
    },
    linkText: {
        fontSize: 14,
        color: "#666",
    },
    link: {
        fontSize: 14,
        color: "#0096F3",
        fontWeight: "bold",
    },
});

import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Button, TextInput, HelperText } from "react-native-paper";
import { Link, router } from "expo-router";
import { useAuth } from "./hooks/useAuth";

export default function RegisterScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        name: ""
    });

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleNext = () => {
        // Reset errors
        setErrors({ email: "", password: "", confirmPassword: "", name: "" });

        // Validation
        let hasError = false;
        const newErrors = { email: "", password: "", confirmPassword: "", name: "" };

        if (!name) {
            newErrors.name = "Vui lòng nhập họ tên!";
            hasError = true;
        } else if (name.trim().length < 2) {
            newErrors.name = "Họ tên cần ít nhất 2 ký tự!";
            hasError = true;
        }

        if (!email) {
            newErrors.email = "Vui lòng nhập email!";
            hasError = true;
        } else if (!validateEmail(email)) {
            newErrors.email = "Email không hợp lệ!";
            hasError = true;
        } else if (email.length > 50) {
            newErrors.email = "Email có tối đa 50 ký tự!";
            hasError = true;
        }

        if (!password) {
            newErrors.password = "Vui lòng nhập mật khẩu!";
            hasError = true;
        } else if (password.length < 6) {
            newErrors.password = "Mật khẩu cần ít nhất 6 ký tự!";
            hasError = true;
        } else if (password.length > 20) {
            newErrors.password = "Mật khẩu có tối đa 20 ký tự!";
            hasError = true;
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu!";
            hasError = true;
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu không khớp!";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Chuyển sang trang 2 với dữ liệu
        router.push({
            pathname: "/(auth)/register-profile",
            params: { email, password, name }
        });
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>Đăng Ký Tài Khoản</Text>
                    <Text style={styles.subtitle}>
                        Bước 1/2: Thông tin cơ bản
                    </Text>

                    <TextInput
                        label="Họ và tên"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="words"
                        error={!!errors.name}
                    />
                    {errors.name ? (
                        <HelperText type="error" visible={!!errors.name}>
                            {errors.name}
                        </HelperText>
                    ) : null}

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        error={!!errors.email}
                    />
                    {errors.email ? (
                        <HelperText type="error" visible={!!errors.email}>
                            {errors.email}
                        </HelperText>
                    ) : null}

                    <TextInput
                        label="Mật khẩu"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={!showPassword}
                        error={!!errors.password}
                        right={
                            <TextInput.Icon 
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />
                    {errors.password ? (
                        <HelperText type="error" visible={!!errors.password}>
                            {errors.password}
                        </HelperText>
                    ) : null}

                    <TextInput
                        label="Xác nhận mật khẩu"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        style={styles.input}
                        secureTextEntry={!showConfirmPassword}
                        error={!!errors.confirmPassword}
                        right={
                            <TextInput.Icon 
                                icon={showConfirmPassword ? "eye-off" : "eye"}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            />
                        }
                    />
                    {errors.confirmPassword ? (
                        <HelperText type="error" visible={!!errors.confirmPassword}>
                            {errors.confirmPassword}
                        </HelperText>
                    ) : null}

                    <Button 
                        mode="contained"
                        onPress={handleNext}
                        style={styles.button}
                    >
                        Tiếp theo
                    </Button>

                    <View style={styles.linkContainer}>
                        <Text style={styles.linkText}>Đã có tài khoản? </Text>
                        <Link href="/(auth)/login" style={styles.link}>
                            Đăng nhập ngay
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        marginBottom: 8,
        textAlign: "center",
        color: "#1a1a1a",
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 30,
        textAlign: "center",
        color: "#666",
    },
    input: {
        marginBottom: 8,
    },
    button: {
        marginTop: 20,
        paddingVertical: 6,
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
        color: "#6200ee",
        fontWeight: "bold",
    },
});

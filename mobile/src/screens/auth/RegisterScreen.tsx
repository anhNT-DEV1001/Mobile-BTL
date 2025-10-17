import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Button, TextInput, HelperText, Card, ProgressBar } from "react-native-paper";
import { Link, router } from "expo-router";
import { useAuth } from "./hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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
                    {/* Header Section */}
                    <View style={styles.header}>
                        <MaterialCommunityIcons name="account-plus" size={50} color="#0096F3" />
                        <Text style={styles.appName}>VAI LON</Text>
                        <Text style={styles.headerSubtitle}>Hãy nhập thông tin của bạn</Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressRow}>
                            <Text style={styles.progressText}>Bước 1/2</Text>
                            <Text style={styles.progressPercentage}>50%</Text>
                        </View>
                        <ProgressBar progress={0.5} color="#0096F3" style={styles.progressBar} />
                    </View>

                    {/* Form Card */}
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.cardTitle}>Thông tin cơ bản</Text>

                            <TextInput
                                label="Họ và tên"
                                value={name}
                                onChangeText={setName}
                                mode="outlined"
                                style={styles.input}
                                autoCapitalize="words"
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0096F3"
                                error={!!errors.name}
                                left={<TextInput.Icon icon="account-outline" />}
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
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0096F3"
                                left={<TextInput.Icon icon="email-outline" />}
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
                                outlineColor="#E0E0E0"
                                activeOutlineColor="#0096F3"
                                left={<TextInput.Icon icon="lock-check-outline" />}
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
                                labelStyle={styles.buttonLabel}
                                icon="arrow-right"
                                contentStyle={styles.buttonContent}
                            >
                                Tiếp theo
                            </Button>

                            <View style={styles.linkContainer}>
                                <Text style={styles.linkText}>Đã có tài khoản? </Text>
                                <Link href="/(auth)/login" style={styles.link}>
                                    Đăng nhập ngay
                                </Link>
                            </View>
                        </Card.Content>
                    </Card>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    keyboardView: {
        flex: 1,
        backgroundColor: "#F8F9FA",
    },
    scrollView: {
        flexGrow: 1,
        paddingTop: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        alignItems: "center",
        marginBottom: 24,
    },
    appName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#0096F3",
        marginTop: 10,
        letterSpacing: 1,
    },
    headerSubtitle: {
        fontSize: 14,
        color: "#666",
        marginTop: 5,
    },
    progressContainer: {
        marginBottom: 20,
    },
    progressRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0096F3",
    },
    progressPercentage: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0096F3",
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
    },
    card: {
        borderRadius: 20,
        elevation: 4,
        backgroundColor: "#fff",
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#1C1C1C",
    },
    input: {
        marginBottom: 8,
        backgroundColor: "#fff",
    },
    button: {
        marginTop: 20,
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
    buttonContent: {
        flexDirection: "row-reverse",
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

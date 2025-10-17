import React, { useState } from "react";
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { Text, Button, TextInput, HelperText, SegmentedButtons } from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import { useAuth } from "./hooks/useAuth";

export default function RegisterProfileScreen() {
    const params = useLocalSearchParams<{ email: string; password: string; name: string }>();
    
    const [gender, setGender] = useState<"male" | "female">("male");
    const [dob, setDob] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [errors, setErrors] = useState({
        dob: "",
        height: "",
        weight: ""
    });

    const { register, registerMutation } = useAuth();

    const formatDateInput = (text: string) => {
        // Chỉ cho phép nhập số
        const cleaned = text.replace(/\D/g, '');
        let formatted = cleaned;
        
        // Tự động thêm dấu / khi nhập
        if (cleaned.length >= 3) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
        }
        if (cleaned.length >= 5) {
            formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4) + '/' + cleaned.slice(4, 8);
        }
        
        return formatted;
    };

    const validateDate = (dateString: string) => {
        // Format: DD/MM/YYYY
        const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!regex.test(dateString)) return false;
        
        const [, day, month, year] = dateString.match(regex) || [];
        const dayNum = parseInt(day);
        const monthNum = parseInt(month);
        const yearNum = parseInt(year);
        
        // Kiểm tra tháng hợp lệ
        if (monthNum < 1 || monthNum > 12) return false;
        
        // Kiểm tra năm hợp lệ (từ 1940 đến 2010)
        if (yearNum < 1940 || yearNum > 2010) return false;
        
        // Kiểm tra ngày hợp lệ theo tháng
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Kiểm tra năm nhuận
        const isLeapYear = (yearNum % 4 === 0 && yearNum % 100 !== 0) || yearNum % 400 === 0;
        if (isLeapYear) daysInMonth[1] = 29;
        
        if (dayNum < 1 || dayNum > daysInMonth[monthNum - 1]) return false;
        
        return true;
    };

    const handleDobChange = (text: string) => {
        const formatted = formatDateInput(text);
        setDob(formatted);
    };

    const handleRegister = () => {
        // Reset errors
        setErrors({ dob: "", height: "", weight: "" });

        // Validation
        let hasError = false;
        const newErrors = { dob: "", height: "", weight: "" };

        if (!dob) {
            newErrors.dob = "Vui lòng nhập ngày sinh!";
            hasError = true;
        } else if (!validateDate(dob)) {
            newErrors.dob = "Ngày sinh không hợp lệ! (DD/MM/YYYY, 1940-2010)";
            hasError = true;
        }

        if (!height) {
            newErrors.height = "Vui lòng nhập chiều cao!";
            hasError = true;
        } else if (isNaN(Number(height)) || Number(height) <= 0) {
            newErrors.height = "Chiều cao phải là số dương!";
            hasError = true;
        } else if (Number(height) < 100 || Number(height) > 250) {
            newErrors.height = "Chiều cao phải trong khoảng 100-250 cm!";
            hasError = true;
        }

        if (!weight) {
            newErrors.weight = "Vui lòng nhập cân nặng!";
            hasError = true;
        } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
            newErrors.weight = "Cân nặng phải là số dương!";
            hasError = true;
        } else if (Number(weight) < 30 || Number(weight) > 300) {
            newErrors.weight = "Cân nặng phải trong khoảng 30-300 kg!";
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Convert DD/MM/YYYY to ISO Date
        const [day, month, year] = dob.split('/');
        const dobDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

        // Log thông tin trước khi gửi
        console.log("📝 Đang tạo tài khoản với thông tin:");
        console.log("- Email:", params.email);
        console.log("- Họ tên:", params.name);
        console.log("- Giới tính:", gender);
        console.log("- Ngày sinh:", dob, "->", dobDate.toISOString());
        console.log("- Chiều cao:", height, "cm");
        console.log("- Cân nặng:", weight, "kg");

        // Call API với đầy đủ thông tin
        register({
            email: params.email,
            password: params.password,
            profile: {
                name: params.name,
                gender,
                dob: dobDate.toISOString(),
                height: Number(height),
                weight: Number(weight)
            }
        });
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardView}
        >
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    <Text style={styles.title}>Thông Tin Cá Nhân</Text>
                    <Text style={styles.subtitle}>
                        Bước 2/2: Hoàn thiện hồ sơ
                    </Text>

                    <Text style={styles.label}>Giới tính</Text>
                    <SegmentedButtons
                        value={gender}
                        onValueChange={(value) => setGender(value as "male" | "female")}
                        buttons={[
                            { value: 'male', label: 'Nam', icon: 'human-male' },
                            { value: 'female', label: 'Nữ', icon: 'human-female' }
                        ]}
                        style={styles.segmented}
                    />

                    <TextInput
                        label="Ngày sinh (DD/MM/YYYY)"
                        value={dob}
                        onChangeText={handleDobChange}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="31/12/1990"
                        error={!!errors.dob}
                        maxLength={10}
                        disabled={registerMutation.isPending}
                        right={<TextInput.Icon icon="calendar" />}
                    />
                    {errors.dob ? (
                        <HelperText type="error" visible={!!errors.dob}>
                            {errors.dob}
                        </HelperText>
                    ) : (
                        <HelperText type="info" visible={true}>
                            Ví dụ: 31/12/1990 (Năm từ 1940-2010)
                        </HelperText>
                    )}

                    <TextInput
                        label="Chiều cao (cm)"
                        value={height}
                        onChangeText={setHeight}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="170"
                        error={!!errors.height}
                        disabled={registerMutation.isPending}
                    />
                    {errors.height ? (
                        <HelperText type="error" visible={!!errors.height}>
                            {errors.height}
                        </HelperText>
                    ) : null}

                    <TextInput
                        label="Cân nặng (kg)"
                        value={weight}
                        onChangeText={setWeight}
                        mode="outlined"
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="65"
                        error={!!errors.weight}
                        disabled={registerMutation.isPending}
                    />
                    {errors.weight ? (
                        <HelperText type="error" visible={!!errors.weight}>
                            {errors.weight}
                        </HelperText>
                    ) : null}

                    <View style={styles.buttonContainer}>
                        <Button 
                            mode="outlined"
                            onPress={handleBack}
                            style={[styles.button, styles.backButton]}
                            disabled={registerMutation.isPending}
                        >
                            Quay lại
                        </Button>
                        <Button 
                            mode="contained"
                            onPress={handleRegister}
                            style={[styles.button, styles.registerButton]}
                            loading={registerMutation.isPending}
                            disabled={registerMutation.isPending}
                        >
                            Đăng ký
                        </Button>
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
    label: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
        color: "#333",
    },
    segmented: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 8,
    },
    buttonContainer: {
        flexDirection: "row",
        marginTop: 20,
        gap: 10,
    },
    button: {
        flex: 1,
        paddingVertical: 6,
    },
    backButton: {
        borderColor: "#6200ee",
    },
    registerButton: {
    },
});


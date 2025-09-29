import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";
import '../../global.css';

export default function LoginScreen() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // TODO: gọi API hoặc check Zustand store
        if (email === "admin" && password === "123") {
            router.replace("/(home)/home");
        } else {
            alert("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <View className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center px-6 w-full">
                <View className="w-full">
                    <Text className="text-2xl font-bold text-center mb-1">Log In</Text>
                    <Text className="text-center text-gray-600 mb-6">
                        Need an account?{' '}
                        <Text
                            className="text-blue-600 font-medium"
                            onPress={() => alert('Đi tới trang đăng ký sau')}
                        >
                            Register
                        </Text>
                    </Text>

                    <TextInput
                        className="border border-gray-300 w-full px-3 py-2 rounded mb-4"
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        className="border border-gray-300 w-full px-3 py-2 rounded mb-4"
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        className="bg-blue-600 px-4 py-3 rounded w-full items-center mb-3"
                        onPress={handleLogin}
                    >
                        <Text className="text-white font-semibold">Log In</Text>
                    </TouchableOpacity>

                    <Text
                        className="text-center text-blue-600"
                        onPress={() => alert('Chức năng quên mật khẩu sẽ sớm có')}
                    >
                        Forgot your password?
                    </Text>
                </View>
            </View>
        </View>
    );
}

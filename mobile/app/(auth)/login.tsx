import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // TODO: gọi API hoặc check Zustand store
        if (username === "admin" && password === "123") {
            router.replace("/(home)/home");
        } else {
            alert("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <View className="flex-1 items-center justify-center bg-white px-4">
            <Text className="text-2xl font-bold mb-6">Đăng nhập</Text>

            <TextInput
                className="border w-full px-3 py-2 rounded mb-4"
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />

            <TextInput
                className="border w-full px-3 py-2 rounded mb-4"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded w-full items-center"
                onPress={handleLogin}
            >
                <Text className="text-white font-semibold">Loginâdadadadaad</Text>
            </TouchableOpacity>
        </View>
    );
}

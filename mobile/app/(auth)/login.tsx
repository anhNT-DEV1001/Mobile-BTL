import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";
import '../../global.css';

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
        <View className="flex-1 items-center justify-center bg-teal-50- px-4">
            <Text className="text-2xl font-bold mb-6">Welcom to Strength Level</Text>

            <TextInput
                className="border w-full px-3 py-2 mb-4 rounded-sm "
                placeholder="Your email"
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
                <Text className="text-white font-semibold">Login</Text>
            </TouchableOpacity>

            {/* <Button className="bg-blue-500 px-4 py-2 rounded w-full items-center" title="Test button" /> */}

        </View>
    );
}

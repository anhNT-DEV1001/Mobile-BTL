import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
// import '../../global.css';

export default function HomeScreen() {
    const router = useRouter();

    return (
        <View className="flex-1 items-center justify-center bg-green-100">
            <Text className="text-xl font-bold mb-6">Tuấn Anh</Text>

            <TouchableOpacity
                className="bg-red-500 px-4 py-2 rounded"
                onPress={() => router.replace("/(auth)/login")}
            >
                <Text className="text-white font-semibold">CUT</Text>
            </TouchableOpacity>
        </View>
    );
}

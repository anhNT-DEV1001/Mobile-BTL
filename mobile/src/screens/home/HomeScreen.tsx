import { useCurrentUser } from "@/src/common/stores";
import { View, StyleSheet } from "react-native";
import { Button , Text } from "react-native-paper";
import { useAuth } from "../auth/hooks/useAuth";

export default function HomeScreen() {
    const currentUser = useCurrentUser();
    const {logout , logoutMutation} = useAuth();
    const handleLogut = async () =>{
        try {
            await logout();
            console.log("Logout successfully");
        } catch (error) {
            console.log("Lỗi đăng xuất: ", error);
        }
    }
    return (
        <View style={styles.container}>
        <Text style={styles.title}>🏠 Home Screen</Text>
        <Text style={styles.title}>Hello {currentUser?.profile? currentUser.profile.name : "Test"}</Text>
        <Button mode="contained" onPress={() => console.log("user : " + currentUser?.profile)}>
            Go somewhere
        </Button>
        <Button 
            mode="contained" 
            onPress={handleLogut} 
            loading={logoutMutation.isPending}
            disabled={logoutMutation.isPending}
        >
            Đăng xuất
        </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
});

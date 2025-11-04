import { useAuthStore } from "@/src/common/stores";
import { View, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from "react-native";
import { Text, Appbar, Card, useTheme, ActivityIndicator as PaperActivityIndicator } from "react-native-paper";
import { useMeasurement } from "./hooks/useMeasurement";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MeasurementScreen() {
    const { userBmi} = useMeasurement();
    const currentUser = useAuthStore((state) => state.user);
    const theme = useTheme(); // Sử dụng theme để lấy màu

    // Màu header từ HomeScreen
    const headerColor = '#003366';
    const backgroundColor = '#f5f5f5'; // Màu nền từ HomeScreen

    const handleBack = () => {
        router.back();
    };

    const renderBmiContent = () => {
        return (
            <>
                <Text style={styles.bmiValue}>{userBmi.data?.data?.bmi.toFixed(1)}</Text>
                <Text style={[styles.bmiMessage, { color: headerColor }]}>
                    {userBmi.data?.data?.message}
                </Text>
            </>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            {/* 1. Header (Appbar) để xử lý lẹm và thêm nút quay lại */}
            <Appbar.Header
                style={[styles.header, { backgroundColor: headerColor }]}
                statusBarHeight={0} // Tự xử lý padding top qua SafeAreaView
            >
                {/* 2. Nút mũi tên trở về */}
                <Appbar.BackAction onPress={handleBack} color="#ffffff" />
                <Appbar.Content title="Measurements" titleStyle={styles.headerTitle} />
            </Appbar.Header>

            {/* 3. Nội dung trong ScrollView để tránh tràn màn hình */}
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Thẻ thông tin cá nhân */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="account-details" size={22} color={headerColor} />
                            <Text style={styles.cardTitle}>Thông số của bạn</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Chiều cao</Text>
                            <Text style={styles.infoValue}>{currentUser?.profile?.height || 'N/A'} cm</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Cân nặng</Text>
                            <Text style={styles.infoValue}>{currentUser?.profile?.weight || 'N/A'} kg</Text>
                        </View>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Giới tính</Text>
                            <Text style={[styles.infoValue, styles.capitalize]}>{currentUser?.profile?.gender || 'N/A'}</Text>
                        </View>
                    </Card.Content>
                </Card>

                {/* Thẻ BMI */}
                <Card style={styles.card}>
                    <Card.Content style={styles.bmiCardContent}>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="scale-bathroom" size={22} color={headerColor} />
                            <Text style={styles.cardTitle}>Chỉ số BMI</Text>
                        </View>
                        {renderBmiContent()}
                    </Card.Content>
                </Card>

            </ScrollView>
        </View>
    );
}

// 4. Stylesheet để đồng bộ giao diện
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        // Không cần paddingTop, Appbar tự xử lý
    },
    headerTitle: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 20,
    },
    scrollContent: {
        padding: 15,
    },
    card: {
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: 'white', // Giống HomeScreen
        elevation: 2, // Thêm đổ bóng nhẹ
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    bmiCardContent: {
        alignItems: 'center', // Căn giữa nội dung thẻ BMI
    },
    loader: {
        marginVertical: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginVertical: 20,
    },
    bmiValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    bmiMessage: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 5,
        marginBottom: 10,
    },
});
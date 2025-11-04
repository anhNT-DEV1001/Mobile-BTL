import { useAuthStore } from "@/src/common/stores";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Appbar, Card, ActivityIndicator as PaperActivityIndicator } from "react-native-paper";
import { useMeasurement } from "./hooks/useMeasurement";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function MeasurementScreen() {
    // Lấy cả hai query từ hook
    const { userBmi, userEnergyNeeds } = useMeasurement();
    const currentUser = useAuthStore((state) => state.user);

    const headerColor = '#003366';
    const backgroundColor = '#f5f5f5';

    const handleBack = () => {
        router.back();
    };

    // Hàm render cho BMI
    const renderBmiContent = () => {
        if (userBmi.isLoading) {
            return <PaperActivityIndicator animating={true} color={headerColor} style={styles.loader} />;
        }
        if (userBmi.isError || !userBmi.data?.data) {
            return <Text style={styles.errorText}>Không thể tải dữ liệu BMI.</Text>;
        }
        return (
            <>
                <Text style={styles.bmiValue}>{userBmi.data.data.bmi.toFixed(1)}</Text>
                <Text style={[styles.bmiMessage, { color: headerColor }]}>
                    {userBmi.data.data.message}
                </Text>
            </>
        );
    };

    // HÀM RENDER MỚI CHO BMR VÀ TDEE
    const renderEnergyNeedsContent = () => {
        if (userEnergyNeeds.isLoading) {
            return <PaperActivityIndicator animating={true} color={headerColor} style={styles.loader} />;
        }
        if (userEnergyNeeds.isError || !userEnergyNeeds.data?.data) {
            return <Text style={styles.errorText}>Không thể tải nhu cầu năng lượng.</Text>;
        }

        const { bmr, energyNeeds } = userEnergyNeeds.data.data;

        return (
            <>
                <View style={styles.bmrContainer}>
                    <Text style={styles.bmrLabel}>BMR của bạn (Năng lượng nghỉ ngơi)</Text>
                    <Text style={styles.bmrValue}>{bmr} <Text style={styles.caloriesUnit}>calories/ngày</Text></Text>
                </View>

                {/* Danh sách TDEE (Nhu cầu năng lượng) */}
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ít vận động (Không tập)</Text>
                    <Text style={styles.infoValue}>{energyNeeds.sedentary} cal</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Vận động nhẹ (1-3 ngày/tuần)</Text>
                    <Text style={styles.infoValue}>{energyNeeds.lightlyActive} cal</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Vận động vừa (3-5 ngày/tuần)</Text>
                    <Text style={styles.infoValue}>{energyNeeds.moderatelyActive} cal</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Vận động nhiều (6-7 ngày/tuần)</Text>
                    <Text style={styles.infoValue}>{energyNeeds.veryActive} cal</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Vận động rất nhiều (2 lần/ngày)</Text>
                    <Text style={styles.infoValue}>{energyNeeds.extraActive} cal</Text>
                </View>
            </>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            {/* <Appbar.Header
                style={[styles.header, { backgroundColor: headerColor }]}
                statusBarHeight={0}
            >
                <Appbar.BackAction onPress={handleBack} color="#ffffff" />
                <Appbar.Content title="Đo lường" titleStyle={styles.headerTitle} />
            </Appbar.Header> */}

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

                {/* THẺ MỚI: BMR & NHU CẦU NĂNG LƯỢNG */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.cardHeader}>
                            <MaterialCommunityIcons name="fire" size={22} color={headerColor} />
                            <Text style={styles.cardTitle}>Nhu cầu Năng lượng</Text>
                        </View>
                        {renderEnergyNeedsContent()}
                    </Card.Content>
                </Card>

            </ScrollView>
        </View>
    );
}

// Cập nhật Stylesheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {},
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
        backgroundColor: 'white',
        elevation: 2,
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
        flex: 1, // Cho phép text xuống dòng nếu cần
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '600',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    bmiCardContent: {
        alignItems: 'center',
    },
    loader: {
        marginVertical: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginVertical: 20,
        textAlign: 'center',
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
    // Styles mới cho BMR
    bmrContainer: {
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        marginBottom: 10,
    },
    bmrLabel: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    bmrValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    caloriesUnit: {
        fontSize: 18,
        fontWeight: 'normal',
        color: '#666',
    },
});
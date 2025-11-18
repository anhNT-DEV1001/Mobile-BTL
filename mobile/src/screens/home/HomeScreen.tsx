import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { Button, Text, Avatar, Surface, Card, Chip, IconButton } from "react-native-paper";
import { useAuth } from "../auth/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "./hooks/useHome";
import { useAuthStore } from "@/src/common/stores";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

// Helper component for stat items
const StatItem = ({ icon, value, label, iconColor = "#003366", valueStyle = {} }: {
    icon: string;
    value: string | number;
    label: string;
    iconColor?: string;
    valueStyle?: any;
}) => (
    <View style={styles.statItem}>
        <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
        <Text variant="bodyMedium" style={[styles.statValue, valueStyle]}>
            {value}
        </Text>
        <Text variant="labelSmall" style={styles.statLabel}>
            {label}
        </Text>
    </View>
);

export default function HomeScreen() {
    const currentUser = useAuthStore((state) => state.user);
    const { workoutsQuery, userBmiLevel, isLoading, isLoadingBmi } = useHome();
    const { logout } = useAuth();
    const navigation = useNavigation();

    const handleLogout = async () => {
        try {
            await logout();
            console.log("Logout successfully");
        } catch (error) {
            console.log("Lỗi đăng xuất: ", error);
        }
    };

    // Convert BMI level to stars (1-4)
    // Normal weight (18.5-22.9) = 4 stars (best - healthy)
    // Underweight (<18.5) = 2 stars
    // Overweight (23-24.9) = 3 stars
    // Obesity level I (25-29.9) = 2 stars
    // Obesity level II (>=30) = 1 star
    const getStarCount = (level: string | undefined): number => {
        if (!level || typeof level !== 'string') return 0;
        const levelLower = level.toLowerCase();
        const levelMap: { [key: string]: number } = {
            'underweight': 2,
            'normal weight': 4,
            'overweight': 3,
            'obesity level i': 2,
            'obesity level ii': 1,
        };
        return levelMap[levelLower] || 0;
    };

    const getLevelLabel = (level: string | undefined): string => {
        if (!level || typeof level !== 'string') return 'Unknown';
        return level;
    };

    const getStarColor = (currentIndex: number, totalStars: number): string => {
        if (currentIndex <= totalStars) {
            if (totalStars === 4) return '#4CAF50'; // Green - Excellent
            if (totalStars === 3) return '#FFC107'; // Amber/Yellow - Good
            if (totalStars === 2) return '#FF9800'; // Orange - Warning
            if (totalStars === 1) return '#F44336'; // Red - Danger
            return '#CCCCCC';
        }
        return '#CCCCCC'; // Empty stars - gray
    };

    const getBmiIconColor = (stars: number): string => {
        if (stars === 4) return '#4CAF50'; 
        if (stars === 3) return '#FFC107'; 
        if (stars === 2) return '#FF9800'; 
        if (stars === 1) return '#F44336'; 
        return '#9E9E9E'; 
    };

    // Parse BMI data from response
    const bmiData = userBmiLevel.data?.data;
    const bmiMessage = bmiData?.message;
    
    const starCount = getStarCount(bmiMessage ?? undefined);
    const levelLabel = getLevelLabel(bmiMessage ?? undefined);

    // Calculate age from date of birth
    const calculateAge = (dob: Date | undefined): number => {
        if (!dob) return 0;
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const userAge = calculateAge(currentUser?.profile?.dob);
    const userHeight = currentUser?.profile?.height || 0;
    const userWeight = currentUser?.profile?.weight || 0;

    return (
        <ScrollView style={styles.scrollView}>
            {/* Header */}
            <Surface style={styles.header} elevation={2}>
                <Text variant="headlineSmall" style={styles.headerTitle}>
                    My strength level
                </Text>
                <IconButton
                    icon={() => (
                        <Avatar.Image 
                            size={40} 
                            source={require('../../../assets/images/icon.png')}
                        />
                    )}
                    onPress={handleLogout}
                />
            </Surface>

            {/* Profile Section */}
            <Card style={styles.card} elevation={1}>
                <Card.Content style={styles.profileContent}>
                    <Avatar.Image 
                        size={100}
                        source={require('../../../assets/images/icon.png')}
                    />
                    <Text variant="headlineMedium" style={styles.username}>
                        {currentUser?.profile?.name || "Unknown User"}
                    </Text>
                    <Chip mode="outlined" icon="human-male" style={styles.chip}>
                        Male
                    </Chip>
                    
                    {/* Personal Info Row */}
                    <View style={styles.statsRow}>
                        <StatItem icon="human-male-height" value={`${userHeight} cm`} label="HEIGHT" iconColor="#2196F3" />
                        <View style={styles.divider} />
                        <StatItem icon="weight-kilogram" value={`${userWeight} kg`} label="WEIGHT" iconColor="#FF5722" />
                        <View style={styles.divider} />
                        <StatItem icon="cake-variant" value={`${userAge} years`} label="AGE" iconColor="#9C27B0" />
                    </View>
                </Card.Content>
            </Card>

            {/* Stats & BMI Card */}
            <Card style={styles.card} elevation={1}>
                <Card.Content style={{ paddingVertical: 16 }}>
                    <View style={styles.statsRow}>
                        {/* Workouts Count */}
                        <Pressable 
                            style={({ pressed }) => [
                                styles.statItem,
                                pressed && { opacity: 0.6 }
                            ]}
                            onPress={() => router.push("/(app)/workout")}
                        >
                            <MaterialCommunityIcons name="dumbbell" size={28} color="#003366"/>
                            <Text variant="displaySmall" style={styles.statNumber}>
                                {isLoading ? '...' : workoutsQuery.data?.data?.length || 0}
                            </Text>
                            <Text variant="labelLarge" style={styles.statLabel}>
                                WORKOUTS
                            </Text>
                        </Pressable>

                        <View style={[styles.divider, { height: 80 }]} />

                        {/* BMI Index with Stars Rating */}
                        <Pressable
                            style={({ pressed }) => [
                                styles.statItem,
                                pressed && { opacity: 0.6 }
                            ]}
                            onPress={() => router.push("/(app)/measurement")}
                        >
                            <MaterialCommunityIcons 
                                name="scale-bathroom" 
                                size={28} 
                                color={getBmiIconColor(starCount)} 
                            />
                            <Text 
                                variant="displaySmall" 
                                style={[styles.statNumber, { color: getBmiIconColor(starCount) }]}
                            >
                                {isLoadingBmi ? '...' : bmiData?.bmi?.toFixed(1) || '0'}
                            </Text>
                            <View style={styles.starsContainer}>
                                {isLoadingBmi ? (
                                    <Text variant="bodyLarge">...</Text>
                                ) : (
                                    [...Array(4)].map((_, index) => (
                                        <MaterialCommunityIcons
                                            key={index}
                                            name={index < starCount ? "star" : "star-outline"}
                                            size={24}
                                            color={getStarColor(index + 1, starCount)}
                                        />
                                    ))
                                )}
                            </View>
                            <Text variant="labelLarge" style={styles.statLabel}>
                                {levelLabel.toUpperCase()}
                            </Text>
                        </Pressable>
                    </View>
                </Card.Content>
            </Card>

            {/* Menu Grid */}
            <View style={styles.menuContainer}>
                <Card onPress={() => router.push("/(app)/workout")} style={styles.menuCard} elevation={1}>
                    <Card.Content style={styles.menuItem}>
                        <MaterialCommunityIcons name="dumbbell" size={32} color="#003366" />
                        <Text variant="titleMedium" style={styles.menuText}>
                            Workouts
                        </Text>
                    </Card.Content>
                </Card>

                <Card 
                    style={styles.menuCard} 
                    elevation={1}
                    onPress={() => router.push("/(app)/exercise")}
                >
                    <Card.Content style={styles.menuItem}>
                        <MaterialCommunityIcons name="clipboard-list" size={32} color="#003366" />
                        <Text variant="titleMedium" style={styles.menuText}>
                            Exercises
                        </Text>
                    </Card.Content>
                </Card>

                <Card onPress={() => router.push("/(app)/measurement")} style={styles.menuCard} elevation={1}>
                    <Card.Content style={styles.menuItem}>
                        <MaterialCommunityIcons name="tape-measure" size={32} color="#003366" />
                        <Text variant="titleMedium" style={styles.menuText}>
                            Measurements
                        </Text>
                    </Card.Content>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#003366',
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    // Reusable Card Style
    card: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    profileContent: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 12,
    },
    username: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    chip: {
        marginTop: 8,
        marginBottom: 12,
    },
    // Reusable Stats Row (for all stats/info rows)
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 8,
    },
    // Reusable Stat Item
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    statNumber: {
        fontWeight: 'bold',
        color: '#003366',
    },
    statValue: {
        fontWeight: '600',
        color: '#333',
        fontSize: 15,
        marginTop: 2,
    },
    statLabel: {
        color: '#666',
        marginTop: 4,
        letterSpacing: 0.5,
        fontSize: 10,
    },
    // Reusable Divider
    divider: {
        width: 1,
        height: 50,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 8,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginVertical: 4,
    },
    menuContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 16,
        paddingBottom: 16,
        justifyContent: 'space-between',
    },
    menuCard: {
        width: '48%',
        marginBottom: 12,
        backgroundColor: 'white',
    },
    menuItem: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    menuText: {
        marginTop: 12,
        color: '#003366',
        fontWeight: '600',
    },
});

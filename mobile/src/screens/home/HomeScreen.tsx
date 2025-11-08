import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, Avatar, Surface, Card, Chip, IconButton } from "react-native-paper";
import { useAuth } from "../auth/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "./hooks/useHome";
import { useAuthStore } from "@/src/common/stores";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
    const currentUser = useAuthStore((state) => state.user);
    const { workoutsQuery, userWorkoutLevel, isLoading, isLoadingLevel } = useHome();
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

    // Convert workout level to stars (1-4)
    const getStarCount = (level: string | undefined): number => {
        if (!level) return 0;
        const levelMap: { [key: string]: number } = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3,
            'gym lord': 4,
        };
        return levelMap[level.toLowerCase()] || 0;
    };

    const getLevelLabel = (level: string | undefined): string => {
        if (!level) return 'Unknown';
        const labelMap: { [key: string]: string } = {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate',
            'advanced': 'Advanced',
            'gym lord': 'Gym Lord',
        };
        return labelMap[level.toLowerCase()] || 'Unknown';
    };

    const starCount = getStarCount(userWorkoutLevel.data?.data);
    const levelLabel = getLevelLabel(userWorkoutLevel.data?.data);

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
            <Card style={styles.profileCard} elevation={1}>
                <Card.Content style={styles.profileContent}>
                    <Avatar.Image 
                        size={100}
                        source={require('../../../assets/images/icon.png')}
                    />
                    <Text variant="headlineMedium" style={styles.username}>
                        {currentUser?.profile?.name || "Unknown User"}
                    </Text>
                    <Text style={styles.statLabel}>WORKOUTS</Text>
                </View>
            </View>

            <Surface style={styles.powerSection} elevation={1}>
                <Text style={styles.powerTitle}>Power Level</Text>
                <Button mode="contained" style={styles.unknownButton}>
                    {userWorkoutLevel.data?.data || ""}
                </Button>
            </Surface>

            <View style={styles.menuGrid}>
                <TouchableOpacity 
                style={styles.menuItem}
                onPress={() => router.push('/workout')}
                >
                    <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
                    <Text style={styles.menuText}>Workouts</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => router.push('/exercise')}
                    >
                        Male
                    </Chip>
                </Card.Content>
            </Card>

            {/* Stats & Power Level Card */}
            <Card style={styles.statsCard} elevation={1}>
                <Card.Content style={styles.statsContent}>
                    <View style={styles.statsRow}>
                        {/* Workouts Count */}
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="dumbbell" size={28} color="#003366" />
                            <Text variant="displaySmall" style={styles.statNumber}>
                                {isLoading ? '...' : workoutsQuery.data?.data?.length || 0}
                            </Text>
                            <Text variant="labelLarge" style={styles.statLabel}>
                                WORKOUTS
                            </Text>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Power Level with Stars */}
                        <View style={styles.statItem}>
                            <MaterialCommunityIcons name="trophy" size={28} color="#FFD700" />
                            <View style={styles.starsContainer}>
                                {isLoadingLevel ? (
                                    <Text variant="bodyLarge">...</Text>
                                ) : (
                                    [...Array(4)].map((_, index) => (
                                        <MaterialCommunityIcons
                                            key={index}
                                            name={index < starCount ? "star" : "star-outline"}
                                            size={24}
                                            color={index < starCount ? "#FFD700" : "#CCCCCC"}
                                        />
                                    ))
                                )}
                            </View>
                            <Text variant="labelLarge" style={styles.statLabel}>
                                {levelLabel.toUpperCase()}
                            </Text>
                        </View>
                    </View>
                </Card.Content>
            </Card>

            {/* Menu Grid */}
            <View style={styles.menuContainer}>
                <Card style={styles.menuCard} elevation={1}>
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
                    onPress={() => navigation.navigate("exercise" as never)}
                >
                    <Card.Content style={styles.menuItem}>
                        <MaterialCommunityIcons name="clipboard-list" size={32} color="#003366" />
                        <Text variant="titleMedium" style={styles.menuText}>
                            Exercises
                        </Text>
                    </Card.Content>
                </Card>

                <Card style={styles.menuCard} elevation={1}>
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
    profileCard: {
        margin: 16,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    profileContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    username: {
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 12,
    },
    genderChip: {
        marginTop: 8,
    },
    statsCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        backgroundColor: 'white',
    },
    statsContent: {
        paddingVertical: 20,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        gap: 8,
    },
    statNumber: {
        fontWeight: 'bold',
        color: '#003366',
    },
    statLabel: {
        color: '#666',
        marginTop: 4,
        letterSpacing: 1,
        fontSize: 11,
    },
    divider: {
        width: 1,
        height: 80,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 12,
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

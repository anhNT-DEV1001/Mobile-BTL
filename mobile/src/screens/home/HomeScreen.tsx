import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Button, Text, Avatar, Surface, ActivityIndicator } from "react-native-paper";
import { useAuth } from "../auth/hooks/useAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useHome } from "./hooks/useHome";
import { useAuthStore } from "@/src/common/stores";

export default function HomeScreen() {
    const currentUser = useAuthStore((state) => state.user);
    const { workoutsQuery , userWorkoutLevel } = useHome();
    const {logout , logoutMutation} = useAuth();
    const handleLogout = async () => {
        try {
            await logout();
            console.log("Logout successfully");
        } catch (error) {
            console.log("Lỗi đăng xuất: ", error);
        }
    }
    return (
        <ScrollView style={styles.scrollView}>
            <Surface style={styles.header} elevation={2}>
                <Text style={styles.headerTitle}>VAI LON</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Avatar.Image 
                        size={50} 
                        source={require('../../../assets/images/icon.png')}
                    />
                </TouchableOpacity>
            </Surface>

            <View style={styles.profileSection}>
                <Avatar.Image 
                    size={100}
                    source={require('../../../assets/images/icon.png')}
                    style={styles.profileAvatar}
                />
                <Text style={styles.username}>{currentUser?.profile?.name || "Unknown User"}</Text>
                {/* <Text style={styles.userId}>{currentUser?.profile?.id || "ID Not Available"}</Text> */}
                <Button mode="outlined" style={styles.genderButton}>
                    Male
                </Button>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {workoutsQuery.data?.data?.length || 0}
                    </Text>
                    <Text style={styles.statLabel}>WORKOUTS</Text>
                </View>
                {/* <View style={styles.statItem}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>FOLLOWERS</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>0</Text>
                    <Text style={styles.statLabel}>FOLLOWING</Text>
                </View> */}
            </View>

            <Surface style={styles.powerSection} elevation={1}>
                <Text style={styles.powerTitle}>Power Level</Text>
                <Button mode="contained" style={styles.unknownButton}>
                    {userWorkoutLevel.data?.data || ""}
                </Button>
            </Surface>

            <View style={styles.menuGrid}>
                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="dumbbell" size={24} color="black" />
                    <Text style={styles.menuText}>Workouts</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="clipboard-list" size={24} color="black" />
                    <Text style={styles.menuText}>Exercises</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="scale-bathroom" size={24} color="black" />
                    <Text style={styles.menuText}>Bodyweight</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="tape-measure" size={24} color="black" />
                    <Text style={styles.menuText}>Measurements</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.menuItem}>
                    <MaterialCommunityIcons name="import" size={24} color="black" />
                    <Text style={styles.menuText}>Import</Text>
                </TouchableOpacity> */}
            </View>

            {/* <Surface style={styles.discordSection} elevation={1}>
                <MaterialCommunityIcons name="message-outline" size={40} color="white" />
                <Text style={styles.discordTitle}>Join our Discord Server</Text>
                <Text style={styles.discordDescription}>
                    Get feedback on your goals, routines and progress photos by connecting with our community. Introduce yourself today!
                </Text>
                <Button 
                    mode="outlined" 
                    style={styles.discordButton}
                    textColor="white"
                >
                    Join us on Discord
                </Button>
            </Surface> */}
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
        padding: 16,
        backgroundColor: '#003366',
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileSection: {
        alignItems: 'center',
        padding: 20,
    },
    profileAvatar: {
        marginBottom: 10,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userId: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    genderButton: {
        borderRadius: 20,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: 'white',
        marginHorizontal: 10,
        borderRadius: 10,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    statLabel: {
        color: '#666',
        fontSize: 12,
    },
    powerSection: {
        margin: 10,
        padding: 15,
        borderRadius: 10,
    },
    powerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    unknownButton: {
        backgroundColor: '#0099ff',
    },
    menuGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-between',
    },
    menuItem: {
        width: '48%',
        backgroundColor: 'white',
        padding: 20,
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    menuText: {
        marginTop: 10,
        fontSize: 16,
    },
    discordSection: {
        margin: 10,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#7289DA',
        alignItems: 'center',
    },
    discordTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    discordDescription: {
        color: 'white',
        textAlign: 'center',
        marginBottom: 15,
    },
    discordButton: {
        borderColor: 'white',
        width: '100%',
    },
});

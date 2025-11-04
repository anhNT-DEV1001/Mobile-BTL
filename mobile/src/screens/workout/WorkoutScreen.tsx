import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function WorkoutScreen() {
  return (
    <>
      <ScrollView style= {styles.scrollView}>
        <Text>Workout screens</Text>
      </ScrollView>
    </>
  )
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

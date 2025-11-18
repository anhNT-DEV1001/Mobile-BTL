import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Button, FAB, ActivityIndicator, IconButton, Chip } from 'react-native-paper';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useWorkout, useWorkoutExercises, useDeleteUserExercise } from '@/src/screens/workout/hooks/useWorkout';
import { useState } from 'react';
import type { UserExercise, ExerciseSet } from '@/src/screens/workout/services/workout.service';

export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: workout, isLoading: workoutLoading } = useWorkout(id || '');
    const { data: exercises = [], isLoading: exercisesLoading } = useWorkoutExercises(id || '');
    const deleteExerciseMutation = useDeleteUserExercise();
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);

    const isLoading = workoutLoading || exercisesLoading;

    if (isLoading || !workout) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#003366" />
            </View>
        );
    }

    const workoutData = workout;
    const exercisesData = exercises;
    const workoutDate = new Date(workoutData.date);

    const handleAddExercise = () => {
        // TODO: Navigate to add exercise screen
        Alert.alert('Add Exercise', 'This feature will be implemented next');
    };

    const handleDeleteExercise = (exerciseId: string) => {
        Alert.alert(
            'Delete Exercise',
            'Are you sure you want to delete this exercise?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => deleteExerciseMutation.mutate(exerciseId),
                },
            ]
        );
    };

    const toggleExercise = (exerciseId: string) => {
        setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: workoutData.name,
                    headerRight: () => (
                        <IconButton
                            icon="pencil"
                            onPress={() => {
                                // TODO: Edit workout
                                Alert.alert('Edit Workout', 'This feature will be implemented');
                            }}
                        />
                    ),
                }}
            />

            <View style={styles.container}>
                <ScrollView style={styles.scrollView}>
                    {/* Workout Info */}
                    <View style={styles.infoCard}>
                        <Text style={styles.date}>
                            {workoutDate.toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                            })}
                        </Text>
                        {workoutData.note && (
                            <Text style={styles.note}>{workoutData.note}</Text>
                        )}

                        <View style={styles.statsRow}>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>{exercisesData.length}</Text>
                                <Text style={styles.statLabel}>Exercises</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>
                                    {exercisesData.reduce((sum: number, ex: UserExercise) => sum + ex.sets.length, 0)}
                                </Text>
                                <Text style={styles.statLabel}>Sets</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Text style={styles.statNumber}>
                                    {exercisesData
                                        .reduce((sum: number, ex: UserExercise) => sum + (ex.totalVolume || 0), 0)
                                        .toFixed(0)}
                                </Text>
                                <Text style={styles.statLabel}>Volume (kg)</Text>
                            </View>
                        </View>
                    </View>

                    {/* Exercises List */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Exercises</Text>

                        {exercisesData.length === 0 ? (
                            <View style={styles.emptyContainer}>
                                <Text style={styles.emptyText}>No exercises yet</Text>
                                <Button
                                    mode="outlined"
                                    onPress={handleAddExercise}
                                    style={styles.emptyButton}
                                >
                                    Add Your First Exercise
                                </Button>
                            </View>
                        ) : (
                            exercisesData.map((exercise: UserExercise, index: number) => (
                                <View key={exercise.id} style={styles.exerciseCard}>
                                    <View style={styles.exerciseHeader}>
                                        <View style={styles.exerciseHeaderLeft}>
                                            <Text style={styles.exerciseName}>
                                                {exercise.exercise?.name || 'Exercise'}
                                            </Text>
                                            <Text style={styles.exerciseInfo}>
                                                {exercise.sets.length} sets • {exercise.totalVolume?.toFixed(0) || 0} kg
                                            </Text>
                                        </View>
                                        <View style={styles.exerciseHeaderRight}>
                                            <IconButton
                                                icon={expandedExercise === exercise.id ? 'chevron-up' : 'chevron-down'}
                                                size={20}
                                                onPress={() => toggleExercise(exercise.id)}
                                            />
                                            <IconButton
                                                icon="delete"
                                                size={20}
                                                onPress={() => handleDeleteExercise(exercise.id)}
                                            />
                                        </View>
                                    </View>

                                    {/* Exercise Sets */}
                                    {expandedExercise === exercise.id && (
                                        <View style={styles.setsContainer}>
                                            <View style={styles.setsHeader}>
                                                <Text style={styles.setsHeaderText}>Set</Text>
                                                <Text style={styles.setsHeaderText}>Weight</Text>
                                                <Text style={styles.setsHeaderText}>Reps</Text>
                                                <Text style={styles.setsHeaderText}>Level</Text>
                                            </View>
                                            {exercise.sets.map((set: ExerciseSet, setIndex: number) => (
                                                <View key={setIndex} style={styles.setRow}>
                                                    <Text style={styles.setNumber}>{setIndex + 1}</Text>
                                                    <Text style={styles.setValue}>
                                                        {set.weight ? `${set.weight} kg` : '-'}
                                                    </Text>
                                                    <Text style={styles.setValue}>{set.reps}</Text>
                                                    <View style={styles.levelContainer}>
                                                        {set.level ? (
                                                            <Chip
                                                                compact
                                                                style={[
                                                                    styles.levelChip,
                                                                    getLevelStyle(set.level),
                                                                ]}
                                                                textStyle={styles.levelChipText}
                                                            >
                                                                {set.level.substring(0, 3).toUpperCase()}
                                                            </Chip>
                                                        ) : (
                                                            <Text style={styles.setValue}>-</Text>
                                                        )}
                                                    </View>
                                                </View>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            ))
                        )}
                    </View>
                </ScrollView>

                {/* Add Exercise FAB */}
                <FAB
                    icon="plus"
                    label="Add Exercise"
                    style={styles.fab}
                    onPress={handleAddExercise}
                />
            </View>
        </>
    );
}

const getLevelStyle = (level: string) => {
    const lowerLevel = level.toLowerCase();
    switch (lowerLevel) {
        case 'beginner':
            return { backgroundColor: '#e3f2fd' };
        case 'novice':
            return { backgroundColor: '#fff3e0' };
        case 'intermediate':
            return { backgroundColor: '#e8f5e9' };
        case 'advanced':
            return { backgroundColor: '#fce4ec' };
        case 'gymlord':
        case 'gym lord':
            return { backgroundColor: '#f3e5f5' };
        default:
            return { backgroundColor: '#f5f5f5' };
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    infoCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    date: {
        fontSize: 16,
        color: '#757575',
        marginBottom: 8,
    },
    note: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    statBox: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1976d2',
    },
    statLabel: {
        fontSize: 12,
        color: '#757575',
        marginTop: 4,
    },
    section: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#212121',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        fontSize: 16,
        color: '#9e9e9e',
        marginBottom: 16,
    },
    emptyButton: {
        marginTop: 8,
        borderColor: '#1976d2',
    },
    exerciseCard: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 12,
        overflow: 'hidden',
        backgroundColor: '#ffffff',
    },
    exerciseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fafafa',
    },
    exerciseHeaderLeft: {
        flex: 1,
    },
    exerciseHeaderRight: {
        flexDirection: 'row',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#212121',
        marginBottom: 4,
    },
    exerciseInfo: {
        fontSize: 13,
        color: '#757575',
    },
    setsContainer: {
        padding: 12,
        backgroundColor: '#ffffff',
    },
    setsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 8,
    },
    setsHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#757575',
        flex: 1,
        textAlign: 'center',
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#212121',
        flex: 1,
        textAlign: 'center',
    },
    setValue: {
        fontSize: 14,
        color: '#424242',
        flex: 1,
        textAlign: 'center',
    },
    levelContainer: {
        flex: 1,
        alignItems: 'center',
    },
    levelChip: {
        height: 24,
    },
    levelChipText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#212121',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#1976d2',
    },
});

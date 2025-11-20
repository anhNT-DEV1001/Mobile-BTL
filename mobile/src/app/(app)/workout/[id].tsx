import { View, ScrollView, StyleSheet, Alert, TextInput as RNTextInput, TouchableOpacity, FlatList } from 'react-native';
import { Text, Button, FAB, ActivityIndicator, IconButton, Chip, Portal, Modal, TextInput, Searchbar, Checkbox } from 'react-native-paper';
import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useWorkout, useWorkoutExercises, useDeleteUserExercise, useUpdateUserExercise, useCalculateStrengthLevel, useCreateUserExercise } from '@/src/screens/workout/hooks/useWorkout';
import { useExercises } from '@/src/screens/exercise/hooks/useExercise';
import { useState, useEffect } from 'react';
import type { UserExercise, ExerciseSet } from '@/src/screens/workout/services/workout.service';
import type { Exercise } from '@/src/screens/exercise/services/exercise.service';

// Helper function to check if exercise requires weight
const isWeightRequired = (equipment?: string): boolean => {
    if (!equipment) return true; // Default to requiring weight if unknown
    const noWeightEquipment = ['body only', 'foam roll', 'bands', 'other'];
    return !noWeightEquipment.includes(equipment.toLowerCase());
};

export default function WorkoutDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { data: workout, isLoading: workoutLoading } = useWorkout(id || '');
    const { data: exercises = [], isLoading: exercisesLoading } = useWorkoutExercises(id || '');
    const deleteExerciseMutation = useDeleteUserExercise();
    const updateExerciseMutation = useUpdateUserExercise();
    const createExerciseMutation = useCreateUserExercise();
    const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState<UserExercise | null>(null);
    const [editingSets, setEditingSets] = useState<ExerciseSet[]>([]);

    // Add exercise states
    const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);
    const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
    const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
    const [selectedExerciseForAdd, setSelectedExerciseForAdd] = useState<Exercise | null>(null);
    const [newExerciseSets, setNewExerciseSets] = useState<ExerciseSet[]>([{ reps: 10, weight: undefined, level: null }]);
    const [newExerciseNote, setNewExerciseNote] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Pagination states for exercise catalog
    const [exercisePage, setExercisePage] = useState(1);
    const [allExercises, setAllExercises] = useState<Exercise[]>([]);
    const [hasMoreExercises, setHasMoreExercises] = useState(true);
    
    const { data: exerciseCatalog, isLoading: exerciseCatalogLoading, isFetching: exerciseCatalogFetching } = useExercises({ 
        page: exercisePage, 
        limit: 50,
        q: searchQuery 
    });

    // Load and append exercises when catalog changes
    useEffect(() => {
        if (exerciseCatalog?.items) {
            if (exercisePage === 1) {
                // First page or search query changed - replace all
                setAllExercises(exerciseCatalog.items);
            } else {
                // Append to existing exercises
                setAllExercises(prev => {
                    const existingIds = new Set(prev.map(ex => ex._id || ex.id));
                    const newItems = exerciseCatalog.items.filter(
                        ex => !existingIds.has(ex._id || ex.id)
                    );
                    return [...prev, ...newItems];
                });
            }
            
            // Check if there are more exercises to load
            const { items, total } = exerciseCatalog;
            setHasMoreExercises(allExercises.length + items.length < total);
        }
    }, [exerciseCatalog]);

    // Reset pagination when search query changes
    useEffect(() => {
        setExercisePage(1);
        setAllExercises([]);
        setHasMoreExercises(true);
    }, [searchQuery]);

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
        setSearchQuery('');
        setSelectedExerciseId(null);
        setExercisePage(1);
        setAllExercises([]);
        setHasMoreExercises(true);
        setShowExerciseSelectModal(true);
    };

    const handleLoadMoreExercises = () => {
        if (!exerciseCatalogFetching && hasMoreExercises) {
            setExercisePage(prev => prev + 1);
        }
    };

    const handleSelectExerciseForAdd = (exercise: Exercise) => {
        setSelectedExerciseId(exercise._id || exercise.id);
        setSelectedExerciseForAdd(exercise);
        setNewExerciseSets([{ reps: 10, weight: undefined, level: null }]);
        setNewExerciseNote('');
        setShowExerciseSelectModal(false);
        setShowAddExerciseModal(true);
    };

    const handleConfirmAddExercise = async () => {
        if (!selectedExerciseId) {
            Alert.alert('Error', 'Please select an exercise.');
            return;
        }

        const cleanedSets = newExerciseSets
            .filter((s) => s.reps && s.reps > 0)
            .map((s) => ({ reps: s.reps, weight: s.weight }));

        if (!cleanedSets.length) {
            Alert.alert('Error', 'Please add at least one set with reps.');
            return;
        }

        try {
            await createExerciseMutation.mutateAsync({
                exercise: selectedExerciseId,
                workout: workoutData.id,
                sets: cleanedSets,
                note: newExerciseNote || undefined,
            });
            setShowAddExerciseModal(false);
            Alert.alert('Success', 'Exercise added successfully!');
        } catch (error) {
            console.error('Failed to add exercise:', error);
            Alert.alert('Error', 'Failed to add exercise');
        }
    };

    const handleAddNewSet = () => {
        setNewExerciseSets([...newExerciseSets, { reps: 10, weight: undefined, level: null }]);
    };

    const handleRemoveNewSet = (index: number) => {
        const newSets = newExerciseSets.filter((_, i) => i !== index);
        setNewExerciseSets(newSets);
    };

    const handleUpdateNewSet = (index: number, field: keyof ExerciseSet, value: any) => {
        const newSets = [...newExerciseSets];
        newSets[index] = { ...newSets[index], [field]: value };
        setNewExerciseSets(newSets);
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

    const handleEditExercise = (exercise: UserExercise) => {
        setSelectedExercise(exercise);
        setEditingSets([...exercise.sets]);
        setShowEditModal(true);
    };

    const handleSaveExercise = async () => {
        if (!selectedExercise) return;

        try {
            // API only accepts reps and weight, backend calculates level automatically
            const setsData = editingSets.map(set => ({
                reps: set.reps,
                weight: set.weight,
            }));

            await updateExerciseMutation.mutateAsync({
                id: selectedExercise.id,
                data: {
                    sets: setsData,
                },
            });
            setShowEditModal(false);
            Alert.alert('Success', 'Exercise updated successfully!');
        } catch (error) {
            Alert.alert('Error', 'Failed to update exercise');
        }
    };

    const handleAddSet = () => {
        setEditingSets([...editingSets, { reps: 0, weight: undefined, level: null }]);
    };

    const handleRemoveSet = (index: number) => {
        const newSets = editingSets.filter((_, i) => i !== index);
        setEditingSets(newSets);
    };

    const handleUpdateSet = (index: number, field: keyof ExerciseSet, value: any) => {
        const newSets = [...editingSets];
        newSets[index] = { ...newSets[index], [field]: value };
        setEditingSets(newSets);
    };

    const toggleExercise = (exerciseId: string) => {
        setExpandedExercise(expandedExercise === exerciseId ? null : exerciseId);
    };

    // Component to display set row with auto-calculated level
    const SetRowDisplay = ({ set, setIndex, showWeight = true }: { set: ExerciseSet; setIndex: number; showWeight?: boolean }) => {
        const [calculatedLevel, setCalculatedLevel] = useState<string | null>(set.level || null);
        const calculateLevelMutation = useCalculateStrengthLevel();

        useEffect(() => {
            // Only calculate if level is missing but weight and reps exist and showWeight is true
            if (showWeight && !set.level && set.weight && set.reps && set.weight > 0 && set.reps > 0) {
                calculateLevelMutation.mutateAsync({
                    weight: set.weight,
                    reps: set.reps,
                }).then((result) => {
                    setCalculatedLevel(result.level || null);
                }).catch((error) => {
                    console.error('Failed to calculate level:', error);
                });
            }
        }, [set.weight, set.reps, set.level, showWeight]);

        const displayLevel = calculatedLevel || set.level;

        return (
            <View style={styles.setRow}>
                <Text style={styles.setNumber}>{setIndex + 1}</Text>
                {showWeight && (
                    <Text style={styles.setValue}>
                        {set.weight ? `${set.weight} kg` : '-'}
                    </Text>
                )}
                <Text style={styles.setValue}>{set.reps}</Text>
                {showWeight && (
                    <View style={styles.levelContainer}>
                        {displayLevel ? (
                            <Chip
                                style={[
                                    styles.levelChip,
                                    getLevelStyle(displayLevel),
                                ]}
                                textStyle={styles.levelChipText}
                            >
                                {displayLevel.toUpperCase()}
                            </Chip>
                        ) : (
                            <Text style={styles.setValue}>-</Text>
                        )}
                    </View>
                )}
            </View>
        );
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: workoutData.name,
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
                                            <Text style={styles.exerciseInfoText}>
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
                                                icon="pencil"
                                                size={20}
                                                onPress={() => handleEditExercise(exercise)}
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
                                                <Text style={[styles.setsHeaderText, styles.setNumberHeader]}>Set</Text>
                                                {isWeightRequired(exercise.exercise?.equipment) && (
                                                    <Text style={[styles.setsHeaderText, styles.setValueHeader]}>Weight</Text>
                                                )}
                                                <Text style={[styles.setsHeaderText, styles.setValueHeader]}>Reps</Text>
                                                {isWeightRequired(exercise.exercise?.equipment) && (
                                                    <Text style={[styles.setsHeaderText, styles.levelHeader]}>Level</Text>
                                                )}
                                            </View>
                                            {exercise.sets.map((set: ExerciseSet, setIndex: number) => (
                                                <SetRowDisplay 
                                                    key={setIndex} 
                                                    set={set} 
                                                    setIndex={setIndex}
                                                    showWeight={isWeightRequired(exercise.exercise?.equipment)}
                                                />
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

                {/* Exercise Selection Modal */}
                <Portal>
                    <Modal
                        visible={showExerciseSelectModal}
                        onDismiss={() => setShowExerciseSelectModal(false)}
                        contentContainerStyle={styles.exerciseModalContainer}
                    >
                        <Text style={styles.modalTitle}>Select Exercise</Text>

                        <Searchbar
                            placeholder="Search exercises..."
                            onChangeText={setSearchQuery}
                            value={searchQuery}
                            style={styles.searchbar}
                        />

                        {exerciseCatalogLoading && exercisePage === 1 ? (
                            <ActivityIndicator size="large" color="#1976d2" style={styles.loading} />
                        ) : (
                            <FlatList
                                data={allExercises}
                                keyExtractor={(item) => item._id || item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.exerciseItem}
                                        onPress={() => handleSelectExerciseForAdd(item)}
                                    >
                                        <View style={styles.exerciseInfo}>
                                            <Text style={styles.exerciseItemName}>{item.name}</Text>
                                            {item.category && (
                                                <Text style={styles.exerciseItemCategory}>
                                                    {item.category}
                                                </Text>
                                            )}
                                        </View>
                                        <IconButton icon="chevron-right" size={20} />
                                    </TouchableOpacity>
                                )}
                                style={styles.exerciseList}
                                onEndReached={handleLoadMoreExercises}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={
                                    exerciseCatalogFetching && exercisePage > 1 ? (
                                        <ActivityIndicator size="small" color="#1976d2" style={styles.loadingMore} />
                                    ) : null
                                }
                                ListEmptyComponent={
                                    !exerciseCatalogLoading ? (
                                        <Text style={styles.exerciseCatalogEmptyText}>
                                            {searchQuery ? 'No exercises found' : 'No exercises available'}
                                        </Text>
                                    ) : null
                                }
                            />
                        )}

                        <Button
                            mode="outlined"
                            onPress={() => setShowExerciseSelectModal(false)}
                            style={styles.cancelButton}
                        >
                            Cancel
                        </Button>
                    </Modal>

                    {/* Add Exercise Modal (with sets input) */}
                    <Modal
                        visible={showAddExerciseModal}
                        onDismiss={() => setShowAddExerciseModal(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <ScrollView>
                            <Text style={styles.modalTitle}>
                                Add Exercise: {selectedExerciseForAdd?.name}
                            </Text>

                            {selectedExerciseForAdd?.equipment && (
                                <Text style={styles.equipmentNote}>
                                    Equipment: {selectedExerciseForAdd.equipment}
                                    {!isWeightRequired(selectedExerciseForAdd.equipment) && ' (No weight required)'}
                                </Text>
                            )}

                            {/* Sets List */}
                            <View style={styles.setsEditContainer}>
                                <View style={styles.setsEditHeader}>
                                    <Text style={[styles.setsEditHeaderText, { flex: 0.5 }]}>Set</Text>
                                    <Text style={[styles.setsEditHeaderText, { flex: 1 }]}>Reps</Text>
                                    {isWeightRequired(selectedExerciseForAdd?.equipment) && (
                                        <Text style={[styles.setsEditHeaderText, { flex: 1 }]}>Weight (kg)</Text>
                                    )}
                                    <View style={{ width: 48 }} />
                                </View>

                                {newExerciseSets.map((set, index) => (
                                    <View key={index} style={styles.setEditCard}>
                                        <View style={styles.setEditRow}>
                                            <Text style={styles.setEditNumber}>{index + 1}</Text>
                                            
                                            <TextInput
                                                mode="outlined"
                                                keyboardType="numeric"
                                                value={set.reps ? set.reps.toString() : ''}
                                                onChangeText={(text) => handleUpdateNewSet(index, 'reps', parseInt(text) || 0)}
                                                style={styles.setEditInput}
                                                dense
                                                placeholder="0"
                                            />

                                            {isWeightRequired(selectedExerciseForAdd?.equipment) && (
                                                <TextInput
                                                    mode="outlined"
                                                    keyboardType="numeric"
                                                    value={set.weight ? set.weight.toString() : ''}
                                                    onChangeText={(text) => handleUpdateNewSet(index, 'weight', parseFloat(text) || 0)}
                                                    style={styles.setEditInput}
                                                    dense
                                                    placeholder="0"
                                                />
                                            )}

                                            <IconButton
                                                icon="delete"
                                                size={20}
                                                iconColor="#d32f2f"
                                                onPress={() => handleRemoveNewSet(index)}
                                                style={styles.deleteButton}
                                            />
                                        </View>
                                    </View>
                                ))}

                                <Button
                                    mode="outlined"
                                    onPress={handleAddNewSet}
                                    icon="plus"
                                    style={styles.addSetButton}
                                >
                                    Add Set
                                </Button>
                            </View>

                            {/* Note Input */}
                            <TextInput
                                label="Note (optional)"
                                value={newExerciseNote}
                                onChangeText={setNewExerciseNote}
                                mode="outlined"
                                style={styles.noteInput}
                                multiline
                                numberOfLines={3}
                                placeholder="Additional notes about this exercise"
                            />

                            {/* Action Buttons */}
                            <View style={styles.modalActions}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setShowAddExerciseModal(false)}
                                    style={styles.modalButton}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleConfirmAddExercise}
                                    style={styles.modalButton}
                                    loading={createExerciseMutation.isPending}
                                    disabled={createExerciseMutation.isPending}
                                >
                                    Add
                                </Button>
                            </View>
                        </ScrollView>
                    </Modal>
                </Portal>

                {/* Edit Exercise Modal */}
                <Portal>
                    <Modal
                        visible={showEditModal}
                        onDismiss={() => setShowEditModal(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <ScrollView>
                            <Text style={styles.modalTitle}>
                                Edit Exercise: {selectedExercise?.exercise?.name}
                            </Text>

                            {selectedExercise?.exercise?.equipment && (
                                <Text style={styles.equipmentNote}>
                                    Equipment: {selectedExercise.exercise.equipment}
                                    {!isWeightRequired(selectedExercise.exercise.equipment) && ' (No weight required)'}
                                </Text>
                            )}

                            {/* Sets List */}
                            <View style={styles.setsEditContainer}>
                                <View style={styles.setsEditHeader}>
                                    <Text style={[styles.setsEditHeaderText, { flex: 0.5 }]}>Set</Text>
                                    <Text style={[styles.setsEditHeaderText, { flex: 1 }]}>Reps</Text>
                                    {isWeightRequired(selectedExercise?.exercise?.equipment) && (
                                        <Text style={[styles.setsEditHeaderText, { flex: 1 }]}>Weight (kg)</Text>
                                    )}
                                    <View style={{ width: 48 }} />
                                </View>

                                {editingSets.map((set, index) => (
                                    <View key={index} style={styles.setEditCard}>
                                        <View style={styles.setEditRow}>
                                            <Text style={styles.setEditNumber}>{index + 1}</Text>
                                            
                                            <TextInput
                                                mode="outlined"
                                                keyboardType="numeric"
                                                value={set.reps ? set.reps.toString() : ''}
                                                onChangeText={(text) => handleUpdateSet(index, 'reps', parseInt(text) || 0)}
                                                style={styles.setEditInput}
                                                dense
                                                placeholder="0"
                                            />

                                            {isWeightRequired(selectedExercise?.exercise?.equipment) && (
                                                <TextInput
                                                    mode="outlined"
                                                    keyboardType="numeric"
                                                    value={set.weight ? set.weight.toString() : ''}
                                                    onChangeText={(text) => handleUpdateSet(index, 'weight', parseFloat(text) || 0)}
                                                    style={styles.setEditInput}
                                                    dense
                                                    placeholder="0"
                                                />
                                            )}

                                            <IconButton
                                                icon="delete"
                                                size={20}
                                                iconColor="#d32f2f"
                                                onPress={() => handleRemoveSet(index)}
                                                style={styles.deleteButton}
                                            />
                                        </View>
                                    </View>
                                ))}

                                <Button
                                    mode="outlined"
                                    onPress={handleAddSet}
                                    icon="plus"
                                    style={styles.addSetButton}
                                >
                                    Add Set
                                </Button>
                            </View>

                            {/* Action Buttons */}
                            <View style={styles.modalActions}>
                                <Button
                                    mode="outlined"
                                    onPress={() => setShowEditModal(false)}
                                    style={styles.modalButton}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    mode="contained"
                                    onPress={handleSaveExercise}
                                    style={styles.modalButton}
                                    loading={updateExerciseMutation.isPending}
                                    disabled={updateExerciseMutation.isPending}
                                >
                                    Save
                                </Button>
                            </View>
                        </ScrollView>
                    </Modal>
                </Portal>
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
    exerciseInfoText: {
        fontSize: 13,
        color: '#757575',
    },
    exerciseInfo: {
        flex: 1,
        marginLeft: 8,
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
        paddingVertical: 4,
    },
    setsHeaderText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#757575',
        textAlign: 'center',
    },
    setNumberHeader: {
        flex: 0.8,
    },
    setValueHeader: {
        flex: 1,
    },
    levelHeader: {
        flex: 1.3,
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    setNumber: {
        fontSize: 14,
        fontWeight: '600',
        color: '#212121',
        flex: 0.8,
        textAlign: 'center',
    },
    setValue: {
        fontSize: 14,
        color: '#424242',
        flex: 1,
        textAlign: 'center',
    },
    levelContainer: {
        flex: 1.3,
        alignItems: 'center',
        justifyContent: 'center',
    },
    levelChip: {
        height: 32,
        minWidth: 110,
        paddingHorizontal: 8,
    },
    levelChipText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#212121',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 32, // Extra space for safe area
        backgroundColor: '#1976d2',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
        maxHeight: '90%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#212121',
    },
    modalNote: {
        fontSize: 13,
        color: '#757575',
        backgroundColor: '#e3f2fd',
        padding: 10,
        borderRadius: 6,
        marginBottom: 20,
    },
    setsEditContainer: {
        marginBottom: 20,
    },
    setsEditHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: '#1976d2',
        marginBottom: 16,
        gap: 8,
    },
    setsEditHeaderText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1976d2',
        textAlign: 'center',
    },
    setEditCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    setEditRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    setEditNumber: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1976d2',
        flex: 0.5,
        textAlign: 'center',
    },
    setEditInput: {
        flex: 1,
        height: 40,
        backgroundColor: 'white',
    },
    deleteButton: {
        margin: 0,
        width: 48,
    },
    levelRowDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        gap: 8,
    },
    levelLabel: {
        fontSize: 12,
        color: '#757575',
        fontWeight: '600',
    },
    levelChipEdit: {
        height: 32,
        minWidth: 110,
        paddingHorizontal: 8,
    },
    addSetButton: {
        marginTop: 12,
        borderColor: '#1976d2',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
        marginTop: 20,
    },
    modalButton: {
        minWidth: 100,
    },
    noteInput: {
        marginBottom: 16,
    },
    exerciseModalContainer: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 8,
        maxHeight: '80%',
    },
    searchbar: {
        marginBottom: 16,
    },
    loading: {
        marginTop: 20,
    },
    exerciseList: {
        maxHeight: 400,
    },
    exerciseItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    exerciseItemName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    exerciseItemCategory: {
        fontSize: 12,
        color: '#757575',
    },
    cancelButton: {
        marginTop: 16,
    },
    equipmentNote: {
        fontSize: 13,
        color: '#757575',
        backgroundColor: '#f0f0f0',
        padding: 8,
        borderRadius: 6,
        marginBottom: 16,
    },
    loadingMore: {
        paddingVertical: 16,
    },
    exerciseCatalogEmptyText: {
        textAlign: 'center',
        color: '#757575',
        fontSize: 14,
        paddingVertical: 24,
    },
});

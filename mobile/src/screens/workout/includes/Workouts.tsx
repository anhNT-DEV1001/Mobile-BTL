import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Button, Card, FAB, IconButton, ActivityIndicator, Modal, Portal, TextInput } from "react-native-paper";
import { Calendar, DateData } from "react-native-calendars";
import { useWorkouts, useCreateWorkout, useUpdateWorkout, useDeleteWorkout, useWorkoutExercises, useCreateWorkoutFromTemplate, useWorkoutTemplates, useCalculateStrengthLevel } from "../hooks/useWorkout";
import { useRouter } from "expo-router";
import type { ExerciseSet, Workout } from "../services/workout.service";

// Helper function to check if exercise requires weight
const isWeightRequired = (equipment?: string): boolean => {
  if (!equipment) return true; // Default to requiring weight if unknown
  const noWeightEquipment = ['body only', 'foam roll', 'bands', 'other'];
  return !noWeightEquipment.includes(equipment.toLowerCase());
};

export default function Workouts() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModalDatePicker, setShowModalDatePicker] = useState(false);
  const [workoutName, setWorkoutName] = useState("");
  const [workoutNote, setWorkoutNote] = useState("");
  const [editingDate, setEditingDate] = useState<string>("");
  
  // Edit mode states
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const { data: workouts = [], isLoading, refetch, isRefetching } = useWorkouts();
  const { data: templates = [] } = useWorkoutTemplates();
  const createWorkoutMutation = useCreateWorkout();
  const updateWorkoutMutation = useUpdateWorkout();
  const deleteWorkoutMutation = useDeleteWorkout();
  const createFromTemplateMutation = useCreateWorkoutFromTemplate();

  // Lọc workouts theo ngày đã chọn
  const filteredWorkouts = workouts.filter((workout) => {
    const workoutDate = new Date(workout.date).toISOString().split("T")[0];
    return workoutDate === selectedDate;
  });

  const handleDateSelect = (day: DateData) => {
    setSelectedDate(day.dateString);
    setShowCalendar(false);
  };

  const resetModalState = () => {
    setWorkoutName("");
    setWorkoutNote("");
    setEditingDate("");
    setShowModalDatePicker(false);
    setEditingWorkout(null);
    setModalMode('create');
  };

  const handleCreateEmptyWorkout = async () => {
    try {
      await createWorkoutMutation.mutateAsync({
        name: workoutName || "New Workout",
        date: selectedDate,
        note: workoutNote || undefined,
      });
      setShowAddModal(false);
      resetModalState();
      Alert.alert("Success", "Workout created successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to create workout");
    }
  };

  const handleCreateFromTemplate = async (templateId: string) => {
    try {
      await createFromTemplateMutation.mutateAsync({
        templateId,
        date: selectedDate,
      });
      setShowAddModal(false);
      resetModalState();
      Alert.alert("Success", "Workout created from template!");
    } catch (error) {
      Alert.alert("Error", "Failed to create workout from template");
    }
  };

  const handleDeleteWorkout = (workoutId: string, workoutName: string) => {
    Alert.alert(
      "Delete Workout",
      `Are you sure you want to delete "${workoutName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteWorkoutMutation.mutateAsync(workoutId);
              Alert.alert("Success", "Workout deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete workout");
            }
          },
        },
      ]
    );
  };

  const handleEditWorkout = (workout: Workout) => {
    setModalMode('edit');
    setEditingWorkout(workout);
    setWorkoutName(workout.name);
    setWorkoutNote(workout.note || "");
    const workoutDate = new Date(workout.date).toISOString().split("T")[0];
    setEditingDate(workoutDate);
    setShowAddModal(true);
  };

  const handleUpdateWorkout = async () => {
    if (!editingWorkout) return;

    try {
      await updateWorkoutMutation.mutateAsync({
        id: editingWorkout.id,
        data: {
          name: workoutName || editingWorkout.name,
          date: editingDate || editingWorkout.date,
          note: workoutNote || undefined,
        },
      });
      setShowAddModal(false);
      resetModalState();
      Alert.alert("Success", "Workout updated successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to update workout");
    }
  };

  const handleWorkoutPress = (workoutId: string) => {
    router.push(`/(app)/workout/${workoutId}`);
  };

  // Tạo marked dates cho calendar
  const markedDates: Record<string, any> = workouts.reduce((acc, workout) => {
    const date = new Date(workout.date).toISOString().split("T")[0];
    return {
      ...acc,
      [date]: { marked: true, dotColor: "#003366" },
    };
  }, {});

  markedDates[selectedDate] = {
    ...markedDates[selectedDate],
    selected: true,
    selectedColor: "#003366",
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Date Selector */}
        <View style={styles.dateSection}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Text style={styles.dateButtonText}>
              {new Date(selectedDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
            <IconButton icon="calendar" size={20} />
          </TouchableOpacity>

          {showCalendar && (
            <Calendar
              current={selectedDate}
              onDayPress={handleDateSelect}
              markedDates={markedDates}
              theme={{
                selectedDayBackgroundColor: "#003366",
                todayTextColor: "#003366",
                dotColor: "#003366",
                arrowColor: "#003366",
              }}
            />
          )}
        </View>

        {/* Workouts List */}
        <View style={styles.workoutsSection}>
          <Text style={styles.sectionTitle}>
            Workouts ({filteredWorkouts.length})
          </Text>
          {filteredWorkouts.length === 0 ? (
            <Card style={styles.emptyCard}>
              <Card.Content>
                <Text style={styles.emptyText}>
                  No workouts for this date. Tap + to add one!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            filteredWorkouts.map((workout) => (
              <WorkoutCard
                key={workout.id}
                workout={workout}
                onPress={() => handleWorkoutPress(workout.id)}
                onEdit={() => handleEditWorkout(workout)}               
                onDelete={() => handleDeleteWorkout(workout.id, workout.name)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add/Edit Workout Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => {
            setShowAddModal(false);
            resetModalState();
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.modalTitle}>
              {modalMode === 'create' ? 'Add New Workout' : 'Edit Workout'}
            </Text>
            
            <TextInput
              label="Workout Name"
              value={workoutName}
              onChangeText={setWorkoutName}
              mode="outlined"
              style={styles.input}
              placeholder="New Workout"
            />

            {modalMode === 'edit' && (
              <>
                <Text style={styles.inputLabel}>Workout Date</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowModalDatePicker(!showModalDatePicker)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {new Date(editingDate).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <IconButton icon="calendar" size={20} />
                </TouchableOpacity>

                {showModalDatePicker && (
                  <Calendar
                    current={editingDate}
                    onDayPress={(day) => {
                      setEditingDate(day.dateString);
                      setShowModalDatePicker(false);
                    }}
                    markedDates={{
                      ...markedDates,
                      [editingDate]: {
                        ...markedDates[editingDate],
                        selected: true,
                        selectedColor: "#003366",
                      },
                    }}
                    theme={{
                      selectedDayBackgroundColor: "#003366",
                      todayTextColor: "#003366",
                      dotColor: "#003366",
                      arrowColor: "#003366",
                    }}
                    style={styles.modalCalendar}
                  />
                )}
              </>
            )}

            <TextInput
              label="Note (optional)"
              value={workoutNote}
              onChangeText={(text) => {
                console.log('Note changed:', text);
                setWorkoutNote(text);
              }}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Add a note about this workout"
            />

            <Button
              mode="contained"
              onPress={modalMode === 'create' ? handleCreateEmptyWorkout : handleUpdateWorkout}
              style={styles.modalButton}
              loading={modalMode === 'create' 
                ? createWorkoutMutation.isPending 
                : updateWorkoutMutation.isPending}
            >
              {modalMode === 'create' ? 'Create Empty Workout' : 'Update Workout'}
            </Button>

            {modalMode === 'create' && (
              <>
                <Text style={styles.modalSubtitle}>Or create from template:</Text>

                <View style={styles.templateList}>
                  {templates.length === 0 ? (
                    <Text style={styles.noTemplatesText}>
                      No templates available. Create one in Templates tab!
                    </Text>
                  ) : (
                    templates.map((template) => (
                      <Button
                        key={template.id}
                        mode="outlined"
                        onPress={() => handleCreateFromTemplate(template.id)}
                        style={styles.templateButton}
                        loading={createFromTemplateMutation.isPending}
                      >
                        {template.name}
                      </Button>
                    ))
                  )}
                </View>
              </>
            )}

            <Button 
              onPress={() => {
                setShowAddModal(false);
                resetModalState();
              }} 
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </ScrollView>
        </Modal>
      </Portal>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setShowAddModal(true)}
        color="white"
      />
    </View>
  );
}

// WorkoutCard Component
// Helper function to get level color
const getLevelColor = (level: string): string => {
  const lowerLevel = level.toLowerCase();
  switch (lowerLevel) {
    case 'beginner':
      return '#2196F3';
    case 'novice':
      return '#FF9800';
    case 'intermediate':
      return '#4CAF50';
    case 'advanced':
      return '#E91E63';
    case 'gymlord':
    case 'gym lord':
      return '#9C27B0';
    default:
      return '#757575';
  }
};

// Component to display set with auto-calculated level
function SetDisplay({ set, setIndex, equipment }: { set: ExerciseSet; setIndex: number; equipment?: string }) {
  const [level, setLevel] = useState<string | null>(set.level || null);
  const calculateLevelMutation = useCalculateStrengthLevel();
  const showWeight = isWeightRequired(equipment);

  useEffect(() => {
    // Only calculate if level is missing but weight and reps exist and weight is required
    if (showWeight && !set.level && set.weight && set.reps && set.weight > 0 && set.reps > 0) {
      calculateLevelMutation.mutateAsync({
        weight: set.weight,
        reps: set.reps,
      }).then((result) => {
        setLevel(result.level || null);
      }).catch((error) => {
        console.error('Failed to calculate level:', error);
      });
    }
  }, [set.weight, set.reps, set.level, showWeight]);

  const displayLevel = level || set.level;

  return (
    <View style={styles.setRow}>
      <Text style={styles.setText}>
        Set {setIndex + 1}: {set.reps} reps
        {showWeight && set.weight ? ` × ${set.weight}kg` : ""}
      </Text>
      {showWeight && displayLevel && (
        <Text style={[styles.levelBadge, { color: getLevelColor(displayLevel) }]}>
          {displayLevel.toUpperCase()}
        </Text>
      )}
    </View>
  );
}

interface WorkoutCardProps {
  workout: any;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function WorkoutCard({ workout, onPress, onEdit, onDelete }: WorkoutCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { data: exercises = [], isLoading } = useWorkoutExercises(workout.id);

  // Calculate summary stats
  const totalSets = exercises.reduce((sum, ex) => sum + ex.sets.length, 0);
  const totalVolume = exercises.reduce((sum, ex) => sum + (ex.totalVolume || 0), 0);

  return (
    <Card style={styles.workoutCard}>
      <Card.Content>
        <View style={styles.workoutHeader}>
          <TouchableOpacity 
            style={styles.workoutHeaderLeft}
            onPress={onPress}
            activeOpacity={0.7}
          >
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutDate}>
              {new Date(workout.date).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          <View style={styles.workoutHeaderRight}>
            <IconButton
              icon={expanded ? "chevron-up" : "chevron-down"}
              iconColor="#003366"
              size={20}
              onPress={() => setExpanded(!expanded)}
            />
            <IconButton
              icon="pencil"
              iconColor="#003366"
              size={20}
              onPress={onEdit}
            />
            <IconButton
              icon="delete"
              iconColor="#d32f2f"
              size={20}
              onPress={onDelete}
            />
          </View>
        </View>

        {workout.note && (
          <Text style={styles.workoutNote}>{workout.note}</Text>
        )}

        {/* Summary Stats - Always visible */}
        {!isLoading && exercises.length > 0 && (
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{exercises.length}</Text>
              <Text style={styles.summaryLabel}>Exercises</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{totalSets}</Text>
              <Text style={styles.summaryLabel}>Sets</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryNumber}>{totalVolume.toFixed(0)}</Text>
              <Text style={styles.summaryLabel}>Volume (kg)</Text>
            </View>
          </View>
        )}

        {/* Detailed Exercises List - Only when expanded */}
        {expanded && (
          <>
            {isLoading ? (
              <ActivityIndicator size="small" color="#003366" />
            ) : exercises.length > 0 ? (
              <View style={styles.exercisesList}>
                {exercises.map((exercise, index) => (
                  <View key={exercise.id} style={styles.exerciseItem}>
                    <Text style={styles.exerciseName}>
                      {index + 1}. {exercise.exercise?.name || "Exercise"}
                    </Text>
                    <View style={styles.setsContainer}>
                      {exercise.sets.map((set: ExerciseSet, setIndex: number) => (
                        <SetDisplay 
                          key={setIndex} 
                          set={set} 
                          setIndex={setIndex}
                          equipment={exercise.exercise?.equipment}
                        />
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={styles.noExercisesText}>
                No exercises added yet. Tap to add!
              </Text>
            )}
          </>
        )}

        {!expanded && exercises.length === 0 && !isLoading && (
          <Text style={styles.noExercisesText}>
            No exercises added yet. Tap to add!
          </Text>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 150, // Extra space for footer tab + FAB + safe area
  },
  dateSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 12,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  workoutsSection: {
    marginBottom: 16,
  },
  emptyCard: {
    backgroundColor: "white",
    marginVertical: 8,
  },
  emptyText: {
    textAlign: "center",
    color: "#757575",
    fontSize: 14,
  },
  workoutCard: {
    backgroundColor: "white",
    marginVertical: 8,
    elevation: 2,
  },
  workoutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  workoutHeaderLeft: {
    flex: 1,
  },
  workoutHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  workoutName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
    color: "#757575",
  },
  workoutNote: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 12,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#757575",
    textAlign: "center",
  },
  exercisesList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  exerciseItem: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  setsContainer: {
    marginLeft: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingVertical: 4,
    gap: 8,
  },
  setText: {
    fontSize: 13,
    color: "#666",
    flex: 1,
    flexShrink: 1,
  },
  levelBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    minWidth: 100,
    textAlign: 'center',
    flexShrink: 0,
  },
  noExercisesText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 72, // 56px footer + 16px margin
    backgroundColor: "#003366",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    maxHeight: "80%",
  },
  modalScrollContent: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  modalButton: {
    marginBottom: 16,
    backgroundColor: "#003366",
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  templateList: {
    marginBottom: 16,
  },
  templateButton: {
    marginBottom: 8,
  },
  noTemplatesText: {
    fontSize: 14,
    color: "#757575",
    textAlign: "center",
    padding: 16,
  },
  cancelButton: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 12,
    color: "#757575",
    marginBottom: 4,
    marginTop: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#bdbdbd",
    marginBottom: 16,
  },
  datePickerButtonText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  modalCalendar: {
    marginBottom: 16,
    borderRadius: 8,
    width: '100%',
  },
});

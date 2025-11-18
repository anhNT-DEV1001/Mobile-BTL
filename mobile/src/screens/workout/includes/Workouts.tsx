import React, { useState } from "react";
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
import { useWorkouts, useCreateWorkout, useDeleteWorkout, useWorkoutExercises, useCreateWorkoutFromTemplate, useWorkoutTemplates } from "../hooks/useWorkout";
import { useRouter } from "expo-router";

export default function Workouts() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [workoutName, setWorkoutName] = useState("");

  const { data: workouts = [], isLoading, refetch, isRefetching } = useWorkouts();
  const { data: templates = [] } = useWorkoutTemplates();
  const createWorkoutMutation = useCreateWorkout();
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

  const handleCreateEmptyWorkout = async () => {
    try {
      await createWorkoutMutation.mutateAsync({
        name: workoutName || "New Workout",
        date: selectedDate,
      });
      setShowAddModal(false);
      setWorkoutName("");
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
                onDelete={() => handleDeleteWorkout(workout.id, workout.name)}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Workout Modal */}
      <Portal>
        <Modal
          visible={showAddModal}
          onDismiss={() => setShowAddModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <Text style={styles.modalTitle}>Add New Workout</Text>
          
          <TextInput
            label="Workout Name (optional)"
            value={workoutName}
            onChangeText={setWorkoutName}
            mode="outlined"
            style={styles.input}
            placeholder="New Workout"
          />

          <Button
            mode="contained"
            onPress={handleCreateEmptyWorkout}
            style={styles.modalButton}
            loading={createWorkoutMutation.isPending}
          >
            Create Empty Workout
          </Button>

          <Text style={styles.modalSubtitle}>Or create from template:</Text>

          <ScrollView style={styles.templateList}>
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
          </ScrollView>

          <Button onPress={() => setShowAddModal(false)} style={styles.cancelButton}>
            Cancel
          </Button>
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
interface WorkoutCardProps {
  workout: any;
  onPress: () => void;
  onDelete: () => void;
}

function WorkoutCard({ workout, onPress, onDelete }: WorkoutCardProps) {
  const { data: exercises = [], isLoading } = useWorkoutExercises(workout.id);

  return (
    <Card style={styles.workoutCard} onPress={onPress}>
      <Card.Content>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutHeaderLeft}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutDate}>
              {new Date(workout.date).toLocaleDateString()}
            </Text>
          </View>
          <IconButton
            icon="delete"
            iconColor="#d32f2f"
            size={20}
            onPress={onDelete}
          />
        </View>

        {workout.note && (
          <Text style={styles.workoutNote}>{workout.note}</Text>
        )}

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
                  {exercise.sets.map((set: any, setIndex: number) => (
                    <Text key={setIndex} style={styles.setText}>
                      Set {setIndex + 1}: {set.reps} reps
                      {set.weight ? ` × ${set.weight}kg` : ""}
                      {set.level ? ` (${set.level})` : ""}
                    </Text>
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
    paddingBottom: 80,
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
  exercisesList: {
    marginTop: 8,
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
  setText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 2,
  },
  noExercisesText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#003366",
  },
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: "80%",
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
    maxHeight: 200,
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
});

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import {
  Button,
  Card,
  FAB,
  IconButton,
  ActivityIndicator,
  Modal,
  Portal,
  TextInput,
  Chip,
  Searchbar,
  Checkbox,
} from "react-native-paper";
import {
  useWorkoutTemplates,
  useCreateWorkoutTemplate,
  useUpdateWorkoutTemplate,
  useDeleteWorkoutTemplate,
} from "../hooks/useWorkout";
import { useExercises } from "@/src/screens/exercise/hooks/useExercise";
import type { Exercise } from "@/src/screens/exercise/services/exercise.service";

export default function Templates() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExerciseSelectModal, setShowExerciseSelectModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [templateName, setTemplateName] = useState("");
  const [templateLevel, setTemplateLevel] = useState("");
  const [templateType, setTemplateType] = useState("");
  const [templateNote, setTemplateNote] = useState("");
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalPage, setModalPage] = useState<number>(1);
  const [modalLimit, setModalLimit] = useState<number>(50);

  const { data: templates = [], isLoading, refetch, isRefetching } = useWorkoutTemplates();
  const { data: exercisesData, isLoading: exercisesLoading, refetch: refetchExercises } = useExercises({ q: searchQuery, page: modalPage, limit: modalLimit });
  const createTemplateMutation = useCreateWorkoutTemplate();
  const updateTemplateMutation = useUpdateWorkoutTemplate();
  const deleteTemplateMutation = useDeleteWorkoutTemplate();

  const exercises = exercisesData?.items || [];

  const handleAddTemplate = () => {
    setTemplateName("");
    setTemplateLevel("");
    setTemplateType("");
    setTemplateNote("");
    setSelectedExerciseIds([]);
    setShowAddModal(true);
  };

  const handleEditTemplate = (template: any) => {
    setSelectedTemplate(template);
    setTemplateName(template.name);
    setTemplateLevel(template.level || "");
    setTemplateType(template.type || "");
    setTemplateNote(template.note || "");
    // Extract exercise IDs from template
    const exerciseIds = template.exercises?.map((ex: any) => ex._id || ex.id) || [];
    setSelectedExerciseIds(exerciseIds);
    setShowEditModal(true);
  };

  const handleDeleteTemplate = (templateId: string, templateName: string) => {
    Alert.alert(
      "Delete Template",
      `Are you sure you want to delete "${templateName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTemplateMutation.mutateAsync(templateId);
              Alert.alert("Success", "Template deleted successfully!");
            } catch (error) {
              Alert.alert("Error", "Failed to delete template");
            }
          },
        },
      ]
    );
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) {
      Alert.alert("Error", "Template name is required!");
      return;
    }

    if (selectedExerciseIds.length === 0) {
      Alert.alert("Error", "Please select at least one exercise!");
      return;
    }

    try {
      const data = {
        name: templateName,
        exercises: selectedExerciseIds,
        level: templateLevel || undefined,
        type: templateType || undefined,
        note: templateNote || undefined,
      };

      if (showEditModal && selectedTemplate) {
        await updateTemplateMutation.mutateAsync({
          id: selectedTemplate.id,
          data,
        });
        Alert.alert("Success", "Template updated successfully!");
      } else {
        await createTemplateMutation.mutateAsync(data);
        Alert.alert("Success", "Template created successfully!");
      }

      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to save template");
    }
  };

  const handleOpenExerciseSelect = () => {
    setShowExerciseSelectModal(true);
  };

  const handleToggleExercise = (exerciseId: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  // server-side filtering/pagination via useExercises; filteredExercises is the current page
  const filteredExercises = exercises;

  const getSelectedExerciseNames = () => {
    return exercises
      .filter((ex) => selectedExerciseIds.includes(ex._id || ex.id))
      .map((ex) => ex.name)
      .join(", ");
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
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Templates</Text>
          <Text style={styles.headerSubtitle}>
            Manage your workout templates
          </Text>
        </View>

        {templates.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>
                No templates yet. Tap + to create your first template!
              </Text>
            </Card.Content>
          </Card>
        ) : (
          templates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={() => handleEditTemplate(template)}
              onDelete={() => handleDeleteTemplate(template.id, template.name)}
            />
          ))
        )}
      </ScrollView>

      {/* Add/Edit Template Modal */}
      <Portal>
        <Modal
          visible={showAddModal || showEditModal}
          onDismiss={() => {
            setShowAddModal(false);
            setShowEditModal(false);
          }}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>
              {showEditModal ? "Edit Template" : "Create New Template"}
            </Text>

            <TextInput
              label="Template Name *"
              value={templateName}
              onChangeText={setTemplateName}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Upper Body Strength"
            />

            <TextInput
              label="Level (optional)"
              value={templateLevel}
              onChangeText={setTemplateLevel}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Beginner, Intermediate, Advanced"
            />

            <TextInput
              label="Type (optional)"
              value={templateType}
              onChangeText={setTemplateType}
              mode="outlined"
              style={styles.input}
              placeholder="e.g. Strength, Cardio, Full-Body"
            />

            <TextInput
              label="Note (optional)"
              value={templateNote}
              onChangeText={setTemplateNote}
              mode="outlined"
              style={styles.input}
              multiline
              numberOfLines={3}
              placeholder="Additional notes about this template"
            />

            {/* Exercise Selection */}
            <View style={styles.exerciseSection}>
              <Text style={styles.exerciseLabel}>
                Exercises * ({selectedExerciseIds.length} selected)
              </Text>
              <Button
                mode="outlined"
                onPress={handleOpenExerciseSelect}
                style={styles.selectButton}
                icon="plus"
              >
                Select Exercises
              </Button>
              {selectedExerciseIds.length > 0 && (
                <View style={styles.selectedExercisesContainer}>
                  <Text style={styles.selectedExercisesText} numberOfLines={3}>
                    {getSelectedExerciseNames()}
                  </Text>
                </View>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleSaveTemplate}
              style={styles.modalButton}
              loading={
                createTemplateMutation.isPending || updateTemplateMutation.isPending
              }
              disabled={
                createTemplateMutation.isPending || updateTemplateMutation.isPending
              }
            >
              {showEditModal ? "Update Template" : "Create Template"}
            </Button>

            <Button
              onPress={() => {
                setShowAddModal(false);
                setShowEditModal(false);
              }}
              style={styles.cancelButton}
            >
              Cancel
            </Button>
          </ScrollView>
        </Modal>

        {/* Exercise Selection Modal */}
        <Modal
          visible={showExerciseSelectModal}
          onDismiss={() => setShowExerciseSelectModal(false)}
          contentContainerStyle={styles.exerciseModalContainer}
        >
          <Text style={styles.modalTitle}>Select Exercises</Text>

          <Searchbar
            placeholder="Search exercises..."
            onChangeText={(text) => { setSearchQuery(text); setModalPage(1); }}
            value={searchQuery}
            style={styles.searchbar}
          />

          {exercisesLoading ? (
            <ActivityIndicator size="large" color="#003366" style={styles.loading} />
          ) : (
            <>
              <FlatList
                data={filteredExercises}
                keyExtractor={(item) => item._id || item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.exerciseItem}
                    onPress={() => handleToggleExercise(item._id || item.id)}
                  >
                    <Checkbox
                      status={
                        selectedExerciseIds.includes(item._id || item.id)
                          ? "checked"
                          : "unchecked"
                      }
                    />
                    <View style={styles.exerciseInfo}>
                      <Text style={styles.exerciseItemName}>{item.name}</Text>
                      {item.category && (
                        <Text style={styles.exerciseItemCategory}>
                          {item.category}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                )}
                style={styles.exerciseList}
              />

              {/* Pagination controls for exercise modal */}
              <View style={styles.modalPagination}>
                <Button
                  mode="outlined"
                  onPress={() => { setModalPage(1); }}
                  disabled={modalPage <= 1}
                  style={styles.pageButton}
                >
                  « First
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => { setModalPage(Math.max(1, modalPage - 1)); }}
                  disabled={modalPage <= 1}
                  style={styles.pageButton}
                >
                  ‹ Prev
                </Button>

                <View style={styles.pageInfo}>
                  <Text>{modalPage} / {Math.max(1, Math.ceil((exercisesData?.total || 0) / modalLimit))}</Text>
                </View>

                <Button
                  mode="outlined"
                  onPress={() => { setModalPage(modalPage + 1); }}
                  disabled={modalPage >= Math.ceil((exercisesData?.total || 0) / modalLimit)}
                  style={styles.pageButton}
                >
                  Next ›
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => { setModalPage(Math.max(1, Math.ceil((exercisesData?.total || 0) / modalLimit))); }}
                  disabled={modalPage >= Math.ceil((exercisesData?.total || 0) / modalLimit)}
                  style={styles.pageButton}
                >
                  Last »
                </Button>
              </View>
            </>
          )}

          <Button
            mode="contained"
            onPress={() => setShowExerciseSelectModal(false)}
            style={styles.doneButton}
          >
            Done ({selectedExerciseIds.length} selected)
          </Button>
        </Modal>
      </Portal>

      {/* FAB */}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={handleAddTemplate}
        color="white"
      />
    </View>
  );
}

// TemplateCard Component
interface TemplateCardProps {
  template: any;
  onEdit: () => void;
  onDelete: () => void;
}

function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <Card style={styles.templateCard}>
      <Card.Content>
        <View style={styles.templateHeader}>
          <View style={styles.templateHeaderLeft}>
            <Text style={styles.templateName}>{template.name}</Text>
            <View style={styles.chipContainer}>
              {template.level && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {template.level}
                </Chip>
              )}
              {template.type && (
                <Chip
                  mode="outlined"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {template.type}
                </Chip>
              )}
            </View>
          </View>
          <View style={styles.actionButtons}>
            <IconButton icon="pencil" iconColor="#003366" size={20} onPress={onEdit} />
            <IconButton icon="delete" iconColor="#d32f2f" size={20} onPress={onDelete} />
          </View>
        </View>

        {template.note && (
          <Text style={styles.templateNote}>{template.note}</Text>
        )}

        {template.exercises && template.exercises.length > 0 ? (
          <View style={styles.exercisesList}>
            <Text style={styles.exercisesTitle}>
              Exercises ({template.exercises.length}):
            </Text>
            {template.exercises.slice(0, 5).map((exercise: any, index: number) => (
              <Text key={index} style={styles.exerciseItemText}>
                • {exercise.name || exercise.exerciseName || "Exercise"}
              </Text>
            ))}
            {template.exercises.length > 5 && (
              <Text style={styles.moreExercises}>
                ... and {template.exercises.length - 5} more
              </Text>
            )}
          </View>
        ) : (
          <Text style={styles.noExercisesText}>
            No exercises added yet. Tap edit to add exercises!
          </Text>
        )}

        <Button
          mode="outlined"
          onPress={onEdit}
          style={styles.manageButton}
          icon="cog"
        >
          Manage Exercises
        </Button>
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
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#757575",
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
  templateCard: {
    backgroundColor: "white",
    marginVertical: 8,
    elevation: 2,
  },
  templateHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  templateHeaderLeft: {
    flex: 1,
  },
  templateName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 8,
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    height: 28,
    marginRight: 4,
  },
  chipText: {
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: -8,
  },
  templateNote: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 12,
  },
  exercisesList: {
    marginTop: 8,
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  exercisesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  exerciseItemText: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  moreExercises: {
    fontSize: 13,
    color: "#757575",
    fontStyle: "italic",
    marginTop: 4,
  },
  noExercisesText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
    marginTop: 8,
    marginBottom: 12,
  },
  manageButton: {
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
    marginBottom: 8,
    backgroundColor: "#003366",
  },
  cancelButton: {
    marginTop: 8,
  },
  exerciseSection: {
    marginBottom: 16,
  },
  exerciseLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  selectButton: {
    marginBottom: 8,
  },
  selectedExercisesContainer: {
    padding: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    marginTop: 8,
  },
  selectedExercisesText: {
    fontSize: 13,
    color: "#666",
  },
  exerciseModalContainer: {
    backgroundColor: "white",
    margin: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: "80%",
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
  modalPagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  pageButton: {
    minWidth: 80,
    marginHorizontal: 4,
  },
  pageInfo: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  exerciseInfo: {
    flex: 1,
    marginLeft: 8,
  },
  exerciseItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  exerciseItemCategory: {
    fontSize: 12,
    color: "#757575",
  },
  doneButton: {
    marginTop: 16,
    backgroundColor: "#003366",
  },
});

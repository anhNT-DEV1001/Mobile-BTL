import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  Platform,
  TouchableOpacity,
} from "react-native";
import {
  Button,
  Card,
  ActivityIndicator,
  Modal,
  Portal,
  TextInput,
  Surface,
  IconButton,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useUserProfile, useUpdateUserProfile } from "../hooks/useProfile";
import { Calendar } from "react-native-calendars";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileMainLayout() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedGender, setEditedGender] = useState("");
  const [editedDob, setEditedDob] = useState<Date | undefined>(undefined);
  const [editedHeight, setEditedHeight] = useState("");
  const [editedWeight, setEditedWeight] = useState("");
  const [editedPassword, setEditedPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [calendarDate, setCalendarDate] = useState<string>("");

  const { data: profileData, isLoading, refetch, isRefetching } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const profile = profileData?.data;

  const handleEditProfile = () => {
    if (!profile) return;

    setEditedName(profile.profile.name);
    setEditedEmail(profile.email);
    setEditedGender(profile.profile.gender);
    setEditedDob(profile.profile.dob ? new Date(profile.profile.dob) : undefined);
    setEditedHeight(profile.profile.height?.toString() || "");
    setEditedWeight(profile.profile.weight?.toString() || "");
    setEditedPassword("");
    
    // Set initial calendar date for easier navigation
    if (profile.profile.dob) {
      const date = new Date(profile.profile.dob);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      setCalendarDate(`${year}-${month}-01`);
    } else {
      // Default to 2000 for easier selection
      setCalendarDate("2000-01-01");
    }
    
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!profile) return;

    if (!editedName.trim()) {
      Alert.alert("Error", "Name is required!");
      return;
    }

    // Validate password only if provided
    if (editedPassword && (editedPassword.length < 6 || editedPassword.length > 20)) {
      Alert.alert("Error", "Password must be between 6 and 20 characters!");
      return;
    }

    try {
      const updateData: any = {
        profile: {
          name: editedName,
          gender: editedGender,
          dob: editedDob?.toISOString(),
          height: editedHeight ? parseFloat(editedHeight) : profile.profile.height,
          weight: editedWeight ? parseFloat(editedWeight) : profile.profile.weight,
        },
      };

      // Only include email if changed
      if (editedEmail && editedEmail !== profile.email) {
        updateData.email = editedEmail;
      }

      // Only include password if provided
      if (editedPassword.trim()) {
        updateData.password = editedPassword;
      }

      console.log("Updating profile with data:", updateData);

      await updateProfileMutation.mutateAsync({
        userId: profile.id,
        data: updateData,
      });

      Alert.alert("Success", "Profile updated successfully!");
      setShowEditModal(false);
      setEditedPassword("");
      setShowPassword(false);
    } catch (error: any) {
      console.error("Profile update error:", error);
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to update profile";
      Alert.alert("Error", errorMessage);
    }
  };

  const formatDate = (date: string | Date | undefined): string => {
    if (!date) return "N/A";
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const onDismissDatePicker = () => {
    setShowDatePicker(false);
  };

  const onConfirmDate = (date: any) => {
    setShowDatePicker(false);
    if (date.dateString) {
      setEditedDob(new Date(date.dateString));
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#003366" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Unable to load profile</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <Surface style={styles.header} elevation={2}>
        <View style={styles.headerLeft}>
          <IconButton
            icon="arrow-left"
            iconColor="white"
            size={24}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <View style={styles.headerRight}>
          <IconButton
            icon="account-edit"
            iconColor="white"
            size={24}
            onPress={handleEditProfile}
          />
        </View>
      </Surface>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
      >
        {/* Profile Card */}
        <Card style={styles.card} elevation={2}>
          <Card.Content>
            <View style={styles.avatarSection}>
              <MaterialCommunityIcons
                name="account-circle"
                size={80}
                color="#003366"
              />
              <Text style={styles.username}>{profile.profile.name}</Text>
              <Text style={styles.email}>{profile.email}</Text>
            </View>

            {/* Profile Details */}
            <View style={styles.detailsSection}>
              <ProfileDetailItem
                icon="account"
                label="Full Name"
                value={profile.profile.name}
              />
              <ProfileDetailItem
                icon="email"
                label="Email"
                value={profile.email}
              />
              <ProfileDetailItem
                icon="calendar"
                label="Date of Birth"
                value={formatDate(profile.profile.dob)}
              />
              <ProfileDetailItem
                icon="gender-male-female"
                label="Gender"
                value={profile.profile.gender}
              />
              <ProfileDetailItem
                icon="human-male-height"
                label="Height"
                value={`${profile.profile.height} cm`}
              />
              <ProfileDetailItem
                icon="weight"
                label="Weight"
                value={`${profile.profile.weight} kg`}
              />
            </View>

            <Button
              mode="contained"
              onPress={handleEditProfile}
              style={styles.editButton}
              icon="pencil"
            >
              Edit Profile
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Portal>
        <Modal
          visible={showEditModal}
          onDismiss={() => setShowEditModal(false)}
          contentContainerStyle={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              label="Full Name *"
              value={editedName}
              onChangeText={setEditedName}
              mode="outlined"
              style={styles.input}
            />

            <TextInput
              label="Email *"
              value={editedEmail}
              onChangeText={setEditedEmail}
              mode="outlined"
              style={styles.input}
              keyboardType="email-address"
            />

            <TextInput
              label="Password (leave empty to keep current)"
              value={editedPassword}
              onChangeText={setEditedPassword}
              mode="outlined"
              style={styles.input}
              secureTextEntry={!showPassword}
              placeholder="Enter new password (6-20 chars) or leave empty"
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

            <TextInput
              label="Gender"
              value={editedGender}
              onChangeText={setEditedGender}
              mode="outlined"
              style={styles.input}
              placeholder="male, female, other"
            />

            <Button
              mode="outlined"
              onPress={() => setShowDatePicker(true)}
              style={styles.input}
              icon="calendar"
            >
              Date of Birth: {editedDob ? formatDate(editedDob) : "Select Date"}
            </Button>

            <TextInput
              label="Height (cm)"
              value={editedHeight}
              onChangeText={setEditedHeight}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <TextInput
              label="Weight (kg)"
              value={editedWeight}
              onChangeText={setEditedWeight}
              mode="outlined"
              style={styles.input}
              keyboardType="numeric"
            />

            <Button
              mode="contained"
              onPress={handleSaveProfile}
              style={styles.modalButton}
              loading={updateProfileMutation.isPending}
              disabled={updateProfileMutation.isPending}
            >
              Save Changes
            </Button>

            <Button
              onPress={() => setShowEditModal(false)}
              style={styles.cancelButton}
            >
              Cancel
            </Button>

            {showDatePicker && (
              <View style={styles.calendarWrapper}>
                <Calendar
                  current={calendarDate}
                  onDayPress={onConfirmDate}
                  onMonthChange={(month) => {
                    const newDate = `${month.year}-${String(month.month).padStart(2, "0")}-01`;
                    setCalendarDate(newDate);
                  }}
                  markedDates={
                    editedDob
                      ? {
                          [editedDob.toISOString().split("T")[0]]: {
                            selected: true,
                            selectedColor: "#003366",
                          },
                        }
                      : {}
                  }
                  theme={{
                    selectedDayBackgroundColor: "#003366",
                    todayTextColor: "#003366",
                    arrowColor: "#003366",
                  }}
                  enableSwipeMonths={true}
                />
                <View style={styles.datePickerActions}>
                  <Button
                    mode="text"
                    onPress={() => setShowDatePicker(false)}
                    textColor="#666"
                  >
                    Close Calendar
                  </Button>
                </View>
              </View>
            )}
          </ScrollView>
        </Modal>
      </Portal>
    </View>
  );
}

// Profile Detail Item Component
interface ProfileDetailItemProps {
  icon: string;
  label: string;
  value: string;
}

function ProfileDetailItem({ icon, label, value }: ProfileDetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <View style={styles.detailIconLabel}>
        <MaterialCommunityIcons name={icon as any} size={20} color="#003366" />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#003366",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    height: 56,
    backgroundColor: "#003366",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "white",
  },
  avatarSection: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    marginBottom: 16,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    color: "#003366",
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailIconLabel: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
    marginLeft: 28,
  },
  editButton: {
    marginTop: 8,
    backgroundColor: "#003366",
  },
  errorText: {
    fontSize: 16,
    color: "#757575",
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
  calendarWrapper: {
    marginTop: 16,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  datePickerActions: {
    padding: 8,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useExercise } from "../exercise/hooks/useExercise";
import { Exercise } from "../exercise/services/exercise.service";

const { width } = Dimensions.get("window");

export default function ExerciseScreen() {
  const [filters, setFilters] = useState({
    q: "",
    force: "",
    level: "",
    mechanic: "",
    equipment: "",
    primaryMuscles: "",
    category: "",
    sort: "createdAt:desc",
    page: "1",
    limit: "10",
  });

  const { getExercisesQuery } = useExercise(filters);

  useEffect(() => {
    getExercisesQuery.refetch();
  }, [filters]);

  const exercises = (getExercisesQuery as any)?.data?.data?.items  || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}> Danh sách Bài Tập</Text>

      {/* 🔍 Tìm kiếm */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#2B6CB0" style={{ marginRight: 5 }} />
        <TextInput
          placeholder="Tìm kiếm theo tên..."
          placeholderTextColor="#A0AEC0"
          value={filters.q}
          onChangeText={(text) => setFilters({ ...filters, q: text })}
          style={styles.searchInput}
        />
      </View>

      {/* ⚡ Lực tác động (force) */}
      <Text style={styles.sectionTitle}>Lực tác động (Force)</Text>
      <View style={styles.filterRow}>
        {["push", "pull", "static"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filters.force === item && styles.filterButtonActive]}
            onPress={() =>
              setFilters({ ...filters, force: filters.force === item ? "" : item })
            }
          >
            <Text
              style={[styles.filterText, filters.force === item && styles.filterTextActive]}
            >
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* 💪 Cấp độ (level) */}
      <Text style={styles.sectionTitle}>Cấp độ (Level)</Text>
      <View style={styles.filterRow}>
        {["beginner", "intermediate", "advanced"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[styles.filterButton, filters.level === item && styles.filterButtonActive]}
            onPress={() =>
              setFilters({ ...filters, level: filters.level === item ? "" : item })
            }
          >
            <Text
              style={[styles.filterText, filters.level === item && styles.filterTextActive]}
            >
              {item.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ⚙️ Mechanic */}
      <Text style={styles.sectionTitle}>Cơ chế (Mechanic)</Text>
      <TextInput
        placeholder="Ví dụ: compound, isolation..."
        placeholderTextColor="#A0AEC0"
        value={filters.mechanic}
        onChangeText={(text) => setFilters({ ...filters, mechanic: text })}
        style={styles.input}
      />

      {/* 🏋️ Equipment */}
      <Text style={styles.sectionTitle}>Dụng cụ (Equipment)</Text>
      <TextInput
        placeholder="Ví dụ: barbell, dumbbell..."
        placeholderTextColor="#A0AEC0"
        value={filters.equipment}
        onChangeText={(text) => setFilters({ ...filters, equipment: text })}
        style={styles.input}
      />

      {/* 💪 Cơ chính (Primary Muscles) */}
      <Text style={styles.sectionTitle}>Cơ chính (Primary Muscles)</Text>
      <TextInput
        placeholder="Ví dụ: chest, legs..."
        placeholderTextColor="#A0AEC0"
        value={filters.primaryMuscles}
        onChangeText={(text) => setFilters({ ...filters, primaryMuscles: text })}
        style={styles.input}
      />

      {/* 🧩 Danh mục (Category) */}
      <Text style={styles.sectionTitle}>Danh mục (Category)</Text>
      <TextInput
        placeholder="Ví dụ: strength, cardio..."
        placeholderTextColor="#A0AEC0"
        value={filters.category}
        onChangeText={(text) => setFilters({ ...filters, category: text })}
        style={styles.input}
      />

      {/* 🕒 Sắp xếp (Sort) */}
      <Text style={styles.sectionTitle}>Sắp xếp (Sort)</Text>
      <TextInput
        placeholder="Ví dụ: createdAt:desc, name:asc"
        placeholderTextColor="#A0AEC0"
        value={filters.sort}
        onChangeText={(text) => setFilters({ ...filters, sort: text })}
        style={styles.input}
      />

      {/* 📄 Phân trang */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Text style={styles.sectionTitle}>Trang (Page)</Text>
          <TextInput
            placeholder="1"
            keyboardType="numeric"
            value={filters.page}
            onChangeText={(text) => setFilters({ ...filters, page: text })}
            style={styles.input}
          />
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Text style={styles.sectionTitle}>Giới hạn (Limit)</Text>
          <TextInput
            placeholder="10"
            keyboardType="numeric"
            value={filters.limit}
            onChangeText={(text) => setFilters({ ...filters, limit: text })}
            style={styles.input}
          />
        </View>
      </View>

      {/* 🔄 Làm mới */}
      <TouchableOpacity onPress={() => getExercisesQuery.refetch()} style={styles.refreshButton}>
        <Ionicons name="refresh" size={18} color="#fff" />
        <Text style={styles.refreshText}>Làm mới danh sách</Text>
      </TouchableOpacity>

      {/* 📋 Hiển thị danh sách */}
      {getExercisesQuery.isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2B6CB0" />
          <Text style={{ color: "#2B6CB0", marginTop: 5 }}>Đang tải bài tập...</Text>
        </View>
      ) : (
        <View style={styles.exerciseList}>
          {exercises.length === 0 ? (
            <Text style={styles.emptyText}>Không có bài tập nào phù hợp.</Text>
          ) : (
            exercises.map((item: Exercise, idx: number) => (
              <View key={idx} style={styles.card}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                {item.level && <Text style={styles.exerciseInfo}>Cấp độ: {item.level}</Text>}
                {item.force && <Text style={styles.exerciseInfo}>Lực: {item.force}</Text>}
                {item.category && (
                  <Text style={styles.exerciseInfo}>Danh mục: {item.category}</Text>
                )}
                <Text style={styles.dateText}>
                  Cập nhật:{" "}
                  {item.updatedAt
                    ? new Date(item.updatedAt).toLocaleDateString()
                    : "Không rõ"}
                </Text>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F7FAFC" },
  content: { padding: 16, paddingBottom: 100 },
  header: { fontSize: 22, fontWeight: "700", color: "#2B6CB0", textAlign: "center", marginBottom: 16 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderColor: "#BEE3F8",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  searchInput: { flex: 1, height: 40, color: "#2D3748" },
  sectionTitle: { color: "#2B6CB0", fontWeight: "600", fontSize: 16, marginVertical: 6 },
  filterRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  filterButton: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#E3F2FD",
    paddingVertical: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#90CAF9",
  },
  filterButtonActive: { backgroundColor: "#2B6CB0", borderColor: "#2B6CB0" },
  filterText: { color: "#2B6CB0", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  input: {
    backgroundColor: "#fff",
    borderColor: "#BEE3F8",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#2D3748",
    marginBottom: 12,
  },
  refreshButton: {
    backgroundColor: "#2B6CB0",
    borderRadius: 12,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  refreshText: { color: "#fff", fontWeight: "600", marginLeft: 8 },
  loadingContainer: { alignItems: "center", marginTop: 20 },
  exerciseList: { marginTop: 10 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 5,
    borderLeftColor: "#63B3ED",
  },
  exerciseName: { fontSize: 18, fontWeight: "700", color: "#2D3748" },
  exerciseInfo: { color: "#4A5568", marginTop: 4 },
  dateText: { color: "#718096", fontSize: 12, marginTop: 6 },
  emptyText: { textAlign: "center", color: "#718096", fontSize: 16, marginTop: 20 },
});

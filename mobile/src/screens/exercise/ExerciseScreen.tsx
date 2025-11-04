import React, { useState, useEffect } from "react";
import { ScrollView, View , Image, LayoutAnimation } from "react-native";
import {
  Text,
  Button,
  Chip,
  TextInput,
  ActivityIndicator,
  Card,
  Divider,
  Modal,
  Portal,
  Provider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useExercise } from "../exercise/hooks/useExercise";
import { Exercise } from "../exercise/services/exercise.service";

// Định nghĩa type riêng cho filters
type Filters = {
  q: string;
  force: string;
  level: string;
  mechanic: string;
  equipment: string;
  primaryMuscles: string;
  category: string;
  sort: string;
  page: string;
  limit: string;
};

export default function ExerciseScreen() {
  const [filters, setFilters] = useState<Filters>({
    q: "",
    force: "",
    level: "",
    mechanic: "",
    equipment: "",
    primaryMuscles: "",
    category: "",
    sort: "",
    page: "1",
    limit: "10",
  });

  const { getExercisesQuery } = useExercise(filters);

  useEffect(() => {
    getExercisesQuery.refetch();
  }, [filters]);

  const exercises =
    ((getExercisesQuery as any)?.data?.data?.items as Exercise[]) || [];

  // Dùng keyof Filters để an toàn khi index
  type FilterKey = keyof Filters;
  const toggleFilter = (field: FilterKey, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };

  const nextPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: (parseInt(prev.page) + 1).toString(),
    }));
  };

  const prevPage = () => {
    setFilters((prev) => ({
      ...prev,
      page: Math.max(1, parseInt(prev.page) - 1).toString(),
    }));
  };

  const goHome = () => {
    setFilters({
      q: "",
      force: "",
      level: "",
      mechanic: "",
      equipment: "",
      primaryMuscles: "",
      category: "",
      sort: "",
      page: "1",
      limit: "10",
    });
  };

  const chipRowStyle = {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  };

  const sectionTitleStyle = {
    textAlign: "center" as const,
    marginBottom: 6,
    color: "#1E88E5",
    fontWeight: "bold" as const,
  };

  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
  };




  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <View style={{ padding: 16, paddingBottom: 100 }}>
        <Text
          variant="headlineMedium"
          style={{
            textAlign: "center",
            color: "#1E88E5",
            fontWeight: "bold",
            marginBottom: 16,
          }}
        >
          Danh sách Bài Tập
        </Text>

        {/* 🔽 Nút bật/tắt bộ lọc */}
        <Button
          mode="contained-tonal"
          icon={showFilters ? "filter-minus" : "filter"}
          onPress={toggleFilters}
          style={{
            marginBottom: 16,
            backgroundColor: "#E3F2FD",
            borderRadius: 10,
          }}
          textColor="#0D47A1"
        >
          {showFilters ? "Ẩn bộ lọc" : "Hiển thị bộ lọc"}
        </Button>

        {/* 🧩 Bộ lọc ẩn/hiện */}
        {showFilters && (
          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 12,
              padding: 12,
              marginBottom: 16,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}
          >
            {/* 🔍 Search */}
            <TextInput
              mode="outlined"
              label="Tìm kiếm theo tên"
              value={filters.q}
              onChangeText={(text) => setFilters({ ...filters, q: text })}
              left={<TextInput.Icon icon="magnify" />}
              style={{ marginBottom: 16, backgroundColor: "#fff" }}
              outlineColor="#BBDEFB"
              activeOutlineColor="#1E88E5"
            />

            {/* ⚡ Force */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Lực tác động (Force)
            </Text>
            <View style={chipRowStyle}>
              {["push", "pull", "static"].map((item) => (
                <Chip
                  key={item}
                  selected={filters.force === item}
                  onPress={() => toggleFilter("force", item)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor:
                      filters.force === item ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.force === item ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {item.toUpperCase()}
                </Chip>
              ))}
            </View>

            {/* 💪 Level */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Cấp độ (Level)
            </Text>
            <View style={chipRowStyle}>
              {["beginner", "intermediate", "advanced"].map((item) => (
                <Chip
                  key={item}
                  selected={filters.level === item}
                  onPress={() => toggleFilter("level", item)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor:
                      filters.level === item ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.level === item ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {item.toUpperCase()}
                </Chip>
              ))}
            </View>

            {/* ⚙️ Mechanic */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Cơ chế (Mechanic)
            </Text>
            <View style={chipRowStyle}>
              {["compound", "isolation"].map((item) => (
                <Chip
                  key={item}
                  selected={filters.mechanic === item}
                  onPress={() => toggleFilter("mechanic", item)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor:
                      filters.mechanic === item ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.mechanic === item ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {/* 🏋️ Equipment */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Dụng cụ (Equipment)
            </Text>
            <View style={chipRowStyle}>
              {["barbell", "dumbbell", "machine", "body only"].map((item) => (
                <Chip
                  key={item}
                  selected={filters.equipment === item}
                  onPress={() => toggleFilter("equipment", item)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor:
                      filters.equipment === item ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.equipment === item ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {/* 💪 Primary Muscles */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Cơ chính (Primary Muscles)
            </Text>
            <View style={chipRowStyle}>
              {["chest", "legs", "arms", "back", "shoulders"].map((item) => (
                <Chip
                  key={item}
                  selected={filters.primaryMuscles === item}
                  onPress={() => toggleFilter("primaryMuscles", item)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor:
                      filters.primaryMuscles === item ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.primaryMuscles === item ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {/* 🧩 Category */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Danh mục (Category)
            </Text>
            <View style={chipRowStyle}>
              {["strength", "cardio", "powerlifting", "stretching"].map((item) => (
                <Chip
                  key={item}
                  selected={filters.category === item}
                  onPress={() => toggleFilter("category", item)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor:
                      filters.category === item ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.category === item ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {item}
                </Chip>
              ))}
            </View>

            {/* 🕒 Sort */}
            <Text variant="titleMedium" style={sectionTitleStyle}>
              Sắp xếp (Sort)
            </Text>
            <View style={chipRowStyle}>
              {[
                { label: "Tên (A–Z)", value: "name:asc" },
                { label: "Tên (Z–A)", value: "name:desc" },
              ].map(({ label, value }) => (
                <Chip
                  key={value}
                  selected={filters.sort === value}
                  onPress={() => toggleFilter("sort", value)}
                  showSelectedCheck={false}
                  style={{
                    margin: 4,
                    backgroundColor: filters.sort === value ? "#64B5F6" : "#E3F2FD",
                  }}
                  textStyle={{
                    color: filters.sort === value ? "#fff" : "#0D47A1",
                    fontWeight: "600",
                  }}
                >
                  {label}
                </Chip>
              ))}
            </View>

          </View>
        )}

        {/* 🔄 Refresh */}
        <Button
          mode="contained"
          icon="refresh"
          onPress={() => getExercisesQuery.refetch()}
          style={{
            borderRadius: 10,
            marginBottom: 16,
            backgroundColor: "#42A5F5",
          }}
        >
          Làm mới danh sách
        </Button>

        {/* 🔙 Navigation Buttons */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <Button
            mode="outlined"
            onPress={prevPage}
            icon="chevron-left"
            style={{
              borderColor: "#1E88E5",
              marginHorizontal: 6,
            }}
            textColor="#1E88E5"
            disabled={parseInt(filters.page) <= 1}
          >
            Trước
          </Button>

          <Button
            mode="contained"
            icon="home"
            onPress={goHome}
            style={{
              borderRadius: 10,
              marginHorizontal: 6,
              backgroundColor: "#64B5F6",
            }}
          >
            Trang chủ
          </Button>

          <Button
            mode="outlined"
            onPress={nextPage}
            icon="chevron-right"
            contentStyle={{ flexDirection: "row-reverse" }}
            style={{
              borderColor: "#1E88E5",
              marginHorizontal: 6,
            }}
            textColor="#1E88E5"
          >
            Tiếp
          </Button>
        </View>

        {/* 📋 Exercise List */}
        {getExercisesQuery.isLoading ? (
          <View style={{ alignItems: "center", marginTop: 20 }}>
            <ActivityIndicator animating={true} color="#1E88E5" />
            <Text style={{ marginTop: 8 }}>Đang tải bài tập...</Text>
          </View>
        ) : (
          <View>
            {exercises.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#777", fontSize: 16 }}>
                Không có bài tập nào phù hợp.
              </Text>
            ) : (
              exercises.map((item: Exercise, idx: number) => (
                <Card
                  key={idx}
                  style={{
                    marginBottom: 12,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 12,
                  }}
                >
                  <Card.Title
                    title={item.name}
                    titleVariant="titleLarge"
                    subtitle={`Cấp độ: ${item.level || "?"}`}
                    left={(props) => (
                      <Ionicons
                        {...props}
                        name="barbell-outline"
                        size={26}
                        color="#1E88E5"
                      />
                    )}
                  />
                  <Card.Content>
                    {item.force && <Text>Lực: {item.force}</Text>}
                    {item.category && <Text>Danh mục: {item.category}</Text>}
                    <Divider style={{ marginVertical: 6 }} />
                    <Text style={{ fontSize: 12, color: "#666" }}>
                      Cập nhật:{" "}
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleDateString()
                        : "Không rõ"}
                    </Text>
                  </Card.Content>
                </Card>
              ))
            )}
          </View>
        )}

        {/* 🏠 Back to Home Button */}
        <Button
          mode="contained"
          icon="home"
          onPress={goHome}
          style={{
            borderRadius: 12,
            marginTop: 20,
            backgroundColor: "#64B5F6",
            alignSelf: "center",
            width: "60%",
          }}
        >
          Quay lại Trang Chủ
        </Button>
      </View>
    </ScrollView>
  );
}



import React, { useState, useEffect, useCallback } from "react";
import {
  FlatList,
  View,
  Image,
  LayoutAnimation,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  RefreshControl,
  ScrollView,
} from "react-native";
import {
  Text,
  Button,
  Chip,
  TextInput,
  ActivityIndicator,
  Card,
  Divider,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useExercise } from "../exercise/hooks/useExercise";
import { Exercise } from "../exercise/services/exercise.service";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation<any>();

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

  const apiFilters = {
    ...filters,
    page: Number(filters.page),
    limit: Number(filters.limit),
  } as any;

  const { getExercisesQuery } = useExercise(apiFilters);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [allExercises, setAllExercises] = useState<Exercise[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const preURL = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

  const currentPageExercises = ((getExercisesQuery as any)?.data?.items as Exercise[]) || [];
  const totalItems = (getExercisesQuery as any)?.data?.total || 0;
  const currentPage = Number(filters.page);
  const hasMore = currentPage * Number(filters.limit) < totalItems;

  // Khi filter thay đổi, reset về trang 1 và xóa data cũ
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: "1" }));
    setAllExercises([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filters.q,
    filters.force,
    filters.level,
    filters.mechanic,
    filters.equipment,
    filters.primaryMuscles,
    filters.category,
    filters.sort,
  ]);

  // Khi có data mới từ API, append vào list
  useEffect(() => {
    if (currentPageExercises.length > 0) {
      if (currentPage === 1) {
        setAllExercises(currentPageExercises);
      } else {
        setAllExercises((prev) => {
          // Tránh duplicate
          const existingIds = new Set(prev.map((e) => e._id));
          const newItems = currentPageExercises.filter((e) => !existingIds.has(e._id));
          return [...prev, ...newItems];
        });
      }
    }
    setIsLoadingMore(false);
    setRefreshing(false);
  }, [currentPageExercises]);

  const toggleFilter = (field: keyof Filters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field] === value ? "" : value,
    }));
  };


  const openModal = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowModal(true);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedExercise(null);
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
  };

  const handleLoadMore = useCallback(() => {
    if (!isLoadingMore && !getExercisesQuery.isLoading && hasMore) {
      setIsLoadingMore(true);
      setFilters((prev) => ({
        ...prev,
        page: (Number(prev.page) + 1).toString(),
      }));
    }
  }, [isLoadingMore, getExercisesQuery.isLoading, hasMore]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setAllExercises([]);
    setFilters((prev) => ({ ...prev, page: "1" }));
    getExercisesQuery.refetch();
  }, []);

  const chipRow = {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
    marginBottom: 12,
  };

  const sectionTitle = {
    textAlign: "center" as const,
    marginBottom: 6,
    color: "#1E88E5",
    fontWeight: "bold" as const,
  };

  const renderHeader = () => (
    <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
      {/* Title */}
      <View style={{ marginBottom: 16 }}>
        <Text
          variant="headlineMedium"
          style={{
            textAlign: "center",
            color: "#003366",
            fontWeight: "bold",
          }}
        >
          Exercise List
        </Text>
      </View>

      {/* Hiển thị/ẩn bộ lọc */}
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
        {showFilters ? "Hide Filters" : "Show Filters"}
      </Button>

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
            maxHeight: 450,
          }}
        >
          <ScrollView 
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
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

              {/* Force */}
              <Text variant="titleMedium" style={sectionTitle}>
                
                Force
              </Text>
              <View style={chipRow}>
                {["push", "pull", "static"].map((item) => (
                  <Chip
                    key={item}
                    selected={filters.force === item}
                    showSelectedCheck={false}
                    onPress={() => toggleFilter("force", item)}
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

              {/* Level */}
              <Text variant="titleMedium" style={sectionTitle}>
                
                Level
              </Text>
              <View style={chipRow}>
                {["beginner", "intermediate", "advanced"].map((lvl) => (
                  <Chip
                    key={lvl}
                    selected={filters.level === lvl}
                    showSelectedCheck={false}
                    onPress={() => toggleFilter("level", lvl)}
                    style={{
                      margin: 4,
                      backgroundColor:
                        filters.level === lvl ? "#64B5F6" : "#E3F2FD",
                    }}
                    textStyle={{
                      color: filters.level === lvl ? "#fff" : "#0D47A1",
                      fontWeight: "600",
                    }}
                  >
                    {lvl}
                  </Chip>
                ))}
              </View>

              {/* Mechanic */}
              <Text variant="titleMedium" style={sectionTitle}>
                
                Mechanic
              </Text>
              <View style={chipRow}>
                {["compound", "isolation"].map((m) => (
                  <Chip
                    key={m}
                    selected={filters.mechanic === m}
                    showSelectedCheck={false}
                    onPress={() => toggleFilter("mechanic", m)}
                    style={{
                      margin: 4,
                      backgroundColor:
                        filters.mechanic === m ? "#64B5F6" : "#E3F2FD",
                    }}
                    textStyle={{
                      color: filters.mechanic === m ? "#fff" : "#0D47A1",
                      fontWeight: "600",
                    }}
                  >
                    {m}
                  </Chip>
                ))}
              </View>

              {/* Equipment */}
              <Text variant="titleMedium" style={sectionTitle}>
               
                Equipment
              </Text>
              <View style={chipRow}>
                {["barbell", "dumbbell", "machine", "body only", "cable"].map((e) => (
                  <Chip
                    key={e}
                    selected={filters.equipment === e}
                    showSelectedCheck={false}
                    onPress={() => toggleFilter("equipment", e)}
                    style={{
                      margin: 4,
                      backgroundColor:
                        filters.equipment === e ? "#64B5F6" : "#E3F2FD",
                    }}
                    textStyle={{
                      color: filters.equipment === e ? "#fff" : "#0D47A1",
                      fontWeight: "600",
                    }}
                  >
                    {e}
                  </Chip>
                ))}
              </View>

              {/* Primary Muscles */}
              <Text variant="titleMedium" style={sectionTitle}>
              
                Primary Muscles
              </Text>
              <View style={chipRow}>
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

              {/* Category */}
              <Text variant="titleMedium" style={sectionTitle}>
                
                Category
              </Text>
              <View style={chipRow}>
                {["strength", "cardio", "stretching"].map((cat) => (
                  <Chip
                    key={cat}
                    selected={filters.category === cat}
                    showSelectedCheck={false}
                    onPress={() => toggleFilter("category", cat)}
                    style={{
                      margin: 4,
                      backgroundColor:
                        filters.category === cat ? "#64B5F6" : "#E3F2FD",
                    }}
                    textStyle={{
                      color: filters.category === cat ? "#fff" : "#0D47A1",
                      fontWeight: "600",
                    }}
                  >
                    {cat}
                  </Chip>
                ))}
              </View>

              {/* Sort */}
              <Text variant="titleMedium" style={sectionTitle}>
                Alphabet
              </Text>
              <View style={chipRow}>
                {["name:asc", "name:desc"].map((s) => (
                  <Chip
                    key={s}
                    selected={filters.sort === s}
                    showSelectedCheck={false}
                    onPress={() => toggleFilter("sort", s)}
                    style={{
                      margin: 4,
                      backgroundColor: filters.sort === s ? "#64B5F6" : "#E3F2FD",
                    }}
                    textStyle={{
                      color: filters.sort === s ? "#fff" : "#0D47A1",
                      fontWeight: "600",
                    }}
                  >
                    {s === "name:asc" ? "A → Z" : "Z → A"}
                  </Chip>
                ))}
              </View>
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity onPress={() => openModal(item)}>
      <Card
        style={{
          marginBottom: 12,
          marginHorizontal: 16,
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
          {item.force && <Text>Force: {item.force}</Text>}
          {item.category && <Text>Category: {item.category}</Text>}
          <Divider style={{ marginVertical: 6 }} />
          <Text style={{ fontSize: 12, color: "#666" }}>
            Updated:{" "}
            {item.updatedAt
              ? new Date(item.updatedAt).toLocaleDateString()
              : "None"}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 20, alignItems: "center" }}>
        <ActivityIndicator animating={true} color="#1E88E5" size="large" />
        <Text style={{ marginTop: 8, color: "#666" }}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (getExercisesQuery.isLoading && currentPage === 1) {
      return (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <ActivityIndicator animating={true} color="#1E88E5" size="large" />
          <Text style={{ marginTop: 8 }}>Loading exercises...</Text>
        </View>
      );
    }
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text style={{ textAlign: "center", color: "#777", fontSize: 16 }}>
          No exercises are suitable.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <FlatList
        data={allExercises}
        renderItem={renderExerciseItem}
        keyExtractor={(item, index) => item._id || `exercise-${index}`}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={["#1E88E5"]}
            tintColor="#1E88E5"
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />


      {/* Popup chi tiết */}
      <Modal
        visible={showModal}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.7)",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
              maxHeight: "90%",
            }}
          >
            <FlatList
              data={selectedExercise ? [selectedExercise] : []}
              keyExtractor={() => "modal-content"}
              renderItem={() => (
                <>
                  {selectedExercise && (
                    <>
                      <Text
                        style={{
                          fontSize: 22,
                          fontWeight: "bold",
                          textAlign: "center",
                          marginBottom: 10,
                        }}
                      >
                        {selectedExercise.name}
                      </Text>

                      {selectedExercise.gif && (
                        <Image
                          source={{ uri: selectedExercise.gif }}
                          style={{
                            width: "100%",
                            height: 250,
                            borderRadius: 10,
                            marginBottom: 10,
                          }}
                          resizeMode="cover"
                        />
                      )}

                      <Text>Force: {selectedExercise.force || "?"}</Text>
                      <Text>Level: {selectedExercise.level || "?"}</Text>
                      <Text>Category: {selectedExercise.category || "?"}</Text>

                      <Text style={{ fontWeight: "bold", marginTop: 10 }}>
                        Instructions:
                      </Text>
                      {(selectedExercise.instructions || []).map((ins: any, i: number) => (
                        <Text key={i}>• {ins}</Text>
                      ))}

                      <Text style={{ fontWeight: "bold", marginTop: 10 }}>Images:</Text>
                      <View
                        style={{
                          flexDirection: "row",
                          flexWrap: "wrap",
                          justifyContent: "center",
                        }}
                      >
                        {(selectedExercise.images || []).map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: `${preURL}${img}` }}
                            style={{
                              width: 100,
                              height: 100,
                              margin: 5,
                              borderRadius: 10,
                            }}
                          />
                        ))}
                      </View>

                      <Button
                        mode="contained"
                        onPress={closeModal}
                        style={{
                          marginTop: 20,
                          backgroundColor: "#003366",
                          borderRadius: 10,
                        }}
                      >
                        Close
                      </Button>
                    </>
                  )}
                </>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}


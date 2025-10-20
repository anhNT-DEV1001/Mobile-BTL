import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { getAssignments } from "../services/api";

interface Assignment {
  _id: string;
  project?: { name: string };
  participant?: { fullName: string };
  joinedAt: string;
}

export default function AssignmentList() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    const res = await getAssignments();
    setAssignments(res.data.data || res.data);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={assignments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 12, padding: 10, borderWidth: 1, borderRadius: 8 }}>
            <Text>Tên dự án: {item.project?.name}</Text>
            <Text>Người tham gia: {item.participant?.fullName}</Text>
            <Text>Ngày tham gia: {new Date(item.joinedAt).toLocaleDateString()}</Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => router.push("/add-assignment")}
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: "#6200ee",
          padding: 16,
          borderRadius: 50,
        }}
      >
        <Text style={{ color: "white", fontSize: 18 }}>＋</Text>
      </TouchableOpacity>
    </View>
  );
}

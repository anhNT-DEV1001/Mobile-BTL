import { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { getProjects, api } from "../services/api";
interface Participant {
  participant: {
    _id: string;
    fullName: string;
    roles: string[];
  };
  joinedAt: string;
}

export default function Statistics() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [members, setMembers] = useState<Participant[]>([]);

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data));
  }, []);

  const fetchMembers = async (projectId: string) => {
    const res = await api.get(`/projects/${projectId}/participants`);
    setMembers(res.data);
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Chọn dự án để xem thống kê:</Text>
      <Picker
        selectedValue={selectedProject}
        onValueChange={(value) => {
          setSelectedProject(value);
          if (value) fetchMembers(value);
        }}
      >
        <Picker.Item label="-- Chọn dự án --" value="" />
        {projects.map((p: any) => (
          <Picker.Item key={p._id} label={p.name} value={p._id} />
        ))}
      </Picker>

      <FlatList
        data={members}
        keyExtractor={(item) => item.participant._id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderWidth: 1, marginVertical: 4, borderRadius: 8 }}>
            <Text>{item.participant.fullName}</Text>
            <Text>{item.participant.roles.join(", ")}</Text>
            <Text>Ngày tham gia: {new Date(item.joinedAt).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </View>
  );
}

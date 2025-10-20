import { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getProjects, getParticipants, createAssignment } from "../services/api";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";

export default function AddAssignment() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [joinedAt, setJoinedAt] = useState(new Date());

  useEffect(() => {
    getProjects().then((res) => setProjects(res.data));
    getParticipants().then((res) => setParticipants(res.data));
  }, []);

  const handleSubmit = async () => {
    if (!selectedProject || !selectedParticipant) {
      Alert.alert("Thiếu dữ liệu", "Hãy chọn đầy đủ thông tin");
      return;
    }
    await createAssignment({
      projectId: selectedProject,
      participantId: selectedParticipant,
      joinedAt,
    });
    Alert.alert("Thành công", "Tạo mới thành công", [{ text: "OK", onPress: () => router.back() }]);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Chọn dự án:</Text>
      <Picker 
        selectedValue={selectedProject} 
        onValueChange={setSelectedProject}
        style={{ color: 'black' }}>
        <Picker.Item label="-- Chọn dự án --" value="" color="black" />
        {projects.map((p: any) => (
          <Picker.Item key={p._id} label={p.name} value={p._id} color="black" />
        ))}
      </Picker>

      <Text>Chọn người tham gia:</Text>
      <Picker 
        selectedValue={selectedParticipant} 
        onValueChange={setSelectedParticipant}
        style={{ color: 'black' }}>
        <Picker.Item label="-- Chọn người tham gia --" value="" color="black" />
        {participants.map((p: any) => (
          <Picker.Item key={p._id} label={p.fullName} value={p._id} color="black" />
        ))}
      </Picker>

      <Text>Ngày tham gia:</Text>
      <DateTimePicker
        value={joinedAt}
        mode="date"
        onChange={(e, date) => setJoinedAt(date || joinedAt)}
      />

      <Button title="Tạo mới" onPress={handleSubmit} />
    </View>
  );
}

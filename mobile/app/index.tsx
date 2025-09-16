import { Text, View } from "react-native";
import { API_URL } from '@env';

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen {API_URL}.</Text>
    </View>
  );
}

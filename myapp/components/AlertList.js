import { View, Text } from "react-native";

export default function AlertList({ alerts }) {
  return (
    <View>
      <Text style={{ fontSize: 18 }}>Alerts</Text>

      {alerts.map((a, i) => (
        <View key={i} style={{ padding: 10, backgroundColor: "#ffdddd", margin: 5 }}>
          <Text>🚨 {a.msg}</Text>
        </View>
      ))}
    </View>
  );
}
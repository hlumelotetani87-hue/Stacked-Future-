import { View, Pressable, Text } from "react-native";
import { useTradingStore } from "@/store/trading-store";

export default function AcctToggle() {
  const { mode, setMode } = useTradingStore();
  return (
    <View className="flex-row bg-card2 rounded-full p-0.5">
      <Pressable
        className={`px-3 py-1 rounded-full ${mode === "real" ? "bg-accent" : ""}`}
        onPress={() => setMode("real")}
      >
        <Text className={`text-[10px] font-semibold ${mode === "real" ? "text-bg" : "text-muted"}`}>
          Real
        </Text>
      </Pressable>
      <Pressable
        className={`px-3 py-1 rounded-full ${mode === "demo" ? "bg-demo" : ""}`}
        onPress={() => setMode("demo")}
      >
        <Text className={`text-[10px] font-semibold ${mode === "demo" ? "text-bg" : "text-muted"}`}>
          Demo
        </Text>
      </Pressable>
    </View>
  );
}

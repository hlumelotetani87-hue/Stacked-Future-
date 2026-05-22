import { useSSO } from "@clerk/expo";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function SSOCallback() {
  const { handleRedirectCallback } = useSSO();
  useEffect(() => { handleRedirectCallback(); }, []);
  return (
    <View className="flex-1 bg-bg items-center justify-center">
      <ActivityIndicator color="#a5b4fc" size="large" />
    </View>
  );
}

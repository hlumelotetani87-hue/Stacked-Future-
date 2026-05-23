import { View, Text, Pressable } from "react-native";
import { useTradingStore } from "@/store/trading-store";
import { Linking } from "react-native";

type Props = {
  feature: string;
  children: React.ReactNode;
};

const LEMON_URL = "https://stackedfuture.lemonsqueezy.com"; // update with real store URL

export default function ProGate({ feature, children }: Props) {
  const { tier } = useTradingStore();
  if (tier === "pro" || tier === "pro_lifetime") return <>{children}</>;

  return (
    <View className="flex-1 items-center justify-center p-6">
      <View className="bg-card rounded-2xl p-6 border border-border w-full">
        <Text className="text-white text-base font-semibold mb-1">Pro feature</Text>
        <Text className="text-muted text-sm mb-4">{feature} requires a Pro subscription.</Text>
        <Pressable
          className="bg-accent rounded-xl py-3 items-center active:opacity-80"
          onPress={() => Linking.openURL(LEMON_URL)}
        >
          <Text className="text-bg font-semibold text-sm">Upgrade to Pro</Text>
        </Pressable>
      </View>
    </View>
  );
}

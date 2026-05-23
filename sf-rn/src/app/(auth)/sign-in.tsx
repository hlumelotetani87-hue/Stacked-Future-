import useSocialAuth from "@/hooks/useSocialAuth";
import { Pressable, Text, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SignInScreen() {
  const { handleSocialAuth, loadingStrategy } = useSocialAuth();
  const isLoading = !!loadingStrategy;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top", "bottom"]}>
      {/* Logo */}
      <View className="flex-1 justify-end pb-8">
        <View className="items-center mb-10">
          <Text className="text-4xl font-bold text-white tracking-tight">
            Stacked Future
          </Text>
          <Text className="text-xs text-accent2 tracking-[3px] uppercase mt-1">
            AI Trading Signals
          </Text>
        </View>

        {/* Auth card */}
        <View className="mx-5 bg-white/[0.04] rounded-2xl border border-white/[0.08] p-6">
          <Text className="text-xl font-bold text-white mb-1">Welcome</Text>
          <Text className="text-sm text-muted mb-5">Sign in to continue</Text>

          {/* Google */}
          <Pressable
            className={`flex-row items-center justify-center bg-white rounded-xl py-3.5 mb-3 gap-2 ${isLoading ? "opacity-60" : "active:opacity-80"}`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_google")}
          >
            {loadingStrategy === "oauth_google" ? (
              <ActivityIndicator color="#000" size="small" />
            ) : (
              <Text className="text-base font-semibold text-black">Continue with Google</Text>
            )}
          </Pressable>

          {/* Apple */}
          <Pressable
            className={`flex-row items-center justify-center bg-black border border-[#333] rounded-xl py-3.5 mb-0 gap-2 ${isLoading ? "opacity-60" : "active:opacity-80"}`}
            disabled={isLoading}
            onPress={() => handleSocialAuth("oauth_apple")}
          >
            {loadingStrategy === "oauth_apple" ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-base font-semibold text-white">Continue with Apple</Text>
            )}
          </Pressable>

          <Text className="text-center text-xs text-[#333] mt-4 leading-5">
            By continuing you agree to our{" "}
            <Text className="text-accent2">Terms</Text> &{" "}
            <Text className="text-accent2">Privacy Policy</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

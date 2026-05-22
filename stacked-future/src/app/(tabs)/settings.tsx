import { View, Text, ScrollView, Pressable, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth, useUser } from "@clerk/expo";
import { useLicence } from "@/hooks/useLicence";

const LEMON_URL = "https://stackedfuture.lemonsqueezy.com";

type RowProps = {
  icon: string;
  iconBg: string;
  title: string;
  sub?: string;
  onPress?: () => void;
  right?: React.ReactNode;
  titleColor?: string;
};

function SettingsRow({ icon, iconBg, title, sub, onPress, right, titleColor }: RowProps) {
  return (
    <Pressable
      className="flex-row items-center px-3.5 py-3 border-t border-[#1a1d2a] first:border-t-0 active:opacity-70"
      onPress={onPress}
      disabled={!onPress}
    >
      <View className={`w-7 h-7 rounded-lg items-center justify-center mr-3 ${iconBg}`}>
        <Text>{icon}</Text>
      </View>
      <View className="flex-1">
        <Text className={`text-sm ${titleColor ?? "text-white"}`}>{title}</Text>
        {sub && <Text className="text-[11px] text-muted mt-0.5">{sub}</Text>}
      </View>
      {right ?? <Text className="text-muted2 text-base">›</Text>}
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const { tier, isPro } = useLicence();

  const initials = (user?.fullName ?? user?.emailAddresses?.[0]?.emailAddress ?? "?")
    .split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-bold text-white tracking-tight">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View className="mx-4 mb-4 bg-card rounded-2xl border border-border p-4 flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-accent2 items-center justify-center">
            <Text className="text-white text-base font-bold">{initials}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-white">{user?.fullName ?? "—"}</Text>
            <Text className="text-[12px] text-muted mt-0.5">{user?.emailAddresses?.[0]?.emailAddress}</Text>
            <View className="bg-accent/10 border border-accent/20 rounded-full px-2 py-0.5 mt-1 self-start">
              <Text className="text-[10px] text-accent capitalize">{tier} plan</Text>
            </View>
          </View>
          <Text className="text-muted2 text-base">›</Text>
        </View>

        {/* Pro upgrade banner (free users only) */}
        {!isPro && (
          <Pressable
            className="mx-4 mb-4 bg-accent2/10 border border-accent2/30 rounded-2xl p-4 active:opacity-80"
            onPress={() => Linking.openURL(LEMON_URL)}
          >
            <Text className="text-white text-sm font-semibold mb-1">Upgrade to Pro ✦</Text>
            <Text className="text-muted text-xs leading-5">Unlock all timeframes, confidence scores, full forecast, unlimited watchlist symbols and paper trading history.</Text>
            <View className="bg-accent rounded-lg mt-3 py-2.5 items-center">
              <Text className="text-bg text-sm font-semibold">Get Pro — $4.99/month</Text>
            </View>
          </Pressable>
        )}

        {/* Trading */}
        <Text className="text-[11px] text-muted uppercase tracking-wider px-4 mb-2">Trading</Text>
        <View className="mx-4 mb-4 bg-card rounded-2xl border border-border overflow-hidden">
          <SettingsRow icon="📡" iconBg="bg-accent2/10" title="Connect broker" sub="MetaApi · MT4/MT5" />
          <SettingsRow icon="🕐" iconBg="bg-bull/10" title="Default timeframe" sub="1 hour" />
          <SettingsRow icon="💰" iconBg="bg-[#fbbf24]/10" title="Paper balance" sub="$10,000.00" />
        </View>

        {/* Notifications */}
        <Text className="text-[11px] text-muted uppercase tracking-wider px-4 mb-2">Notifications</Text>
        <View className="mx-4 mb-4 bg-card rounded-2xl border border-border overflow-hidden">
          <SettingsRow icon="🔔" iconBg="bg-accent/10" title="Signal alerts" sub="Push notifications" />
          <SettingsRow icon="%" iconBg="bg-bear/10" title="Min. confidence" sub="Alert above 60%" />
        </View>

        {/* About */}
        <Text className="text-[11px] text-muted uppercase tracking-wider px-4 mb-2">About</Text>
        <View className="mx-4 mb-4 bg-card rounded-2xl border border-border overflow-hidden">
          <SettingsRow icon="📄" iconBg="bg-muted/10" title="Open source licenses" sub="MIT · Kronos AI · ShiYu 2025" />
          <SettingsRow icon="🔒" iconBg="bg-muted/10" title="Privacy Policy" onPress={() => Linking.openURL("https://stackedfuture.com/privacy")} />
          <SettingsRow icon="📋" iconBg="bg-muted/10" title="Terms of Service" onPress={() => Linking.openURL("https://stackedfuture.com/terms")} />
          <SettingsRow icon="ℹ️" iconBg="bg-muted/10" title="Version" sub="1.0.0" right={<View />} />
        </View>

        {/* Account */}
        <Text className="text-[11px] text-muted uppercase tracking-wider px-4 mb-2">Account</Text>
        <View className="mx-4 mb-8 bg-card rounded-2xl border border-border overflow-hidden">
          <SettingsRow
            icon="🚪"
            iconBg="bg-bear/10"
            title="Sign out"
            titleColor="text-bear"
            right={<View />}
            onPress={() =>
              Alert.alert("Sign out", "Are you sure?", [
                { text: "Cancel", style: "cancel" },
                { text: "Sign out", style: "destructive", onPress: () => signOut() },
              ])
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

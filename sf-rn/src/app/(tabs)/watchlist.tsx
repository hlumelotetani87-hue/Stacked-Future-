import { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useTradingStore } from "@/store/trading-store";
import { useLicence } from "@/hooks/useLicence";
import type { TabParamList } from "@/navigation/TabNavigator";

const CATEGORIES = ["All", "Forex", "Crypto", "Stocks", "ETFs", "Indices"];
const FREE_LIMIT = 3;

export default function WatchlistScreen() {
  const { watchlist, isLoadingWatchlist, setActiveSymbol, removeFromWatchlist } = useTradingStore();
  const { isPro } = useLicence();
  const navigation = useNavigation<BottomTabNavigationProp<TabParamList>>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filtered = watchlist.filter((item) => {
    const matchSearch =
      item.symbol.toLowerCase().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || item.category.toLowerCase() === category.toLowerCase();
    return matchSearch && matchCat;
  });

  const displayList = isPro ? filtered : filtered.slice(0, FREE_LIMIT);

  function directionColor(d?: string) {
    if (d === "buy") return { bg: "bg-bull/10", text: "text-bull", border: "border-bull/20", label: "↑ BUY" };
    if (d === "sell") return { bg: "bg-bear/10", text: "text-bear", border: "border-bear/20", label: "↓ SELL" };
    return { bg: "bg-accent/10", text: "text-accent", border: "border-accent/20", label: "◈ WATCH" };
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-1">
        <Text className="text-2xl font-bold text-white tracking-tight">Watchlist</Text>
      </View>

      {/* Search */}
      <View className="mx-4 mb-3 flex-row items-center bg-[#1c1c1e] rounded-xl px-3 py-2 gap-2">
        <Text className="text-muted text-base">🔍</Text>
        <TextInput
          className="flex-1 text-white text-sm"
          placeholder="Search symbols…"
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
          autoCapitalize="characters"
          autoCorrect={false}
        />
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-3"
        contentContainerStyle={{ gap: 6 }}
      >
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            className={`px-3 py-1.5 rounded-xl border ${
              category === c ? "bg-card2 border-border2" : "border-border bg-transparent"
            }`}
          >
            <Text className={`text-[11px] font-medium ${category === c ? "text-accent" : "text-muted"}`}>{c}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* List */}
      {isLoadingWatchlist ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#a5b4fc" />
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {displayList.length === 0 && (
            <Text className="text-muted text-center mt-10 text-sm">No symbols yet. Add some to get started.</Text>
          )}
          {displayList.map((item) => {
            const d = directionColor(item.signal);
            return (
              <Pressable
                key={item.id}
                className="flex-row items-center px-4 py-3 border-t border-[#111] active:bg-card/50"
                onPress={() => {
                  setActiveSymbol(item.symbol);
                  navigation.navigate("Chart");
                }}
              >
                <View className="w-9 h-9 rounded-full bg-card2 border border-border2 items-center justify-center mr-3">
                  <Text className="text-[10px] font-bold text-accent">{item.symbol.slice(0, 3)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-white">{item.symbol}</Text>
                  <Text className="text-[11px] text-muted mt-0.5">{item.name}</Text>
                </View>
                <View className="items-end">
                  <View className={`${d.bg} border ${d.border} rounded px-1.5 py-0.5`}>
                    <Text className={`text-[9px] font-semibold ${d.text}`}>{d.label}</Text>
                  </View>
                </View>
              </Pressable>
            );
          })}

          {!isPro && watchlist.length > FREE_LIMIT && (
            <View className="mx-4 mt-3 bg-card rounded-xl p-4 border border-border items-center">
              <Text className="text-white text-sm font-semibold mb-1">Free plan limit</Text>
              <Text className="text-muted text-xs text-center mb-3">
                Upgrade to Pro for unlimited watchlist symbols.
              </Text>
              <Pressable className="bg-accent rounded-lg px-5 py-2.5 active:opacity-80">
                <Text className="text-bg text-sm font-semibold">Upgrade to Pro</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

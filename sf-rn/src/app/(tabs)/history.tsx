import { useState, useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTradingStore } from "@/store/trading-store";
import ProGate from "@/components/ui/ProGate";
import { useLicence } from "@/hooks/useLicence";

type Tab = "signals" | "paper";

export default function HistoryScreen() {
  const [tab, setTab] = useState<Tab>("signals");
  const { paperTrades, isLoadingTrades, loadPaperTrades, closePaperTrade } = useTradingStore();
  const { isPro } = useLicence();

  useEffect(() => { loadPaperTrades(); }, []);

  const closedTrades = paperTrades.filter((t) => t.status === "closed");
  const openTrades = paperTrades.filter((t) => t.status === "open");
  const totalPnl = closedTrades.reduce((sum, t) => sum + (t.pnl ?? 0), 0);
  const wins = closedTrades.filter((t) => (t.pnl ?? 0) > 0).length;
  const winRate = closedTrades.length > 0 ? Math.round((wins / closedTrades.length) * 100) : 0;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <View className="px-4 pt-2 pb-3">
        <Text className="text-2xl font-bold text-white tracking-tight">History</Text>
      </View>

      {/* Segment control */}
      <View className="flex-row bg-[#1c1c1e] mx-4 mb-3 rounded-xl p-0.5">
        {(["signals", "paper"] as Tab[]).map((t) => (
          <Pressable
            key={t}
            className={`flex-1 py-1.5 rounded-[10px] ${tab === t ? "bg-[#2c2c2e]" : ""}`}
            onPress={() => setTab(t)}
          >
            <Text className={`text-center text-xs font-medium ${tab === t ? "text-white" : "text-muted"}`}>
              {t === "signals" ? "Signals" : "Paper trades"}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Stats strip */}
      <View className="flex-row gap-2 px-4 mb-3">
        <View className="flex-1 bg-card rounded-xl p-3 border border-border">
          <Text className="text-[9px] text-muted uppercase tracking-wider mb-1">Total</Text>
          <Text className="text-sm font-semibold text-accent">{paperTrades.length}</Text>
        </View>
        <View className="flex-1 bg-card rounded-xl p-3 border border-border">
          <Text className="text-[9px] text-muted uppercase tracking-wider mb-1">Win rate</Text>
          <Text className="text-sm font-semibold text-bull">{winRate}%</Text>
        </View>
        <View className="flex-1 bg-card rounded-xl p-3 border border-border">
          <Text className="text-[9px] text-muted uppercase tracking-wider mb-1">Paper P&L</Text>
          <Text className={`text-sm font-semibold ${totalPnl >= 0 ? "text-bull" : "text-bear"}`}>
            {totalPnl >= 0 ? "+" : ""}${totalPnl.toFixed(2)}
          </Text>
        </View>
      </View>

      {tab === "paper" && !isPro ? (
        <ProGate feature="Full paper trade history">
          <View />
        </ProGate>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {isLoadingTrades && (
            <View className="items-center mt-10">
              <ActivityIndicator color="#a5b4fc" />
            </View>
          )}

          {tab === "paper" && openTrades.length > 0 && (
            <>
              <Text className="text-[10px] text-muted uppercase tracking-wider px-4 mb-2">Open positions</Text>
              {openTrades.map((trade) => (
                <View key={trade.id} className="flex-row items-center px-4 py-3 border-t border-[#111]">
                  <View className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${trade.direction === "buy" ? "bg-bull/10" : "bg-bear/10"}`}>
                    <Text className={trade.direction === "buy" ? "text-bull" : "text-bear"}>
                      {trade.direction === "buy" ? "↑" : "↓"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white">{trade.symbol} <Text className={`text-[10px] ${trade.direction === "buy" ? "text-bull" : "text-bear"}`}>{trade.direction.toUpperCase()}</Text></Text>
                    <Text className="text-[11px] text-muted">Entry: {parseFloat(String(trade.entryPrice)).toFixed(4)} · {trade.lots} lots</Text>
                  </View>
                  <Pressable
                    className="bg-accent/10 border border-accent/20 rounded-lg px-3 py-1.5 active:opacity-70"
                    onPress={() => closePaperTrade(trade.id, parseFloat(String(trade.entryPrice)) * 1.002)}
                  >
                    <Text className="text-accent text-[11px] font-medium">Close</Text>
                  </Pressable>
                </View>
              ))}
            </>
          )}

          {tab === "paper" && closedTrades.length > 0 && (
            <>
              <Text className="text-[10px] text-muted uppercase tracking-wider px-4 mt-3 mb-2">Closed</Text>
              {closedTrades.map((trade) => (
                <View key={trade.id} className="flex-row items-center px-4 py-3 border-t border-[#111]">
                  <View className={`w-8 h-8 rounded-xl items-center justify-center mr-3 ${trade.direction === "buy" ? "bg-bull/10" : "bg-bear/10"}`}>
                    <Text className={trade.direction === "buy" ? "text-bull" : "text-bear"}>
                      {trade.direction === "buy" ? "↑" : "↓"}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-white">{trade.symbol}</Text>
                    <Text className="text-[11px] text-muted">{new Date(trade.openedAt).toLocaleDateString()}</Text>
                  </View>
                  <View className="items-end">
                    <Text className={`text-sm font-semibold ${(trade.pnl ?? 0) >= 0 ? "text-bull" : "text-bear"}`}>
                      {(trade.pnl ?? 0) >= 0 ? "+" : ""}${(trade.pnl ?? 0).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
            </>
          )}

          {tab === "paper" && paperTrades.length === 0 && !isLoadingTrades && (
            <Text className="text-muted text-center mt-10 text-sm">No paper trades yet.</Text>
          )}

          {tab === "signals" && (
            <Text className="text-muted text-center mt-10 text-sm">Signal history coming soon.</Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

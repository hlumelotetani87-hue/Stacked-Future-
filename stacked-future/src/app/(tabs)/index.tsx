import { useEffect } from "react";
import { View, Text, ScrollView, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import TradingViewChart from "@/components/chart/TradingViewChart";
import AcctToggle from "@/components/ui/AcctToggle";
import ProGate from "@/components/ui/ProGate";
import { useTradingStore, type Timeframe } from "@/store/trading-store";
import { useTwelveData } from "@/hooks/useTwelveData";
import { useLicence } from "@/hooks/useLicence";

const TIMEFRAMES: Timeframe[] = ["1m", "5m", "15m", "1h", "4h", "1D"];

export default function ChartScreen() {
  const { activeSymbol, activeTimeframe, setActiveTimeframe, signal, isLoadingSignal, mode } = useTradingStore();
  const { candles, price, change, isLoading, fetchCandles } = useTwelveData();
  const { isPro } = useLicence();

  useEffect(() => {
    fetchCandles(activeSymbol, activeTimeframe);
  }, [activeSymbol, activeTimeframe]);

  const isPositive = (change ?? 0) >= 0;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      {/* Top bar */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-1">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-semibold text-white">{activeSymbol}</Text>
          <View className="bg-bull/10 border border-bull/30 rounded-full px-2 py-0.5">
            <Text className="text-[10px] font-semibold text-bull">LIVE</Text>
          </View>
          <AcctToggle />
        </View>
        <View className="w-5 h-5" />
      </View>

      {/* Demo banner */}
      {mode === "demo" && (
        <View className="mx-4 mb-1 bg-demo/10 rounded-lg px-3 py-1.5 border border-demo/20">
          <Text className="text-[11px] text-demo text-center">Paper trading — no real funds at risk</Text>
        </View>
      )}

      {/* Price */}
      <View className="px-4 pb-2 flex-row items-baseline gap-2">
        <Text className="text-3xl font-bold text-white tracking-tight">
          {price ? price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : "—"}
        </Text>
        {change !== null && (
          <Text className={`text-sm font-medium ${isPositive ? "text-bull" : "text-bear"}`}>
            {isPositive ? "+" : ""}{change.toFixed(2)}%
          </Text>
        )}
      </View>

      {/* Timeframe selector */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4 mb-2" contentContainerStyle={{ gap: 6 }}>
        {TIMEFRAMES.map((tf) => (
          <Pressable
            key={tf}
            onPress={() => setActiveTimeframe(tf)}
            className={`px-3 py-1 rounded-xl border ${activeTimeframe === tf ? "bg-card2 border-border2" : "border-border bg-transparent"}`}
          >
            <Text className={`text-[11px] font-medium ${activeTimeframe === tf ? "text-accent" : "text-muted"}`}>{tf}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Chart */}
      <View className="mx-4 mb-3 rounded-2xl overflow-hidden border border-border" style={{ height: 200 }}>
        {isLoading ? (
          <View className="flex-1 items-center justify-center bg-card">
            <ActivityIndicator color="#a5b4fc" />
          </View>
        ) : (
          <TradingViewChart candles={candles} />
        )}
      </View>

      {/* Signal cards */}
      <View className="flex-row gap-2 px-4 mb-3">
        <View className="flex-1 bg-card rounded-xl p-3 border border-border">
          <Text className="text-[9px] text-muted uppercase tracking-wider mb-1">Signal</Text>
          {isLoadingSignal ? (
            <ActivityIndicator color="#a5b4fc" size="small" />
          ) : (
            <Text className={`text-sm font-semibold ${signal?.direction === "buy" ? "text-bull" : signal?.direction === "sell" ? "text-bear" : "text-accent"}`}>
              {signal ? (signal.direction === "buy" ? "↑ BUY" : signal.direction === "sell" ? "↓ SELL" : "◈ WATCH") : "—"}
            </Text>
          )}
        </View>
        <View className="flex-1 bg-card rounded-xl p-3 border border-border">
          <Text className="text-[9px] text-muted uppercase tracking-wider mb-1">Confidence</Text>
          {isPro ? (
            <Text className="text-sm font-semibold text-accent">{signal ? `${signal.confidence}%` : "—"}</Text>
          ) : (
            <Text className="text-sm font-semibold text-muted">Pro only</Text>
          )}
        </View>
        <View className="flex-1 bg-card rounded-xl p-3 border border-border">
          <Text className="text-[9px] text-muted uppercase tracking-wider mb-1">Paper P&L</Text>
          <Text className="text-sm font-semibold text-white">+$0.00</Text>
          <Text className="text-[8px] text-muted mt-0.5">app only</Text>
        </View>
      </View>

      {/* Forecast */}
      {isPro ? (
        <View className="flex-1 px-4">
          <Text className="text-[10px] text-muted uppercase tracking-wider mb-2">Forecast</Text>
          {(signal?.forecast ?? []).map((fc, i) => (
            <View key={i} className="flex-row items-center py-1.5 border-t border-border">
              <Text className="text-[11px] text-muted w-9">{fc.hour}</Text>
              <View className="flex-1 bg-card2 rounded h-1.5 mx-2 overflow-hidden">
                <View
                  className={`h-full rounded ${fc.pct >= 0 ? "bg-bull" : "bg-bear"}`}
                  style={{ width: `${Math.min(Math.abs(fc.pct) * 200, 100)}%` }}
                />
              </View>
              <Text className={`text-[11px] font-medium w-12 text-right ${fc.pct >= 0 ? "text-bull" : "text-bear"}`}>
                {fc.pct >= 0 ? "+" : ""}{fc.pct.toFixed(2)}%
              </Text>
            </View>
          ))}
          {!signal && !isLoadingSignal && (
            <Text className="text-muted text-sm text-center mt-4">Tap the symbol to load a Kronos forecast</Text>
          )}
        </View>
      ) : (
        <ProGate feature="Forecast breakdown">
          <View />
        </ProGate>
      )}
    </SafeAreaView>
  );
}

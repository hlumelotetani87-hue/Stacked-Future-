import { useAuth } from "@clerk/expo";
import { Redirect } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useEffect } from "react";
import { useTradingStore } from "@/store/trading-store";

export default function TabsLayout() {
  const { isSignedIn, isLoaded } = useAuth();
  const { loadWatchlist } = useTradingStore();

  useEffect(() => {
    if (isSignedIn) loadWatchlist();
  }, [isSignedIn]);

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href="/(auth)/sign-in" />;

  return (
    <NativeTabs tintColor="#a5b4fc">
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Chart</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "chart.bar.xaxis", selected: "chart.bar.xaxis" }}
          md="candlestick_chart"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="watchlist">
        <NativeTabs.Trigger.Label>Watchlist</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "star", selected: "star.fill" }}
          md="star"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <NativeTabs.Trigger.Label>History</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "clock", selected: "clock.fill" }}
          md="history"
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="settings">
        <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          sf={{ default: "gearshape", selected: "gearshape.fill" }}
          md="settings"
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

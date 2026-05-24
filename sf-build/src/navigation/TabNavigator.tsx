import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { useAuth } from '@clerk/expo';
import { useTradingStore } from '@/store/trading-store';
import ChartScreen from '@/app/(tabs)/index';
import WatchlistScreen from '@/app/(tabs)/watchlist';
import HistoryScreen from '@/app/(tabs)/history';
import SettingsScreen from '@/app/(tabs)/settings';

export type TabParamList = {
  Chart: undefined;
  Watchlist: undefined;
  History: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

function TabIcon({ icon, label, focused }: { icon: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{icon}</Text>
      <Text style={{ fontSize: 9, color: focused ? '#a5b4fc' : '#666', marginTop: 1 }}>{label}</Text>
    </View>
  );
}

export default function TabNavigator() {
  const { isSignedIn } = useAuth();
  const { loadWatchlist } = useTradingStore();

  useEffect(() => {
    if (isSignedIn) loadWatchlist();
  }, [isSignedIn]);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#111520',
          borderTopColor: '#1a1d2a',
          height: 60,
          paddingBottom: 8,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Chart"
        component={ChartScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="📊" label="Chart" focused={focused} /> }}
      />
      <Tab.Screen
        name="Watchlist"
        component={WatchlistScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⭐" label="Watchlist" focused={focused} /> }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="🕐" label="History" focused={focused} /> }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarIcon: ({ focused }) => <TabIcon icon="⚙️" label="Settings" focused={focused} /> }}
      />
    </Tab.Navigator>
  );
}

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@clerk/expo';
import SignInScreen from '@/app/(auth)/sign-in';
import TabNavigator from './TabNavigator';

export type RootStackParamList = {
  SignIn: undefined;
  Tabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isSignedIn, isLoaded } = useAuth();
  if (!isLoaded) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'ios',
          contentStyle: { backgroundColor: '#0d0f14' },
        }}
      >
        {isSignedIn ? (
          <Stack.Screen name="Tabs" component={TabNavigator} />
        ) : (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

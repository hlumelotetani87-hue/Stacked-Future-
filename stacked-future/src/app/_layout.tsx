import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack } from "expo-router";
import { Platform } from "react-native";
import * as Sentry from "@sentry/react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { sentryBeforeSend } from "@/lib/server/security";
import "../../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
if (!publishableKey) {
  throw new Error(
    "Missing EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY. Add it to your EAS build profile or .env file."
  );
}

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  beforeSend: sentryBeforeSend,
  // Only send errors in production
  enabled: !__DEV__,
});

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <KeyboardProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            // Force iOS-style animations on both platforms
            animation: Platform.OS === "android" ? "ios" : "default",
            contentStyle: { backgroundColor: "#0d0f14" },
          }}
        />
      </KeyboardProvider>
    </ClerkProvider>
  );
});

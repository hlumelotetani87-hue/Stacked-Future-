# Stacked Future — Bare React Native

Migrated from Expo Router → React Navigation. Builds directly with Gradle, no EAS required.

---

## What changed from the Expo version

| Area | Before | After |
|---|---|---|
| Entry point | `expo-router/entry` | `index.js` |
| Navigation | Expo Router (file-based) | React Navigation Native Stack + Bottom Tabs |
| Tab bar | `expo-router/unstable-native-tabs` (NativeTabs) | `@react-navigation/bottom-tabs` |
| Android bundler | `expo export:embed` via Expo CLI | Standard `react-native bundle` |
| MainApplication.kt | `ExpoReactHostFactory` | Standard `DefaultReactNativeHost` |
| MainActivity.kt | `ReactActivityDelegateWrapper` + splash screen | Clean `DefaultReactActivityDelegate` |
| settings.gradle | `expo-autolinking-settings` plugin | Standard RN autolinking only |
| build.gradle | `expo-root-project` plugin | Standard `com.facebook.react.rootproject` |

### Expo packages kept (still needed)
- `@clerk/expo` — auth SDK, has no plain RN version
- `expo-auth-session`, `expo-web-browser` — OAuth flow for Clerk SSO
- `expo-crypto` — random bytes, used by Clerk token cache
- `expo-constants` — app config access
- `expo-secure-store` — secure key storage (MetaApi credentials)
- `expo-linking` — deep link utilities
- `babel-preset-expo` — still the best babel preset for RN + NativeWind
- `@sentry/react-native` — error tracking

### Expo packages removed
- `expo-router` ✅ replaced by React Navigation
- `expo-splash-screen` ✅ removed (no splash logic needed)
- `expo-font` ✅ removed (no custom fonts)
- `expo-image` ✅ removed (not used in screens)
- `expo-linear-gradient` ✅ removed (not used)
- `expo-glass-effect` ✅ removed (not used)
- `expo-symbols` ✅ removed (NativeTabs icons replaced by emoji)
- `expo-system-ui` ✅ removed
- `expo-status-bar` ✅ removed
- `expo-device` ✅ removed
- `expo-dev-client` ✅ removed
- `react-native-web`, `react-dom` ✅ removed (Android only)

---

## Setup in GitHub Codespaces

### 1. Install dependencies
```bash
bun install
# or: npm install
```

### 2. Set up environment
```bash
cp .env.example .env
# fill in all keys
```

### 3. Push database schema
```bash
bun run db:push
```

### 4. Start Metro bundler
```bash
bun start
# keep this terminal open
```

---

## Running on Android

### Option A — via React Native CLI (needs adb connected device or emulator)
```bash
bun android
# or: npx react-native run-android
```

### Option B — Gradle directly (produces APK file)
```bash
# Debug APK
cd android && ./gradlew assembleDebug

# Release APK
cd android && ./gradlew assembleRelease
```

APK output:
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release.apk`

### Option C — npm script shortcuts
```bash
bun run build:android:debug
bun run build:android:release
```

---

## Project structure

```
index.js                      ← RN entry point (registers 'main' component)
src/
├── navigation/
│   ├── RootNavigator.tsx     ← Auth gate + Stack (SignIn ↔ Tabs)
│   └── TabNavigator.tsx      ← Bottom tab bar (Chart, Watchlist, History, Settings)
├── app/
│   ├── (auth)/sign-in.tsx    ← Sign in screen
│   └── (tabs)/
│       ├── index.tsx         ← Chart screen
│       ├── watchlist.tsx     ← Watchlist screen
│       ├── history.tsx       ← History screen
│       └── settings.tsx      ← Settings screen
├── components/
│   ├── chart/TradingViewChart.tsx
│   └── ui/
│       ├── AcctToggle.tsx
│       └── ProGate.tsx
├── hooks/
│   ├── useSocialAuth.ts
│   ├── useLicence.ts
│   └── useTwelveData.ts
├── lib/server/
│   ├── db/client.ts
│   ├── db/schema.ts
│   ├── db-actions.ts
│   └── security.ts
└── store/trading-store.ts
```

---

## Kronos AI attribution
This app uses [Kronos AI](https://github.com/shiyu-coder/Kronos) — MIT License — Copyright (c) 2025 ShiYu.

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Start from Sentry-aware config (which extends default RN config internally)
const sentryConfig = getSentryExpoConfig(__dirname);

// Merge with any extra defaults
const config = mergeConfig(getDefaultConfig(__dirname), sentryConfig);

module.exports = withNativeWind(config, { input: './global.css' });

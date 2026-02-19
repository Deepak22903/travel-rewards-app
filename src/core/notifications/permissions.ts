/**
 * Notification Channel Setup
 * Android notification channel is created automatically by @react-native-firebase/messaging
 * via the default_notification_channel_id config in app.json.
 * This file is kept for any future local notification needs.
 */

import { Platform } from 'react-native';

/**
 * Register Android notification channel.
 * Firebase Messaging plugin (app.json: default_notification_channel_id: "default")
 * already creates this channel — this is a no-op kept for API compatibility.
 */
export const registerAndroidNotificationChannel = async (): Promise<void> => {
  // No-op: channel is created by the Firebase Messaging native plugin.
  // Previously used expo-notifications here, which caused a NativeEventEmitter
  // crash on app startup (module-level initialization before React Native was ready).
  if (__DEV__ && Platform.OS === 'android') {
    console.log('Android notification channel: managed by Firebase plugin');
  }
};




/**
 * App Root Component
 * Main entry point for the Travel Rewards application
 */

import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary, NotificationPermissionModal } from './src/components';
import { customFonts } from './src/core/constants/fonts';
import {
  requestFCMPermissions,
  getFCMToken,
  checkNotificationPermissionStatus,
  PERM_STATUS_KEY,
} from './src/core/notifications/firebase';
import { registerPushToken } from './src/core/api/notifications';
import { STORAGE_KEYS } from './src/core/types';

export default function App(): React.JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    // Check permission status on every launch.
    // Show the in-app rationale modal if not yet granted and still ask-able.
    async function checkPermissionOnLaunch() {
      try {
        const status = await checkNotificationPermissionStatus();
        if (status === 'not_asked' || status === 'denied') {
          setShowPermModal(true);
        }
        // 'granted': already set up — nothing to do.
        // 'blocked': OS won't show prompt anyway — user must open Settings manually.
      } catch (error) {
        console.error('Error checking notification permission on launch:', error);
      }
    }
    if (fontsLoaded) checkPermissionOnLaunch();
  }, [fontsLoaded]);

  // User tapped "Allow" in the in-app rationale modal
  const handlePermAllow = async () => {
    setShowPermModal(false);
    // OS dialog now appears cleanly with no competing backdrop
    const granted = await requestFCMPermissions();
    if (__DEV__) console.log('Notification permission granted:', granted);
    // Register token regardless — notifications_enabled flag tells backend the state
    const token = await getFCMToken();
    if (token) {
      const registered = await registerPushToken(granted);
      if (registered && __DEV__) console.log('✅ FCM token registered with backend');
    }
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, granted ? 'true' : 'false');
  };

  // User tapped "Not now" in the in-app rationale modal
  const handlePermNotNow = async () => {
    setShowPermModal(false);
    // Mark as denied so modal shows again next launch (per spec: until granted or blocked)
    await AsyncStorage.setItem(PERM_STATUS_KEY, 'denied');
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
    // Still register token with disabled flag so backend has the device record
    const token = await getFCMToken();
    if (token) await registerPushToken(false);
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8D4B8' }}>
        <ActivityIndicator size="large" color="#F5A623" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppNavigator />
      <StatusBar style="light" />
      <NotificationPermissionModal
        visible={showPermModal}
        onAllow={handlePermAllow}
        onNotNow={handlePermNotNow}
      />
    </ErrorBoundary>
  );
}


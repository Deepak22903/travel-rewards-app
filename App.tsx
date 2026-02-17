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
import { ErrorBoundary } from './src/components';
import { customFonts } from './src/core/constants/fonts';
import { requestFCMPermissions, getFCMToken } from './src/core/notifications/firebase';
import { registerPushToken } from './src/core/api/notifications';
import * as Notifications from 'expo-notifications';
import { Platform, Alert, Linking } from 'react-native';
import { STORAGE_KEYS } from './src/core/types';

export default function App(): React.JSX.Element {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync(customFonts);
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  useEffect(() => {
    async function setupNotifications() {
      try {
        // Check if this is the first launch
        const hasLaunchedBefore = await AsyncStorage.getItem('@has_launched_before');
        
        if (!hasLaunchedBefore) {
          console.log('First launch detected - requesting notification permissions...');

          // Show a brief rationale before prompting (could be replaced with a nicer modal)
          let shouldPrompt = true;
          try {
            // Use Expo Notifications to check current permission status (works across platforms)
            const permissionInfo = await Notifications.getPermissionsAsync();
            if (permissionInfo.status === 'granted') {
              shouldPrompt = false;
            }
          } catch (e) {
            // ignore and prompt
          }

          let hasPermission = false;
          if (shouldPrompt) {
            // Optional: show a simple Alert as a rationale
            const proceed = await new Promise<boolean>(resolve => {
              Alert.alert(
                'Enable notifications?',
                'We send booking updates and special offers. Would you like to enable notifications?',
                [
                  { text: 'Not now', onPress: () => resolve(false), style: 'cancel' },
                  { text: 'Allow', onPress: () => resolve(true) },
                ],
                { cancelable: true }
              );
            });

            if (proceed) {
              hasPermission = await requestFCMPermissions();
            } else {
              hasPermission = false;
            }
          } else {
            // Already granted
            hasPermission = true;
          }

          // Regardless of permission result, obtain FCM token and register with backend.
          // Backend will be informed whether notifications are enabled via notifications_enabled flag.
          const token = await getFCMToken();
          if (token) {
            console.log('Token obtained - registering with backend (notifications_enabled=', hasPermission, ')');
            const registered = await registerPushToken(hasPermission);
            if (registered) {
              console.log('✅ FCM token registered with backend');
            }
          } else {
            console.log('No token obtained');
          }

          // Persist the user's choice locally
          await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, hasPermission ? 'true' : 'false');

          // Mark that we've launched before
          await AsyncStorage.setItem('@has_launched_before', 'true');
        } else {
          console.log('Not first launch - skipping automatic notification setup');
        }
      } catch (error) {
        console.error('Error setting up notifications on first launch:', error);
      }
    }

    if (fontsLoaded) {
      setupNotifications();
    }
  }, [fontsLoaded]);

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
    </ErrorBoundary>
  );
}


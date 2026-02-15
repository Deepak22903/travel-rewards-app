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
          
          // Request FCM permissions
          const hasPermission = await requestFCMPermissions();
          
          if (hasPermission) {
            console.log('Permission granted - getting FCM token...');
            const token = await getFCMToken();
            
            if (token) {
              console.log('Token obtained - registering with backend...');
              const registered = await registerPushToken();
              
              if (registered) {
                console.log('✅ Notifications enabled on first launch');
                // Save that notifications are enabled
                await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
              }
            }
          } else {
            console.log('Permission denied - notifications disabled');
            await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
          }
          
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


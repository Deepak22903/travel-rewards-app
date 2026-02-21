/**
 * Notification Listeners Hook
 * Handle FCM notification events, navigation, and token registration
 */

import { useEffect, useRef } from 'react';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { registerPushToken } from '../api/notifications';
import { setupFCMListeners } from './firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_REGISTERED_KEY = '@notification_token_registered';

export const useNotifications = (
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>
) => {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Register token on app start (if not already registered)
    const registerToken = async () => {
      try {
        const alreadyRegistered = await AsyncStorage.getItem(TOKEN_REGISTERED_KEY);
        
        if (!alreadyRegistered) {
          const success = await registerPushToken();
          if (success) {
            await AsyncStorage.setItem(TOKEN_REGISTERED_KEY, 'true');
            console.log('✅ FCM token registered with backend');
          }
        }
      } catch (error) {
        console.error('Error in token registration:', error);
      }
    };

    registerToken();

    // Helper to navigate based on notification data
    const handleNotificationNavigation = (notification: any) => {
      console.log('Handling notification navigation:', notification);
      
      // Get target screen from notification data (default to Rewards)
      const screen = notification.data?.screen || 'Rewards';
      
      // Wait for navigation to be ready
      if (navigationRef.current?.isReady()) {
        console.log(`Navigating to: ${screen}`);
        if (screen === 'Rewards') {
          navigationRef.current.navigate('Rewards', { fromNotification: Date.now() });
        } else {
          navigationRef.current.navigate(screen as keyof RootStackParamList);
        }
      } else {
        // If not ready, wait a bit and retry
        setTimeout(() => {
          if (navigationRef.current?.isReady()) {
            console.log(`Navigating to: ${screen} (delayed)`);
            if (screen === 'Rewards') {
              navigationRef.current.navigate('Rewards', { fromNotification: Date.now() });
            } else {
              navigationRef.current.navigate(screen as keyof RootStackParamList);
            }
          }
        }, 1000);
      }
    };

    // Setup FCM listeners
    const cleanup = setupFCMListeners(
      // Foreground notification received
      (notification) => {
        console.log('Foreground notification received:', notification);
        // Optionally navigate immediately or show in-app notification
      },
      // Notification opened (background or quit state)
      (notification) => {
        console.log('Notification opened:', notification);
        handleNotificationNavigation(notification);
      }
    );

    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [navigationRef]);
};

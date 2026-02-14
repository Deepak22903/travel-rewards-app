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

    // Setup FCM listeners
    const cleanup = setupFCMListeners((notification) => {
      console.log('Foreground notification received:', notification);
      
      // Navigate based on notification data
      const screen = notification.data?.screen;
      if (screen && navigationRef.current) {
        navigationRef.current.navigate(screen as keyof RootStackParamList);
      }
    });

    cleanupRef.current = cleanup;

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [navigationRef]);
};

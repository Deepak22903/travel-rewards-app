/**
 * Notification Listeners Hook
 * Handle notification events, navigation, and token registration
 */

import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { NavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { registerPushToken } from '../api/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_REGISTERED_KEY = '@notification_token_registered';

export const useNotifications = (
  navigationRef: React.RefObject<NavigationContainerRef<RootStackParamList> | null>
) => {
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    // Register token on app start (if not already registered)
    const registerToken = async () => {
      try {
        const alreadyRegistered = await AsyncStorage.getItem(TOKEN_REGISTERED_KEY);
        
        if (!alreadyRegistered) {
          const success = await registerPushToken();
          if (success) {
            await AsyncStorage.setItem(TOKEN_REGISTERED_KEY, 'true');
            console.log('✅ Push token registered with backend');
          }
        }
      } catch (error) {
        console.error('Error in token registration:', error);
      }
    };

    registerToken();

    // Listen for notifications received while app is open
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      // You can show an in-app banner here if needed
    });

    // Listen for user tapping on notification
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      
      // Navigate based on notification data
      const screen = response.notification.request.content.data?.screen;
      if (screen && navigationRef.current) {
        navigationRef.current.navigate(screen as keyof RootStackParamList);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [navigationRef]);
};

/**
 * Firebase Cloud Messaging Integration
 * Handle FCM token registration and push notifications
 */

import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = '@fcm_token';

/**
 * Request notification permissions (iOS)
 */
export const requestFCMPermissions = async (): Promise<boolean> => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('FCM Authorization status:', authStatus);
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error requesting FCM permissions:', error);
    return false;
  }
};

/**
 * Get FCM token
 */
export const getFCMToken = async (): Promise<string | null> => {
  try {
    // Check if we have permission
    if (Platform.OS === 'ios') {
      const hasPermission = await requestFCMPermissions();
      if (!hasPermission) {
        console.log('FCM permission denied');
        return null;
      }
    }

    // Get FCM token
    const token = await messaging().getToken();
    
    if (token) {
      console.log('FCM Token:', token);
      await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      return token;
    }

    return null;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

/**
 * Setup FCM listeners
 */
export const setupFCMListeners = (
  onNotificationReceived?: (notification: any) => void,
  onNotificationOpened?: (notification: any) => void
) => {
  // Handle foreground messages
  const unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
    console.log('FCM foreground message:', remoteMessage);
    
    if (onNotificationReceived) {
      onNotificationReceived(remoteMessage);
    }
  });

  // Handle background/quit state messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('FCM background message:', remoteMessage);
  });

  // Handle notification opened app from background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background:', remoteMessage);
    if (onNotificationOpened && remoteMessage.data) {
      onNotificationOpened(remoteMessage);
    }
  });

  // Check if app was opened from a quit state notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage);
        if (onNotificationOpened && remoteMessage.data) {
          onNotificationOpened(remoteMessage);
        }
      }
    });

  // Handle token refresh
  const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(token => {
    console.log('FCM token refreshed:', token);
    AsyncStorage.setItem(FCM_TOKEN_KEY, token);
    // TODO: Send updated token to backend
  });

  // Return cleanup function
  return () => {
    unsubscribeOnMessage();
    unsubscribeOnTokenRefresh();
  };
};

/**
 * Delete FCM token (for logout/unregister)
 */
export const deleteFCMToken = async (): Promise<boolean> => {
  try {
    await messaging().deleteToken();
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
    console.log('FCM token deleted');
    return true;
  } catch (error) {
    console.error('Error deleting FCM token:', error);
    return false;
  }
};

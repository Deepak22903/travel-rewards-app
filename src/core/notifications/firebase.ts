/**
 * Firebase Cloud Messaging Integration
 * Handle FCM token registration and push notifications
 */

import messaging from '@react-native-firebase/messaging';
import { Platform, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FCM_TOKEN_KEY = '@fcm_token';
export const PERM_STATUS_KEY = '@travel_rewards:notification_perm_status';
export type PermStatus = 'not_asked' | 'denied' | 'blocked' | 'granted';

/**
 * Check the current notification permission status without triggering a prompt.
 * Combines OS-level check with stored state to distinguish:
 *   not_asked — never prompted yet
 *   denied    — user said no once (Android can ask again)
 *   blocked   — permanently denied (must open device Settings)
 *   granted   — notifications allowed
 */
export const checkNotificationPermissionStatus = async (): Promise<PermStatus> => {
  try {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 33) {
        const isGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (isGranted) return 'granted';
        // OS says not granted — use stored state to distinguish denied vs blocked
        const stored = await AsyncStorage.getItem(PERM_STATUS_KEY) as PermStatus | null;
        if (stored === 'blocked') return 'blocked';
        if (stored === 'denied') return 'denied';
        return 'not_asked';
      }
      return 'granted'; // Android < 13: no runtime notification permission needed
    }

    // iOS: Firebase gives the authoritative status
    const authStatus = await messaging().hasPermission();
    switch (authStatus) {
      case messaging.AuthorizationStatus.AUTHORIZED:
      case messaging.AuthorizationStatus.PROVISIONAL:
        return 'granted';
      case messaging.AuthorizationStatus.DENIED:
        return 'blocked'; // iOS does not allow re-prompting after denial
      default:
        return 'not_asked';
    }
  } catch (error) {
    console.error('Error checking permission status:', error);
    return 'not_asked';
  }
};

/**
 * Request notification permissions (iOS + Android 13+).
 * Persists the result so checkNotificationPermissionStatus can distinguish
 * denied-once from permanently-blocked on the next call.
 */
export const requestFCMPermissions = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      const granted = result === PermissionsAndroid.RESULTS.GRANTED;
      const neverAskAgain = result === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
      await AsyncStorage.setItem(
        PERM_STATUS_KEY,
        granted ? 'granted' : neverAskAgain ? 'blocked' : 'denied'
      );
      if (__DEV__) console.log('Android POST_NOTIFICATIONS permission:', result);
      return granted;
    }

    // iOS (and Android < 13)
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    await AsyncStorage.setItem(PERM_STATUS_KEY, enabled ? 'granted' : 'blocked');
    if (enabled && __DEV__) console.log('FCM Authorization status:', authStatus);
    return enabled;
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
    // Always attempt to get FCM token. For Android (>=13) and iOS the system permission
    // controls whether notifications show, but the token can still be obtained and used
    // by backend for other targeting where appropriate.

    const token = await messaging().getToken();
    
    if (token) {
      if (__DEV__) console.log('FCM Token:', token);
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
    if (__DEV__) console.log('FCM foreground message:', remoteMessage);

    if (onNotificationReceived) {
      onNotificationReceived(remoteMessage);
    }
  });

  // Handle background/quit state messages
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (__DEV__) console.log('FCM background message:', remoteMessage);
  });

  // Handle notification opened app from background
  messaging().onNotificationOpenedApp(remoteMessage => {
    if (__DEV__) console.log('Notification caused app to open from background:', remoteMessage);
    if (onNotificationOpened && remoteMessage.data) {
      onNotificationOpened(remoteMessage);
    }
  });

  // Check if app was opened from a quit state notification
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        if (__DEV__) console.log('Notification caused app to open from quit state:', remoteMessage);
        if (onNotificationOpened && remoteMessage.data) {
          onNotificationOpened(remoteMessage);
        }
      }
    });

  // Handle token refresh
  const unsubscribeOnTokenRefresh = messaging().onTokenRefresh(token => {
    if (__DEV__) console.log('FCM token refreshed:', token);
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
    if (__DEV__) console.log('FCM token deleted');
    return true;
  } catch (error) {
    console.error('Error deleting FCM token:', error);
    return false;
  }
};

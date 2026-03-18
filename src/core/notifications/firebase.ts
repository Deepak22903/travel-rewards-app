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
let backgroundHandlerRegistered = false;

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

    if (Platform.OS === 'android') {
      // Android < 13 has no runtime notification permission dialog.
      await AsyncStorage.setItem(PERM_STATUS_KEY, 'granted');
      return true;
    }

    // iOS
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
    if (Platform.OS === 'ios') {
      const isRegistered = messaging().isDeviceRegisteredForRemoteMessages;
      if (!isRegistered) {
        await messaging().registerDeviceForRemoteMessages();
      }
    }

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
  let unsubscribeOnMessage = () => {};
  let unsubscribeOnTokenRefresh = () => {};
  let unsubscribeOnOpen = () => {};

  // Handle foreground messages
  try {
    unsubscribeOnMessage = messaging().onMessage(async remoteMessage => {
      if (__DEV__) console.log('FCM foreground message:', remoteMessage);

      if (onNotificationReceived) {
        onNotificationReceived(remoteMessage);
      }
    });
  } catch (error) {
    console.error('Error attaching FCM foreground listener:', error);
  }

  // Handle background/quit state messages
  if (!backgroundHandlerRegistered) {
    try {
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        if (__DEV__) console.log('FCM background message:', remoteMessage);
      });
      backgroundHandlerRegistered = true;
    } catch (error) {
      console.error('Error setting background FCM handler:', error);
    }
  }

  // Handle notification opened app from background
  try {
    unsubscribeOnOpen = messaging().onNotificationOpenedApp(remoteMessage => {
      if (__DEV__) console.log('Notification caused app to open from background:', remoteMessage);
      if (onNotificationOpened && remoteMessage.data) {
        onNotificationOpened(remoteMessage);
      }
    });
  } catch (error) {
    console.error('Error attaching notification-open listener:', error);
  }

  // Check if app was opened from a quit state notification
  try {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          if (__DEV__) console.log('Notification caused app to open from quit state:', remoteMessage);
          if (onNotificationOpened && remoteMessage.data) {
            onNotificationOpened(remoteMessage);
          }
        }
      })
      .catch(error => {
        console.error('Error getting initial notification:', error);
      });
  } catch (error) {
    console.error('Error checking initial notification:', error);
  }

  // Handle token refresh
  try {
    unsubscribeOnTokenRefresh = messaging().onTokenRefresh(token => {
      if (__DEV__) console.log('FCM token refreshed:', token);
      AsyncStorage.setItem(FCM_TOKEN_KEY, token);
      // TODO: Send updated token to backend
    });
  } catch (error) {
    console.error('Error attaching FCM token refresh listener:', error);
  }

  // Return cleanup function
  return () => {
    unsubscribeOnMessage();
    unsubscribeOnTokenRefresh();
    unsubscribeOnOpen();
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

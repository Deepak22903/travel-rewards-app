/**
 * Notifications API
 * Handle push notification token registration with backend (FCM)
 */

import client from './client';
import { getFCMToken } from '../notifications/firebase';
import { Platform } from 'react-native';
import { APP_CONFIG } from '../constants/config';

interface TokenRegistrationResponse {
  success: boolean;
  message: string;
  token_id?: string;
}

/**
 * Register FCM push notification token with backend
 */
export const registerPushToken = async (notifications_enabled: boolean = true): Promise<boolean> => {
  try {
    const token = await getFCMToken();
    
    if (!token) {
      console.log('No FCM token available');
      return false;
    }

    const response = await client.post<TokenRegistrationResponse>(
      '/notifications/register',
      {
        token,
        device_type: Platform.OS,
        app_version: APP_CONFIG.APP_VERSION,
        token_type: 'fcm', // Specify this is an FCM token
        notifications_enabled: notifications_enabled,
      }
    );

    if (response.data.success) {
      console.log('✅ FCM token registered:', response.data.token_id);
      return true;
    } else {
      console.error('❌ Token registration failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('Error registering FCM token:', error);
    return false;
  }
};

/**
 * Unregister push notification token
 */
export const unregisterPushToken = async (): Promise<boolean> => {
  try {
    const token = await getFCMToken();
    
    if (!token) {
      return false;
    }

    const response = await client.delete<TokenRegistrationResponse>(
      `/notifications/unregister/${token}`
    );

    if (response.data.success) {
      console.log('✅ FCM token unregistered');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error unregistering FCM token:', error);
    return false;
  }
};

/**
 * Test notification sending (for development)
 */
export const sendTestNotification = async (): Promise<boolean> => {
  try {
    const response = await client.post('/notifications/send/new-rewards', {
      count: 3,
    });

    return response.data.success;
  } catch (error) {
    console.error('Error sending test notification:', error);
    return false;
  }
};

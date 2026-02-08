/**
 * Ad Configuration
 * Settings and logic for ad display timing
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const AD_STORAGE_KEY = '@travel_rewards:last_ad_time';
const AD_INTERVAL_MS = 30000; // 30 seconds between ads

/**
 * Check if enough time has passed to show another interstitial ad
 */
export const shouldShowInterstitial = async (): Promise<boolean> => {
  try {
    const lastAdTime = await AsyncStorage.getItem(AD_STORAGE_KEY);
    
    if (!lastAdTime) {
      // First time, show ad
      await AsyncStorage.setItem(AD_STORAGE_KEY, Date.now().toString());
      return true;
    }
    
    const timeSinceLastAd = Date.now() - parseInt(lastAdTime, 10);
    
    if (timeSinceLastAd >= AD_INTERVAL_MS) {
      await AsyncStorage.setItem(AD_STORAGE_KEY, Date.now().toString());
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error checking ad timing:', error);
    return false;
  }
};

/**
 * Ad Configuration
 * Settings and logic for ad display timing
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const AD_STORAGE_KEY = '@travel_rewards:last_ad_time';
const AD_INTERVAL_MS = 30000; // 30 seconds between ads

/**
 * Check if enough time has passed to show another interstitial ad.
 * Read-only — does NOT update the timestamp.
 * Call recordAdShown() after the ad actually closes.
 */
export const shouldShowInterstitial = async (): Promise<boolean> => {
  try {
    const lastAdTime = await AsyncStorage.getItem(AD_STORAGE_KEY);
    if (!lastAdTime) return true;
    const timeSinceLastAd = Date.now() - parseInt(lastAdTime, 10);
    return timeSinceLastAd >= AD_INTERVAL_MS;
  } catch (error) {
    console.error('Error checking ad timing:', error);
    return false;
  }
};

/**
 * Record that an interstitial ad was just shown/closed.
 * Call this in the ad CLOSED event handler.
 */
export const recordAdShown = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(AD_STORAGE_KEY, Date.now().toString());
  } catch (error) {
    console.error('Error recording ad shown time:', error);
  }
};

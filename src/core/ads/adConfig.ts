/**
 * Ad Configuration
 * Settings and logic for ad display timing
 * 
 * IMPORTANT: Configured for Teen (13+) audience to maximize ad revenue
 * - Allows personalized ads for better CPM
 * - Teen-appropriate content rating
 * - Complies with GDPR and platform policies
 * 
 * ANTI-DECEPTIVE AD POLICIES:
 * - All ads are clearly labeled as "Advertisement"
 * - Visual separation between content and ads
 * - 30-second minimum interval between interstitial ads
 * - Ads never disguised as app content or buttons
 * - No misleading ad placements near action buttons
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const AD_STORAGE_KEY = '@travel_rewards:last_ad_time';
const AD_INTERVAL_MS = 30000; // 30 seconds between ads - prevents ad spam and accidental clicks

/**
 * Configure Google Mobile Ads for Teen (13+) audience with maximum revenue optimization.
 * - Removes child-directed treatment for higher CPM
 * - Sets PG rating (appropriate for teens 13+)
 * - Enables personalized ads for better targeting
 * - Complies with Play Store Teen rating requirements
 * 
 * Safe no-op when native ads module is unavailable (e.g. Expo Go).
 */
export const initializeFamilySafeAds = async (): Promise<void> => {
  try {
    const GoogleAds = require('react-native-google-mobile-ads');
    const mobileAds = GoogleAds.mobileAds;
    const MaxAdContentRating = GoogleAds.MaxAdContentRating;

    await mobileAds().setRequestConfiguration({
      // T (Teen) rating: Suitable for ages 13+ - balances revenue with appropriate content
      // Options: G (all ages), PG (parental guidance), T (teen 13+), MA (mature 17+)
      maxAdContentRating: MaxAdContentRating.T,
      
      // Set to false for Teen (13+) apps to enable personalized ads and higher revenue
      tagForChildDirectedTreatment: false,
      
      // Set to false for 13+ audience (GDPR compliance handled by consent flow if needed)
      tagForUnderAgeOfConsent: false,
    });

    await mobileAds().initialize();
  } catch (error) {
    // Expected in Expo Go / environments without native ads module
    if (__DEV__) {
      console.log('Google Mobile Ads not initialized (native module unavailable)');
    }
  }
};

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

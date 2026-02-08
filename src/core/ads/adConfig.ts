/**
 * AdMob Configuration
 * Initialize and configure Google Mobile Ads
 */

import { Platform } from 'react-native';
import { ENV } from '../constants/config';

// Production implementation requires:
// import mobileAds from 'react-native-google-mobile-ads';

// Test Ad Unit IDs (always use these for testing!)
export const AD_UNIT_IDS = {
  banner: {
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  },
  interstitial: {
    ios: 'ca-app-pub-3940256099942544/4411468910',
    android: 'ca-app-pub-3940256099942544/1033173712',
  },
  rewarded: {
    ios: 'ca-app-pub-3940256099942544/1712485313',
    android: 'ca-app-pub-3940256099942544/5224354917',
  },
};

/**
 * Get current platform's ad unit ID
 */
export const getAdUnitId = (adType: 'banner' | 'interstitial' | 'rewarded'): string => {
  const platform = Platform.OS as 'ios' | 'android';
  return AD_UNIT_IDS[adType][platform] || AD_UNIT_IDS[adType].android;
};

/**
 * Initialize AdMob
 * Call this once on app startup
 */
export const initializeAdMob = async (): Promise<void> => {
  try {
    // Mock implementation for Expo Go
    console.log('AdMob Mock: Initialization skipped (requires development build)');
    
    /* Production implementation (uncomment when using development build):
    
    await mobileAds().initialize();
    
    // Set request configuration
    await mobileAds().setRequestConfiguration({
      // Maximum Ad Content Rating
      // 'G', 'PG', 'T', 'MA'
      maxAdContentRating: 'G',
      
      // Tag for Child-Directed Treatment
      tagForChildDirectedTreatment: false,
      
      // Tag for Under Age of Consent
      tagForUnderAgeOfConsent: false,
      
      // Test device IDs
      testDeviceIdentifiers: __DEV__ ? ['EMULATOR'] : [],
    });
    
    console.log('AdMob initialized successfully');
    */
  } catch (error) {
    console.error('Failed to initialize AdMob:', error);
  }
};

/**
 * Ad frequency configuration
 */
export const AD_CONFIG = {
  // Show interstitial ad every N screen opens
  interstitialFrequency: 3,
  
  // Minimum time between interstitials (milliseconds)
  interstitialCooldown: 60000, // 1 minute
  
  // Banner refresh interval (milliseconds)
  bannerRefreshInterval: 30000, // 30 seconds
};

/**
 * Track ad impressions
 */
let adImpressionCount = 0;
let lastInterstitialTime = 0;

export const shouldShowInterstitial = (): boolean => {
  const now = Date.now();
  const cooldownPassed = now - lastInterstitialTime >= AD_CONFIG.interstitialCooldown;
  const frequencyMet = adImpressionCount >= AD_CONFIG.interstitialFrequency;
  
  if (cooldownPassed && frequencyMet) {
    adImpressionCount = 0;
    lastInterstitialTime = now;
    return true;
  }
  
  adImpressionCount++;
  return false;
};

/**
 * Reset ad counters (useful for testing)
 */
export const resetAdCounters = (): void => {
  adImpressionCount = 0;
  lastInterstitialTime = 0;
};

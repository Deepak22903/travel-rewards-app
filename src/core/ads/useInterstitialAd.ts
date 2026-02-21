/**
 * Interstitial Ad Hook
 * Hook for loading and showing interstitial ads
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { recordAdShown } from './adConfig';

let InterstitialAd: any = null;
let AdEventType: any = null;
let TestIds: any = null;

try {
  const GoogleAds = require('react-native-google-mobile-ads');
  InterstitialAd = GoogleAds.InterstitialAd;
  AdEventType = GoogleAds.AdEventType;
  TestIds = GoogleAds.TestIds;
} catch (e) {
  console.log('Google Mobile Ads not available (Expo Go)');
}

// Use test ad unit ID in dev, real IDs from env in production
const adUnitId = __DEV__ && TestIds
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_IOS ?? '',
      android: process.env.EXPO_PUBLIC_ADMOB_INTERSTITIAL_ANDROID ?? '',
    });

const MAX_RETRIES = 3;
let retryCount = 0;

// Create interstitial ad instance only if module is available
let interstitial: any = null;
if (InterstitialAd && adUnitId) {
  try {
    interstitial = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });
  } catch (e) {
    console.log('Failed to create interstitial ad:', e);
  }
}

export const useInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If no native module, just set as "loaded" for mock behavior
    if (!interstitial) {
      console.log('Mock interstitial ad loaded (no native module)');
      setIsLoaded(true);
      return;
    }

    const unsubscribeLoaded = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        retryCount = 0; // reset backoff on successful load
        setIsLoaded(true);
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoaded(false);
        recordAdShown(); // timer resets only when ad actually closes
        interstitial.load();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.error('Interstitial ad error:', error);
        setIsLoaded(false);
        // Retry with exponential backoff (5s, 10s, 15s)
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(() => {
            try { interstitial.load(); } catch (_) {}
          }, retryCount * 5000);
        }
      }
    );

    // Start loading the ad
    interstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const show = () => {
    if (!interstitial) {
      console.log('Mock interstitial ad shown (no native module)');
      return;
    }

    if (isLoaded) {
      interstitial.show();
    } else {
      console.log('Interstitial ad not loaded yet');
    }
  };

  return { isLoaded, show };
};

/**
 * Interstitial Ad Hook
 * Hook for loading and showing interstitial ads
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';

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

// Use test ad unit ID
const adUnitId = __DEV__ && TestIds
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy',
      android: 'ca-app-pub-xxxxxxxxxxxxx/yyyyyyyyyyyyyy',
    });

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
        setIsLoaded(true);
        console.log('Interstitial ad loaded');
      }
    );

    const unsubscribeClosed = interstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoaded(false);
        // Reload the ad
        interstitial.load();
      }
    );

    const unsubscribeError = interstitial.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.error('Interstitial ad error:', error);
        setIsLoaded(false);
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

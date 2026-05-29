/**
 * Full-screen Ad Hook
 * Supports interstitial and rewarded ads via centralized config.
 * Exported as useInterstitialAd for backward compatibility.
 */

import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { recordAdShown } from './adConfig';
import { FULL_SCREEN_AD_TYPE } from '../constants/gameConfig';

let InterstitialAd: any = null;
let RewardedAd: any = null;
let AdEventType: any = null;
let RewardedAdEventType: any = null;
let TestIds: any = null;

try {
  const GoogleAds = require('react-native-google-mobile-ads');
  InterstitialAd = GoogleAds.InterstitialAd;
  RewardedAd = GoogleAds.RewardedAd;
  AdEventType = GoogleAds.AdEventType;
  RewardedAdEventType = GoogleAds.RewardedAdEventType;
  TestIds = GoogleAds.TestIds;
} catch (e) {
  console.log('Google Mobile Ads not available (Expo Go)');
}

const isRewardedMode = FULL_SCREEN_AD_TYPE === 'rewarded';

// Use test ad unit ID in dev, real IDs from env in production
const adUnitId = __DEV__ && TestIds
  ? (isRewardedMode ? TestIds.REWARDED : TestIds.INTERSTITIAL)
  : Platform.select({
      ios: isRewardedMode
        ? 'ca-app-pub-1430101085831484/7339028028'
        : 'ca-app-pub-1430101085831484/4415502395',
      android: isRewardedMode
        ? 'ca-app-pub-1430101085831484/7339028028'
        : 'ca-app-pub-1430101085831484/4415502395',
    });

const MAX_RETRIES = 3;
let retryCount = 0;

const FullScreenAdClass = isRewardedMode ? RewardedAd : InterstitialAd;

// Create full-screen ad instance only if module is available
let fullScreenAd: any = null;
if (FullScreenAdClass && adUnitId) {
  try {
    fullScreenAd = FullScreenAdClass.createForAdRequest(adUnitId, {
      // Enable personalized ads for Teen (13+) audience to maximize revenue
      requestNonPersonalizedAdsOnly: false,
    });
  } catch (e) {
    console.log(`Failed to create ${FULL_SCREEN_AD_TYPE} ad:`, e);
  }
}

export const useFullScreenAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If no native module, just set as "loaded" for mock behavior
    if (!fullScreenAd) {
      console.log(`Mock ${FULL_SCREEN_AD_TYPE} ad loaded (no native module)`);
      setIsLoaded(true);
      return;
    }

    const loadedEventType = isRewardedMode && RewardedAdEventType
      ? RewardedAdEventType.LOADED
      : AdEventType.LOADED;

    const unsubscribeLoaded = fullScreenAd.addAdEventListener(
      loadedEventType,
      () => {
        retryCount = 0; // reset backoff on successful load
        setIsLoaded(true);
      }
    );

    const unsubscribeClosed = fullScreenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setIsLoaded(false);
        recordAdShown(); // timer resets only when ad actually closes
        fullScreenAd.load();
      }
    );

    const unsubscribeError = fullScreenAd.addAdEventListener(
      AdEventType.ERROR,
      (error: any) => {
        console.error(`${FULL_SCREEN_AD_TYPE} ad error:`, error);
        setIsLoaded(false);
        // Retry with exponential backoff (5s, 10s, 15s)
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          setTimeout(() => {
            try { fullScreenAd.load(); } catch (_) {}
          }, retryCount * 5000);
        }
      }
    );

    const unsubscribeEarnedReward = isRewardedMode && RewardedAdEventType
      ? fullScreenAd.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          () => {}
        )
      : () => {};

    // Start loading the ad
    fullScreenAd.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
      unsubscribeEarnedReward();
    };
  }, []);

  const show = () => {
    if (!fullScreenAd) {
      console.log(`Mock ${FULL_SCREEN_AD_TYPE} ad shown (no native module)`);
      return;
    }

    if (isLoaded) {
      fullScreenAd.show();
    } else {
      console.log(`${FULL_SCREEN_AD_TYPE} ad not loaded yet`);
    }
  };

  return { isLoaded, show };
};

export const useInterstitialAd = useFullScreenAd;

/**
 * Interstitial Ad Hook
 * Manages full-screen interstitial advertisements
 * Note: Requires development build - mock implementation for Expo Go
 */

import { useEffect, useState, useCallback } from 'react';
import { Platform, Alert } from 'react-native';

// AdMob Test IDs
const INTERSTITIAL_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/4411468910',
  android: 'ca-app-pub-3940256099942544/1033173712',
  default: 'ca-app-pub-3940256099942544/1033173712',
});

interface UseInterstitialAdReturn {
  isLoaded: boolean;
  isLoading: boolean;
  load: () => void;
  show: () => void;
}

export const useInterstitialAd = (): UseInterstitialAdReturn => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock implementation for Expo Go
  // In production with development build, replace with:
  // import { InterstitialAd, AdEventType } from 'react-native-google-mobile-ads';

  const load = useCallback(() => {
    setIsLoading(true);
    
    // Simulate ad loading
    setTimeout(() => {
      setIsLoaded(true);
      setIsLoading(false);
      console.log('Mock interstitial ad loaded');
    }, 1000);
  }, []);

  const show = useCallback(() => {
    if (!isLoaded) {
      console.warn('Interstitial ad not loaded yet');
      return;
    }

    // Mock ad display
    Alert.alert(
      '📺 Interstitial Ad',
      'This would show a full-screen ad in production.\n\nRequires development build with AdMob.',
      [
        {
          text: 'Close',
          onPress: () => {
            setIsLoaded(false);
            // Auto-load next ad
            load();
          },
        },
      ]
    );
  }, [isLoaded, load]);

  useEffect(() => {
    // Pre-load ad on mount
    load();
  }, [load]);

  return {
    isLoaded,
    isLoading,
    load,
    show,
  };

  /* Production implementation (uncomment when using development build):
  
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);

  useEffect(() => {
    const ad = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.error('Interstitial ad error:', error);
      setIsLoading(false);
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      // Load next ad
      ad.load();
    });

    setInterstitial(ad);
    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeError();
      unsubscribeClosed();
    };
  }, []);

  const load = useCallback(() => {
    if (interstitial) {
      setIsLoading(true);
      interstitial.load();
    }
  }, [interstitial]);

  const show = useCallback(() => {
    if (isLoaded && interstitial) {
      interstitial.show();
    }
  }, [isLoaded, interstitial]);

  return { isLoaded, isLoading, load, show };
  */
};

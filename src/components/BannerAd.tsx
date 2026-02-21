/**
 * Banner Ad Component
 * Display banner ads at the bottom of screens
 */

import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

let GoogleBannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

try {
  const GoogleAds = require('react-native-google-mobile-ads');
  GoogleBannerAd = GoogleAds.BannerAd;
  BannerAdSize = GoogleAds.BannerAdSize;
  TestIds = GoogleAds.TestIds;
} catch (e) {
  console.log('Google Mobile Ads not available (Expo Go)');
}

// Use test ad unit ID in dev, real IDs from env in production
const adUnitId = __DEV__ && TestIds
  ? TestIds.BANNER
  : Platform.select({
      ios: process.env.EXPO_PUBLIC_ADMOB_BANNER_IOS ?? '',
      android: process.env.EXPO_PUBLIC_ADMOB_BANNER_ANDROID ?? '',
    });

export const BannerAd: React.FC = () => {
  // If native module not available, show placeholder
  if (!GoogleBannerAd) {
    return (
      <View style={styles.mockBanner}>
        {/* Mock banner - native module not available */}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={adUnitId!}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  mockBanner: {
    height: 50,
    width: '100%',
  },
});

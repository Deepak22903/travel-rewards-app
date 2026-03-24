/**
 * Banner Ad Component
 * Display banner ads at the bottom of screens
 */

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, borderRadius, spacing, typography } from '../core/constants/theme';

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
  const insets = useSafeAreaInsets();

  // If native module not available, show placeholder
  if (!GoogleBannerAd || !adUnitId) {
    return (
      <View style={[styles.container, { paddingBottom: spacing.sm + insets.bottom }] }>
        <View style={styles.adShell}>
          <Text style={styles.adLabel}>Advertisement</Text>
          <View style={styles.mockBanner}>
            {/* Mock banner - native module not available */}
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: spacing.sm + insets.bottom }] }>
      <View style={styles.adShell}>
        <Text style={styles.adLabel}>Advertisement</Text>
        <GoogleBannerAd
          unitId={adUnitId!}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            // Enable personalized ads for Teen (13+) audience to maximize revenue
            // Set to false to allow targeted advertising
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdFailedToLoad={(error: any) => {
            if (__DEV__) {
              console.log('Banner ad failed to load:', error);
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  adShell: {
    width: '100%',
    maxWidth: 480,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.backgroundLight,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    overflow: 'hidden',
  },
  adLabel: {
    alignSelf: 'flex-start',
    marginLeft: spacing.sm,
    marginBottom: spacing.xs,
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    fontFamily: typography.family.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  mockBanner: {
    height: 50,
    width: '100%',
  },
});

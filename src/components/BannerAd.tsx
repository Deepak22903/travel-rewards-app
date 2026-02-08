/**
 * Banner Ad Component
 * Displays banner advertisements at bottom of screen
 * Note: Requires development build - shows placeholder in Expo Go
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors, spacing, typography, borderRadius } from '../core/constants/theme';

// AdMob Test IDs
const BANNER_AD_UNIT_ID = Platform.select({
  ios: 'ca-app-pub-3940256099942544/2934735716',
  android: 'ca-app-pub-3940256099942544/6300978111',
  default: 'ca-app-pub-3940256099942544/6300978111',
});

interface BannerAdProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
}

export const BannerAd: React.FC<BannerAdProps> = ({ size = 'banner' }) => {
  const [adLoaded, setAdLoaded] = useState(false);

  // Mock implementation for Expo Go
  // In production with development build, replace with:
  // import { BannerAd as GoogleBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
  
  const getAdHeight = () => {
    switch (size) {
      case 'largeBanner': return 100;
      case 'mediumRectangle': return 250;
      default: return 50;
    }
  };

  return (
    <View style={[styles.container, { height: getAdHeight() }]}>
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>📱 Ad Space</Text>
        <Text style={styles.placeholderSubtext}>
          {Platform.OS === 'ios' ? 'iOS' : 'Android'} • {size}
        </Text>
        <Text style={styles.placeholderNote}>
          Requires development build
        </Text>
      </View>
    </View>
  );

  /* Production implementation (uncomment when using development build):
  
  return (
    <View style={styles.container}>
      <GoogleBannerAd
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize[size.toUpperCase()]}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => setAdLoaded(true)}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
        }}
      />
    </View>
  );
  */
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  placeholderText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  placeholderSubtext: {
    fontSize: typography.sizes.xs,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  placeholderNote: {
    fontSize: typography.sizes.xs,
    color: colors.accent,
    fontStyle: 'italic',
  },
});

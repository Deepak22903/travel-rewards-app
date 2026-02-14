/**
 * Home Screen - Redesigned to Match Target App
 * Landing page with gradient logo, card buttons, and game-like aesthetic
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Linking,
  Share as RNShare,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../core/types';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';
import { ENV, APP_CONFIG } from '../core/constants/config';
import { useInterstitialAd } from '../core/ads/useInterstitialAd';
import { shouldShowInterstitial } from '../core/ads/adConfig';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isLoaded: adLoaded, show: showInterstitial } = useInterstitialAd();

  useEffect(() => {
    const checkAndShowAd = async () => {
      if (adLoaded && await shouldShowInterstitial()) {
        showInterstitial();
      }
    };
    checkAndShowAd();
  }, [adLoaded, showInterstitial]);

  const handleShare = async (): Promise<void> => {
    try {
      const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
      await RNShare.share({
        message: `${APP_CONFIG.SHARE_MESSAGE}\n\n${storeUrl}`,
        title: APP_CONFIG.APP_NAME,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRate = (): void => {
    const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
    Linking.openURL(storeUrl).catch(err => {
      console.error('Error opening store:', err);
    });
  };

  return (
    <View style={styles.container}>
      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
        accessibilityLabel="Settings"
        accessibilityHint="Open app settings"
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Logo Section with Gradient-Style Text */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoTravel}>Travel</Text>
          <Text style={styles.logoRewards}>Rewards</Text>
        </View>

        {/* Main Rewards Button */}
        <TouchableOpacity
          style={styles.rewardsButton}
          onPress={() => navigation.navigate('Rewards')}
          accessibilityLabel="View Rewards"
          accessibilityHint="Open rewards list"
        >
          <Text style={styles.rewardsIcon}>⚡</Text>
          <Text style={styles.rewardsText}>Rewards</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Buttons */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleShare}
          accessibilityLabel="Share App"
          accessibilityHint="Share this app with others"
        >
          <View style={styles.shareIconContainer}>
            <Text style={styles.actionIcon}>📤</Text>
          </View>
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRate}
          accessibilityLabel="Rate App"
          accessibilityHint="Rate this app in the store"
        >
          <View style={styles.rateIconContainer}>
            <Text style={styles.actionIcon}>👍</Text>
          </View>
          <Text style={styles.actionText}>Rate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  settingsButton: {
    position: 'absolute',
    top: spacing.xl + 20,
    right: spacing.md,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...shadows.sm,
  },
  settingsIcon: {
    fontSize: 28,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logoTravel: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.accent,
    textShadowColor: 'rgba(245, 166, 35, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -2,
  },
  logoRewards: {
    fontSize: 64,
    fontWeight: '800',
    color: colors.buttonBlue,
    textShadowColor: 'rgba(33, 150, 243, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: -2,
    marginTop: -8,
  },
  rewardsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    borderColor: colors.cardBorder,
    width: '100%',
    maxWidth: 400,
    ...shadows.md,
  },
  rewardsIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  rewardsText: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 3,
    borderColor: colors.cardBorder,
    flex: 1,
    maxWidth: 180,
    ...shadows.sm,
  },
  shareIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.buttonGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  rateIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.buttonBlue,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  actionIcon: {
    fontSize: 18,
  },
  actionText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
});

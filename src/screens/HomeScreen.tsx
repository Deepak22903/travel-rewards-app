/**
 * Home Screen
 * Landing page with logo, navigation, and action buttons
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
  Linking,
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
    // Show interstitial ad on app launch if conditions are met
    if (adLoaded && shouldShowInterstitial()) {
      showInterstitial();
    }
  }, [adLoaded, showInterstitial]);

  const handleShare = async (): Promise<void> => {
    try {
      const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
      await Share.share({
        message: `${APP_CONFIG.SHARE_MESSAGE}\n\n${storeUrl}`,
        title: APP_CONFIG.APP_NAME,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRate = (): void => {
    const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
    Linking.openURL(storeUrl).catch(err => console.error('Error opening store:', err));
  };

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Travel</Text>
        <Text style={[styles.logoText, styles.logoAccent]}>Rewards</Text>
      </View>

      {/* Subtitle */}
      <Text style={styles.subtitle}>Daily Game Rewards</Text>

      {/* Main Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={() => navigation.navigate('Rewards')}
          activeOpacity={0.8}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="View Rewards"
          accessibilityHint="Navigate to see available daily rewards"
        >
          <Text style={styles.buttonIcon}>⚡</Text>
          <Text style={styles.buttonText}>View Rewards</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleShare}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Share App"
            accessibilityHint="Share this app with friends"
          >
            <Text style={styles.buttonIcon}>📤</Text>
            <Text style={styles.buttonText}>Share App</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={handleRate}
            activeOpacity={0.8}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Rate Us"
            accessibilityHint="Rate the app in the app store"
          >
            <Text style={styles.buttonIcon}>⭐</Text>
            <Text style={styles.buttonText}>Rate Us</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Settings Icon */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
        activeOpacity={0.7}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel="Settings"
        accessibilityHint="Open app settings"
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 56,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -1,
  },
  logoAccent: {
    color: colors.accent,
    marginTop: -spacing.sm,
  },
  subtitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xxl,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 400,
    gap: spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  primaryButton: {
    backgroundColor: colors.buttonGreen,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  buttonIcon: {
    fontSize: 24,
    marginRight: spacing.sm,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingsButton: {
    position: 'absolute',
    top: spacing.lg,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: borderRadius.round,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  settingsIcon: {
    fontSize: 24,
  },
});

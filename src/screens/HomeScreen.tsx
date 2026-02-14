/**
 * Home Screen - Redesigned to Match Target App
 * Landing page with logo image, icon buttons, and game-like aesthetic
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
  Image,
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
        <Image
          source={require('../../assets/icons8-settings-100.png')}
          style={styles.settingsIconImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Center Content */}
      <View style={styles.centerContent}>
        {/* Logo Image */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/homeScreenImg.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Main Rewards Button */}
        <TouchableOpacity
          style={styles.rewardsButton}
          onPress={() => navigation.navigate('Rewards')}
          accessibilityLabel="View Rewards"
          accessibilityHint="Open rewards list"
        >
          <Text style={styles.buttonIcon}>⚡</Text>
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
          <Image
            source={require('../../assets/icons8-share-100.png')}
            style={styles.actionIconImage}
            resizeMode="contain"
          />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleRate}
          accessibilityLabel="Rate App"
          accessibilityHint="Rate this app in the store"
        >
          <Image
            source={require('../../assets/icons8-rating-100.png')}
            style={styles.actionIconImage}
            resizeMode="contain"
          />
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
  settingsIconImage: {
    width: 28,
    height: 28,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: 400,
    height: 300,
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
  buttonIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  rewardsText: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.family.bold,
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
  actionIconImage: {
    width: 28,
    height: 28,
    marginRight: spacing.sm,
  },
  actionText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.family.semibold,
    color: colors.textPrimary,
  },
});

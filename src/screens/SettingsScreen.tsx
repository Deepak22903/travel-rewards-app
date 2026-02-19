/**
 * Settings Screen - Redesigned to Match Target App
 * App settings and information with brown header and styled cards
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Linking,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';
import { APP_CONFIG, ENV } from '../core/constants/config';
import { STORAGE_KEYS } from '../core/types';
import { logStorageError } from '../core/utils/errorLogger';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../core/types';
import {
  requestFCMPermissions,
  getFCMToken,
  checkNotificationPermissionStatus,
} from '../core/notifications/firebase';
import { registerPushToken, updatePushTokenState } from '../core/api/notifications';
import { NotificationPermissionModal } from '../components';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPermModal, setShowPermModal] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const key = STORAGE_KEYS.NOTIFICATIONS_ENABLED;
      if (!key) {
        console.error('Storage key is undefined');
        return;
      }
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        setNotificationsEnabled(JSON.parse(value));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      logStorageError(error, 'read', STORAGE_KEYS.NOTIFICATIONS_ENABLED);
    }
  };

  const handleNotificationToggle = useCallback(async (value: boolean): Promise<void> => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      if (value) {
        // --- ENABLING ---
        const status = await checkNotificationPermissionStatus();

        if (status === 'blocked') {
          // OS will never show a prompt — direct user to device Settings
          Alert.alert(
            'Notifications Blocked',
            'Please enable notifications for this app in your device Settings.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: () => Linking.openSettings() },
            ]
          );
          setIsLoading(false);
          return;
        }

        if (status === 'granted') {
          // OS already allows — just flip the backend flag
          await updatePushTokenState(true);
          setNotificationsEnabled(true);
          await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
          setIsLoading(false);
          return;
        }

        // not_asked or denied — show in-app rationale modal before OS prompt
        setIsLoading(false);
        setShowPermModal(true);
        return;

      } else {
        // --- DISABLING ---
        // Best-effort update on backend; always reflect locally
        await updatePushTokenState(false);
        setNotificationsEnabled(false);
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'false');
        console.log('✅ Notifications disabled');
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.', [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // User tapped "Allow" in the rationale modal (triggered from Settings toggle)
  const handleModalAllow = useCallback(async (): Promise<void> => {
    setShowPermModal(false);
    setIsLoading(true);
    try {
      const granted = await requestFCMPermissions();
      const token = await getFCMToken();
      if (token) await registerPushToken(granted);
      if (granted) {
        setNotificationsEnabled(true);
        await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, 'true');
        console.log('✅ Notifications enabled from Settings');
      } else {
        Alert.alert(
          'Permission Denied',
          'To enable notifications, please allow them in your device Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
    } catch (error) {
      console.error('Error enabling notifications from modal:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleModalNotNow = useCallback((): void => {
    setShowPermModal(false);
  }, []);

  const handleOpenLink = useCallback((url: string): void => {
    Linking.openURL(url).catch(err => {
      console.error('Failed to open URL:', err);
    });
  }, []);

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Notifications Section */}
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <Text style={styles.iconLarge}>⚡</Text>
            <Text style={styles.settingLabel}>New rewards</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              disabled={isLoading}
              trackColor={{ false: colors.cardBorder, true: colors.success }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.cardBorder}
            />
          </View>
        </View>

        {/* Other Apps Section */}
        <Text style={styles.sectionHeader}>Other apps</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleOpenLink('https://facebook.com')}
        >
          <View style={styles.appRow}>
            <Text style={styles.iconMedium}>📘</Text>
            <Text style={styles.appLabel}>Facebook Travel Rewards</Text>
          </View>
        </TouchableOpacity>

        {/* Game Apps */}
        <Text style={styles.sectionHeader}>Game Rewards</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.gameRow}>
            <View style={styles.gameIconContainer}>
              <Text style={styles.iconMedium}>🎲</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Go'Rewards</Text>
              <Text style={styles.gameSubtitle}>MONOPOLY GO!</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.gameRow}>
            <View style={styles.gameIconContainer}>
              <Text style={styles.iconMedium}>🎲</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Dreams Rewards</Text>
              <Text style={styles.gameSubtitle}>Dice Dreams™</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.gameRow}>
            <View style={styles.gameIconContainer}>
              <Text style={styles.iconMedium}>⚡</Text>
            </View>
            <View style={styles.gameInfo}>
              <Text style={styles.gameTitle}>Islander Rewards</Text>
              <Text style={styles.gameSubtitle}>Family Island</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Information Section */}
        <Text style={styles.sectionHeader}>Information</Text>
        <View style={styles.card}>
          <View style={styles.versionRow}>
            <View style={styles.versionLeft}>
              <Text style={styles.iconSmall}>‹›</Text>
              <Text style={styles.versionLabel}>Version</Text>
            </View>
            <Text style={styles.versionNumber}>{APP_CONFIG.VERSION}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.disclaimerText}>
            Travel Rewards is an independent application and is in no way affiliated with, endorsed, or approved by Magmatic Games LTD or Travel Town
          </Text>
        </View>

        {/* Privacy & Terms */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => handleOpenLink(ENV.PRIVACY_POLICY_URL)}>
            <Text style={styles.linkText}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={styles.linkSeparator}>•</Text>
          <TouchableOpacity onPress={() => handleOpenLink(ENV.TERMS_URL)}>
            <Text style={styles.linkText}>Terms of Service</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <NotificationPermissionModal
        visible={showPermModal}
        onAllow={handleModalAllow}
        onNotNow={handleModalNotNow}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.header,
    paddingTop: spacing.xl + 20,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 28,
    color: colors.textPrimary,
  },
  headerTitle: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: spacing.lg,
  },
  sectionHeader: {
    fontSize: typography.sizes.lg,
    fontFamily: typography.family.bold,
    color: colors.textHeader,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    ...shadows.sm,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconImage: {
    width: 28,
    height: 28,
    marginRight: spacing.md,
  },
  iconLarge: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  iconMedium: {
    fontSize: 24,
  },
  iconSmall: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  settingLabel: {
    flex: 1,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appLabel: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    marginLeft: spacing.md,
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  gameIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  gameInfo: {
    flex: 1,
  },
  gameTitle: {
    fontSize: typography.sizes.md,
    fontFamily: typography.family.semibold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  gameSubtitle: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  chevron: {
    fontSize: 28,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginVertical: spacing.sm,
  },
  versionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  versionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionLabel: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  versionNumber: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  disclaimerText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  linksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.xxl,
  },
  linkText: {
    fontSize: typography.sizes.sm,
    color: colors.buttonBlue,
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginHorizontal: spacing.sm,
  },
});

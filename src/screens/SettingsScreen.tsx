/**
 * Settings Screen
 * App settings and preferences
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';
import { APP_CONFIG } from '../core/constants/config';
import { STORAGE_KEYS } from '../core/types';
import { 
  requestNotificationPermissions,
  scheduleTestNotification 
} from '../core/notifications/permissions';

export const SettingsScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async (): Promise<void> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const settings = JSON.parse(saved);
        setNotificationsEnabled(settings.notificationsEnabled ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async (enabled: boolean): Promise<void> => {
    try {
      const settings = { notificationsEnabled: enabled };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      setNotificationsEnabled(enabled);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const handleNotificationToggle = async (value: boolean): Promise<void> => {
    if (value) {
      // Request permission when enabling
      const granted = await requestNotificationPermissions();
      if (granted) {
        saveSettings(value);
        Alert.alert(
          'Notifications Enabled',
          'You will receive notifications when new rewards are available.'
        );
      } else {
        Alert.alert(
          'Permission Denied',
          'Please enable notifications in your device settings to receive updates.'
        );
      }
    } else {
      saveSettings(value);
    }
  };

  const handleTestNotification = async (): Promise<void> => {
    if (!notificationsEnabled) {
      Alert.alert('Notifications Disabled', 'Please enable notifications first.');
      return;
    }

    await scheduleTestNotification();
    Alert.alert('Test Sent', 'You should receive a notification in a few seconds.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Text style={styles.settingDescription}>
              Get notified when new rewards are available
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            trackColor={{ false: colors.cardBorder, true: colors.buttonGreen }}
            thumbColor={colors.white}
            accessible={true}
            accessibilityRole="switch"
            accessibilityLabel="Push Notifications"
            accessibilityHint="Toggle to enable or disable push notifications for new rewards"
          />
        </View>

        {notificationsEnabled && (
          <TouchableOpacity 
            style={styles.settingRow}
            onPress={handleTestNotification}
            activeOpacity={0.7}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Test Notification"
            accessibilityHint="Send a test notification to verify settings"
          >
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Test Notification</Text>
              <Text style={styles.settingDescription}>
                Send a test notification to your device
              </Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>App Version</Text>
            <Text style={styles.settingValue}>{APP_CONFIG.APP_VERSION}</Text>
          </View>
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingLabel}>App Name</Text>
            <Text style={styles.settingValue}>{APP_CONFIG.APP_NAME}</Text>
          </View>
        </View>
      </View>

      {/* Future Features Placeholder */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>More</Text>
        
        <View style={[styles.settingRow, styles.disabledRow]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, styles.disabledText]}>
              Other Apps
            </Text>
            <Text style={styles.settingDescription}>
              Coming soon in v2.0
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  settingRow: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadows.sm,
  },
  settingInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  settingLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  settingDescription: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  settingValue: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  disabledRow: {
    opacity: 0.6,
  },
  disabledText: {
    color: colors.textLight,
  },
  arrow: {
    fontSize: typography.sizes.xl,
    color: colors.textSecondary,
  },
});

/**
 * Notification Permission Modal
 * In-app rationale shown before the OS permission dialog.
 * Shown every launch until the user grants or the OS permanently blocks.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';

interface NotificationPermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onNotNow: () => void;
}

export const NotificationPermissionModal: React.FC<NotificationPermissionModalProps> = ({
  visible,
  onAllow,
  onNotNow,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onNotNow}
    >
      <Pressable style={styles.backdrop} onPress={onNotNow}>
        <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🔔</Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Don't Miss Out!</Text>

          {/* Body */}
          <Text style={styles.body}>
            Get instant alerts when new daily rewards drop — free energy, coins and gems.
            {'\n\n'}
            Be the first to claim before they expire.
          </Text>

          {/* Allow button */}
          <TouchableOpacity
            style={styles.allowButton}
            onPress={onAllow}
            activeOpacity={0.85}
          >
            <Text style={styles.allowText}>Allow Notifications</Text>
          </TouchableOpacity>

          {/* Not now */}
          <TouchableOpacity
            style={styles.notNowButton}
            onPress={onNotNow}
            activeOpacity={0.6}
          >
            <Text style={styles.notNowText}>Not now</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    ...shadows.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: colors.cardBorder,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.family.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  body: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  allowButton: {
    backgroundColor: colors.accent,
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  allowText: {
    fontSize: typography.sizes.md,
    fontFamily: typography.family.bold,
    color: colors.white,
  },
  notNowButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  notNowText: {
    fontSize: typography.sizes.sm,
    color: colors.textLight,
  },
});

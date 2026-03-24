/**
 * Notification Permission Modal
 * In-app rationale shown before the OS permission dialog
 * All text content is now configurable via gameConfig.ts
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
import { TEXT_CONFIG } from '../core/constants/gameConfig';

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
          <Text style={styles.title}>{TEXT_CONFIG.notificationPermission.modalTitle}</Text>

          {/* Body */}
          <Text style={styles.body}>
            {TEXT_CONFIG.notificationPermission.modalBody}
          </Text>

          {/* Allow button */}
          <TouchableOpacity
            style={styles.allowButton}
            onPress={onAllow}
            activeOpacity={0.85}
          >
            <Text style={styles.allowText}>{TEXT_CONFIG.notificationPermission.allowButton}</Text>
          </TouchableOpacity>

          {/* Not now */}
          <TouchableOpacity
            style={styles.notNowButton}
            onPress={onNotNow}
            activeOpacity={0.6}
          >
            <Text style={styles.notNowText}>{TEXT_CONFIG.notificationPermission.dismissButton}</Text>
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

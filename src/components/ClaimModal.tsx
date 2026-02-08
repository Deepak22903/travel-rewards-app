/**
 * Claim Modal Component
 * Modal for displaying reward details and claim functionality
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Pressable,
  Linking,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Reward } from '../core/types';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';

interface ClaimModalProps {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ visible, reward, onClose }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (): Promise<void> => {
    if (!reward) return;

    try {
      await Clipboard.setStringAsync(reward.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      Alert.alert('Error', 'Failed to copy link');
    }
  };

  const handleClaim = async (): Promise<void> => {
    if (!reward) return;

    try {
      const supported = await Linking.canOpenURL(reward.url);
      if (supported) {
        await Linking.openURL(reward.url);
        onClose();
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  if (!reward) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.rewardIcon}>
              {reward.icon === 'energy' ? '⚡' : reward.icon === 'coins' ? '🪙' : '💎'}
            </Text>
            <Text style={styles.title}>{reward.label}</Text>
          </View>

          {/* URL Display */}
          <View style={styles.urlContainer}>
            <Text style={styles.urlLabel}>Reward Link:</Text>
            <View style={styles.urlBox}>
              <Text style={styles.urlText} numberOfLines={2} ellipsizeMode="middle">
                {reward.url}
              </Text>
            </View>
          </View>

          {/* Copy Feedback */}
          {copied && (
            <View style={styles.copiedBanner}>
              <Text style={styles.copiedText}>✓ Copied to clipboard!</Text>
            </View>
          )}

          {/* Expired Warning */}
          {reward.expired && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>⚠️ This reward may have expired</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.copyButton]}
              onPress={handleCopy}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>📋</Text>
              <Text style={styles.buttonText}>Copy Link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.claimButton]}
              onPress={handleClaim}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>🎁</Text>
              <Text style={[styles.buttonText, styles.claimButtonText]}>Claim Reward</Text>
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.closeButtonText}>Close</Text>
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
  modalContainer: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    width: '100%',
    maxWidth: 400,
    ...shadows.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  rewardIcon: {
    fontSize: 64,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  urlContainer: {
    marginBottom: spacing.md,
  },
  urlLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  urlBox: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
  },
  urlText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    fontFamily: 'monospace',
  },
  copiedBanner: {
    backgroundColor: colors.success,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  copiedText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.white,
  },
  warningBanner: {
    backgroundColor: colors.warning,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  warningText: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    color: colors.white,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  copyButton: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  claimButton: {
    backgroundColor: colors.buttonGreen,
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: spacing.xs,
  },
  buttonText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  claimButtonText: {
    color: colors.white,
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  closeButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

/**
 * Claim Modal Component
 * Modal for displaying reward details and claim functionality
 */

import React from 'react';
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
import { Reward } from '../core/types';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';

interface ClaimModalProps {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
  onClaim: (reward: Reward) => void;
}

export const ClaimModal: React.FC<ClaimModalProps> = ({ visible, reward, onClose, onClaim }) => {
  const handleClaim = async (): Promise<void> => {
    if (!reward) return;

    try {
      const supported = await Linking.canOpenURL(reward.url);
      if (supported) {
        // Mark as claimed before opening the link
        onClaim(reward);
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

          {/* Expired Warning */}
          {reward.expired && (
            <View style={styles.warningBanner}>
              <Text style={styles.warningText}>⚠️ This reward may have expired</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.closeButtonStyle]}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.claimButton]}
              onPress={handleClaim}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonIcon}>🎁</Text>
              <Text style={[styles.buttonText, styles.claimButtonText]}>Claim</Text>
            </TouchableOpacity>
          </View>
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
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
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
  closeButtonStyle: {
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
});

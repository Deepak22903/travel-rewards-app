/**
 * Claim Modal (NativeBase Version)
 * Modal for claiming rewards with copy and open functionality
 */

import React, { useState, useCallback } from 'react';
import { Linking } from 'react-native';
import {
  Modal,
  VStack,
  HStack,
  Text,
  Button,
  useToast,
  Badge,
} from 'native-base';
import * as Clipboard from 'expo-clipboard';
import { Reward } from '../core/types';

interface ClaimModalProps {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
  onClaim?: (reward: Reward) => void;
}

export const ClaimModalNB: React.FC<ClaimModalProps> = ({
  visible,
  reward,
  onClose,
  onClaim,
}) => {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  const handleCopy = useCallback(async () => {
    if (!reward) return;
    
    await Clipboard.setStringAsync(reward.url);
    setCopied(true);
    
    toast.show({
      description: '✓ Link copied to clipboard',
      placement: 'top',
      duration: 2000,
    });
    
    setTimeout(() => setCopied(false), 2000);
  }, [reward, toast]);

  const handleClaim = useCallback(() => {
    if (!reward) return;
    
    // Call onClaim callback if provided
    if (onClaim) {
      onClaim(reward);
    }
    
    // Open URL
    Linking.openURL(reward.url).catch((err) => {
      console.error('Failed to open URL:', err);
      toast.show({
        description: 'Unable to open reward link',
        placement: 'top',
        status: 'error',
      });
    });
    
    // Close modal after short delay
    setTimeout(() => {
      onClose();
    }, 500);
  }, [reward, onClaim, onClose, toast]);

  if (!reward) return null;

  return (
    <Modal isOpen={visible} onClose={onClose} size="lg">
      <Modal.Content>
        <Modal.CloseButton />
        
        {/* Header */}
        <Modal.Header bg="primary.100" _text={{ color: 'primary.800' }}>
          <HStack alignItems="center" space={2}>
            <Text fontSize="2xl">
              {reward.icon === 'energy' ? '⚡' : reward.icon === 'coins' ? '🪙' : '💎'}
            </Text>
            <Text fontWeight="bold" color="primary.800" fontSize="lg">
              {reward.label}
            </Text>
            {reward.claimed && (
              <Badge colorScheme="success" variant="solid" ml={2}>
                Claimed
              </Badge>
            )}
          </HStack>
        </Modal.Header>

        {/* Body */}
        <Modal.Body>
          <VStack space={4}>
            {/* Reward Link */}
            <VStack space={2}>
              <Text fontWeight="semibold" color="primary.700" fontSize="sm">
                Reward Link:
              </Text>
              <Text
                fontSize="xs"
                color="primary.600"
                numberOfLines={2}
                ellipsizeMode="middle"
                bg="primary.50"
                p={2}
                borderRadius="md"
              >
                {reward.url}
              </Text>
            </VStack>

            {/* Claimed Status Message */}
            {reward.claimed && (
              <HStack
                bg="success.100"
                p={3}
                borderRadius="md"
                alignItems="center"
                space={2}
              >
                <Text fontSize="lg">✓</Text>
                <Text color="success.800" fontSize="sm" flex={1}>
                  You've already claimed this reward. You can claim it again or copy the link.
                </Text>
              </HStack>
            )}

            {/* Expired Warning */}
            {reward.expired && (
              <HStack
                bg="error.100"
                p={3}
                borderRadius="md"
                alignItems="center"
                space={2}
              >
                <Text fontSize="lg">⚠️</Text>
                <Text color="error.800" fontSize="sm" flex={1}>
                  This reward may have expired. Try claiming anyway or check for newer rewards.
                </Text>
              </HStack>
            )}

            {/* Action Buttons */}
            <HStack space={3}>
              <Button
                flex={1}
                variant="outline"
                colorScheme="primary"
                onPress={handleCopy}
                leftIcon={<Text fontSize="md">{copied ? '✓' : '📋'}</Text>}
                _text={{ fontWeight: 'semibold' }}
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </Button>

              <Button
                flex={1}
                colorScheme="success"
                onPress={handleClaim}
                leftIcon={<Text fontSize="md">🚀</Text>}
                _text={{ fontWeight: 'semibold' }}
                isDisabled={reward.expired}
              >
                Claim Reward
              </Button>
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

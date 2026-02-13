/**
 * Rewards Screen (NativeBase Version)
 * Displays daily game rewards grouped by date
 */

import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  VStack,
  HStack,
  Text,
  SectionList,
  Pressable,
  Spinner,
  Center,
  Button,
  Badge,
  useToast,
} from 'native-base';
import { RefreshControl } from 'react-native';
import { Reward, RewardSection, STORAGE_KEYS } from '../core/types';
import { getRewards } from '../core/api/rewards';
import { ClaimModalNB as ClaimModal } from '../components/ClaimModalNB';
import { BannerAd } from '../components/BannerAd';
import { useInterstitialAd } from '../core/ads/useInterstitialAd';
import { shouldShowInterstitial } from '../core/ads/adConfig';
import { logError, logStorageError } from '../core/utils/errorLogger';

export const RewardsScreenNB: React.FC = () => {
  const [sections, setSections] = useState<RewardSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  
  const { isLoaded: adLoaded, show: showInterstitial } = useInterstitialAd();
  const toast = useToast();

  const loadClaimedRewards = async (): Promise<void> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.CLAIMED_REWARDS);
      if (saved) {
        const claimed = JSON.parse(saved);
        setClaimedRewards(new Set(claimed));
      }
      setInitialized(true);
    } catch (error) {
      logStorageError(error, 'read', STORAGE_KEYS.CLAIMED_REWARDS);
      setInitialized(true);
    }
  };

  const saveClaimedRewards = useCallback(async (claimed: Set<string>): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CLAIMED_REWARDS, 
        JSON.stringify(Array.from(claimed))
      );
    } catch (error) {
      logStorageError(error, 'write', STORAGE_KEYS.CLAIMED_REWARDS);
    }
  }, []);

  const fetchRewards = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const response = await getRewards();
      
      if (response.success && response.data) {
        const updatedSections = response.data.map(section => ({
          ...section,
          data: section.data.map(reward => ({
            ...reward,
            claimed: claimedRewards.has(reward.id),
          })),
        }));
        setSections(updatedSections);
        setInfoMessage(response.message || '');
      } else {
        setError(response.error || 'Failed to load rewards');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      logError(err, { screen: 'Rewards', action: 'fetchRewards' });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [claimedRewards]);

  useEffect(() => {
    loadClaimedRewards();
  }, []);

  useEffect(() => {
    if (initialized) {
      fetchRewards();
    }
  }, [initialized, fetchRewards]);

  const handleRefresh = useCallback((): void => {
    setRefreshing(true);
    loadClaimedRewards().then(() => fetchRewards());
  }, [fetchRewards]);

  const handleRewardPress = useCallback((reward: Reward): void => {
    const showAd = async () => {
      if (adLoaded && await shouldShowInterstitial()) {
        showInterstitial();
      }
    };
    showAd();
    
    setSelectedReward(reward);
    setModalVisible(true);
  }, [adLoaded, showInterstitial]);

  const handleClaimReward = useCallback((reward: Reward): void => {
    if (!reward.claimed) {
      const newClaimed = new Set(claimedRewards);
      newClaimed.add(reward.id);
      setClaimedRewards(newClaimed);
      saveClaimedRewards(newClaimed);
      
      setSections(prev => prev.map(section => ({
        ...section,
        data: section.data.map(r => 
          r.id === reward.id ? { ...r, claimed: true } : r
        ),
      })));
      
      setSelectedReward({ ...reward, claimed: true });
      
      toast.show({
        description: '✓ Reward claimed!',
        placement: 'top',
        duration: 2000,
      });
    }
  }, [claimedRewards, saveClaimedRewards, toast]);

  const handleCloseModal = useCallback((): void => {
    setModalVisible(false);
    setSelectedReward(null);
  }, []);

  const renderRewardCard = useCallback(({ item }: { item: Reward }): React.JSX.Element => (
    <Pressable
      onPress={() => handleRewardPress(item)}
      opacity={item.expired ? 0.5 : 1}
      disabled={item.expired}
    >
      {({ isPressed }) => (
        <Box
          bg={isPressed ? 'primary.100' : 'primary.50'}
          borderColor="primary.200"
          borderWidth={1}
          borderRadius="lg"
          p={4}
          mb={3}
          shadow={isPressed ? 1 : 2}
        >
          <HStack alignItems="center" justifyContent="space-between">
            {/* Icon & Label */}
            <HStack alignItems="center" flex={1} space={3}>
              <Text fontSize="3xl">
                {item.icon === 'energy' ? '⚡' : item.icon === 'coins' ? '🪙' : '💎'}
              </Text>
              <Text
                fontWeight="bold"
                color={item.expired ? 'primary.400' : 'primary.800'}
                fontSize="md"
                flex={1}
              >
                {item.label}
              </Text>
            </HStack>

            {/* Status Badges */}
            {item.claimed && (
              <HStack alignItems="center" space={1}>
                <Badge colorScheme="success" variant="solid">
                  Claimed
                </Badge>
                <Text fontSize="md" color="success.500" fontWeight="bold">✓</Text>
              </HStack>
            )}
            {item.expired && (
              <Badge colorScheme="error" variant="subtle">
                Expired
              </Badge>
            )}
            {!item.claimed && !item.expired && (
              <Text color="primary.400" fontSize="xl">›</Text>
            )}
          </HStack>
        </Box>
      )}
    </Pressable>
  ), [handleRewardPress]);

  const renderSectionHeader = useCallback(({ section }: { section: RewardSection }): React.JSX.Element => (
    <Box bg="primary.100" py={3} px={2}>
      <Text fontSize="lg" fontWeight="semibold" color="primary.800">
        {section.title}
      </Text>
    </Box>
  ), []);

  // Loading State
  if (loading) {
    return (
      <Center flex={1} bg="primary.100">
        <VStack space={4} alignItems="center">
          <Spinner size="lg" color="accent.500" />
          <Text fontSize="md" color="primary.500">
            Loading rewards...
          </Text>
        </VStack>
      </Center>
    );
  }

  // Error State
  if (error) {
    return (
      <Center flex={1} bg="primary.100" px={8}>
        <VStack space={4} alignItems="center">
          <Text fontSize="6xl">🔌</Text>
          <Text fontSize="xl" fontWeight="bold" color="primary.800" textAlign="center">
            Connection Error
          </Text>
          <Text fontSize="md" color="primary.500" textAlign="center" lineHeight="xl">
            {error}
          </Text>
          <Button
            onPress={() => fetchRewards()}
            colorScheme="success"
            size="lg"
            shadow={3}
          >
            Try Again
          </Button>
        </VStack>
      </Center>
    );
  }

  // Empty State
  if (sections.length === 0) {
    return (
      <Center flex={1} bg="primary.100" px={8}>
        <VStack space={4} alignItems="center">
          <Text fontSize="6xl">🎁</Text>
          <Text fontSize="xl" fontWeight="bold" color="primary.800" textAlign="center">
            No Rewards Yet
          </Text>
          <Text fontSize="md" color="primary.500" textAlign="center">
            Check back later for new rewards!
          </Text>
          <Button
            onPress={() => fetchRewards()}
            colorScheme="primary"
            variant="outline"
            size="lg"
          >
            Refresh
          </Button>
        </VStack>
      </Center>
    );
  }

  // Main Content
  return (
    <Box flex={1} bg="primary.100">
      {/* Info Banner */}
      {infoMessage ? (
        <Box bg="accent.500" px={4} py={3} borderBottomWidth={1} borderBottomColor="primary.200">
          <Text fontSize="sm" color="white" textAlign="center" lineHeight="sm">
            {infoMessage}
          </Text>
        </Box>
      ) : null}
      
      {/* Rewards List */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderRewardCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#F5A623"
          />
        }
      />
      
      {/* Banner Ad */}
      <BannerAd />

      {/* Claim Modal */}
      <ClaimModal
        visible={modalVisible}
        reward={selectedReward}
        onClose={handleCloseModal}
        onClaim={handleClaimReward}
      />
    </Box>
  );
};

/**
 * Rewards Screen
 * Displays daily game rewards grouped by date
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';
import { Reward, RewardSection, STORAGE_KEYS } from '../core/types';
import { getRewards } from '../core/api/rewards';
import { ClaimModal } from '../components/ClaimModal';
import { BannerAd } from '../components/BannerAd';
import { useInterstitialAd } from '../core/ads/useInterstitialAd';
import { shouldShowInterstitial } from '../core/ads/adConfig';

export const RewardsScreen: React.FC = () => {
  const [sections, setSections] = useState<RewardSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [infoMessage, setInfoMessage] = useState<string>('');
  const [claimedRewards, setClaimedRewards] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);
  
  // Interstitial ad hook
  const { isLoaded: adLoaded, show: showInterstitial } = useInterstitialAd();

  const loadClaimedRewards = async (): Promise<void> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.CLAIMED_REWARDS);
      if (saved) {
        const claimed = JSON.parse(saved);
        setClaimedRewards(new Set(claimed));
      }
      setInitialized(true);  // Mark as initialized after first load
    } catch (error) {
      console.error('Error loading claimed rewards:', error);
      setInitialized(true);
    }
  };

  const saveClaimedRewards = async (claimed: Set<string>): Promise<void> => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.CLAIMED_REWARDS, 
        JSON.stringify(Array.from(claimed))
      );
    } catch (error) {
      console.error('Error saving claimed rewards:', error);
    }
  };

  const fetchRewards = async (): Promise<void> => {
    try {
      setError(null);
      const response = await getRewards();
      
      if (response.success && response.data) {
        // Mark rewards as claimed based on stored data
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
      console.error('Fetch rewards error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadClaimedRewards();
  }, []);

  useEffect(() => {
    // Only fetch rewards after claimed rewards are initialized
    if (initialized) {
      fetchRewards();
    }
  }, [initialized]);  // Fetch when initialization is complete

  const handleRefresh = (): void => {
    setRefreshing(true);
    loadClaimedRewards().then(() => fetchRewards());
  };

  const handleRewardPress = (reward: Reward): void => {
    // Show interstitial ad when user taps reward card
    const showAd = async () => {
      if (adLoaded && await shouldShowInterstitial()) {
        showInterstitial();
      }
    };
    showAd();
    
    setSelectedReward(reward);
    setModalVisible(true);
  };

  const handleClaimReward = (reward: Reward): void => {
    // Mark reward as claimed
    if (!reward.claimed) {
      const newClaimed = new Set(claimedRewards);
      newClaimed.add(reward.id);
      setClaimedRewards(newClaimed);
      saveClaimedRewards(newClaimed);
      
      // Update the reward in sections
      setSections(prev => prev.map(section => ({
        ...section,
        data: section.data.map(r => 
          r.id === reward.id ? { ...r, claimed: true } : r
        ),
      })));
      
      // Update selected reward to show claimed status
      setSelectedReward({ ...reward, claimed: true });
    }
  };

  const handleCloseModal = (): void => {
    setModalVisible(false);
    setSelectedReward(null);
  };

  const renderRewardCard = ({ item }: { item: Reward }): React.JSX.Element => (
    <TouchableOpacity
      style={[styles.card, item.expired && styles.cardExpired]}
      onPress={() => handleRewardPress(item)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}${item.claimed ? ', claimed' : ''}${item.expired ? ', expired' : ''}`}
      accessibilityHint="Tap to claim this reward"
      accessibilityState={{ disabled: item.expired }}
    >
      <View style={styles.cardContent}>
        <Text style={styles.rewardIcon}>
          {item.icon === 'energy' ? '⚡' : item.icon === 'coins' ? '🪙' : '💎'}
        </Text>
        <Text style={[styles.rewardLabel, item.expired && styles.textExpired]}>
          {item.label}
        </Text>
      </View>
      {item.claimed && (
        <View style={styles.statusContainer}>
          <Text style={styles.claimedBadge}>Claimed</Text>
          <Text style={styles.claimedIcon}>✓</Text>
        </View>
      )}
      {item.expired && (
        <Text style={styles.expiredBadge}>Expired</Text>
      )}
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section }: { section: RewardSection }): React.JSX.Element => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading rewards...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorEmoji}>🔌</Text>
        <Text style={styles.errorTitle}>Connection Error</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchRewards}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Try Again"
          accessibilityHint="Retry loading rewards"
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (sections.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyEmoji}>🎁</Text>
        <Text style={styles.emptyTitle}>No Rewards Yet</Text>
        <Text style={styles.emptyText}>Check back later for new rewards!</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={fetchRewards}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel="Refresh"
          accessibilityHint="Check for new rewards"
        >
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {infoMessage ? (
        <View style={styles.infoBar}>
          <Text style={styles.infoText}>{infoMessage}</Text>
        </View>
      ) : null}
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderRewardCard}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
      />
      
      {/* Banner Ad at bottom */}
      <BannerAd />

      <ClaimModal
        visible={modalVisible}
        reward={selectedReward}
        onClose={handleCloseModal}
        onClaim={handleClaimReward}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  infoBar: {
    backgroundColor: colors.accent,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  infoText: {
    fontSize: typography.sizes.sm,
    color: colors.white,
    textAlign: 'center',
    lineHeight: 18,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  listContent: {
    padding: spacing.md,
  },
  sectionHeader: {
    backgroundColor: colors.background,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  card: {
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
  cardExpired: {
    opacity: 0.5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rewardIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  rewardLabel: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.sm,
    backgroundColor: colors.buttonGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    gap: spacing.xs,
  },
  claimedBadge: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.white,
    textTransform: 'uppercase',
  },
  claimedIcon: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 'bold',
  },
  textExpired: {
    color: colors.textLight,
  },
  expiredBadge: {
    fontSize: typography.sizes.xs,
    fontWeight: '600',
    color: colors.error,
    textTransform: 'uppercase',
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  errorTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  retryButton: {
    backgroundColor: colors.buttonGreen,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  retryButtonText: {
    fontSize: typography.sizes.md,
    fontWeight: '600',
    color: colors.white,
  },
});

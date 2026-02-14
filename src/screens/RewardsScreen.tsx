/**
 * Rewards Screen - Redesigned to Match Target App
 * Displays daily game rewards grouped by date with brown header and styled cards
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, typography, borderRadius, shadows } from '../core/constants/theme';
import { Reward, RewardSection, STORAGE_KEYS } from '../core/types';
import { getRewards } from '../core/api/rewards';
import { ClaimModal } from '../components/ClaimModal';
import { BannerAd } from '../components/BannerAd';
import { useInterstitialAd } from '../core/ads/useInterstitialAd';
import { shouldShowInterstitial } from '../core/ads/adConfig';
import { logError, logStorageError } from '../core/utils/errorLogger';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../core/types';

type RewardsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Rewards'>;

interface RewardsScreenProps {
  navigation: RewardsScreenNavigationProp;
}

export const RewardsScreen: React.FC<RewardsScreenProps> = ({ navigation }) => {
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
    }
  }, [claimedRewards, saveClaimedRewards]);

  const handleCloseModal = useCallback((): void => {
    setModalVisible(false);
    setSelectedReward(null);
  }, []);

  const renderRewardCard = useCallback(({ item }: { item: Reward }): React.JSX.Element => (
    <TouchableOpacity
      style={[styles.card, item.claimed && styles.cardClaimed]}
      onPress={() => handleRewardPress(item)}
      activeOpacity={0.7}
      disabled={item.expired}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}${item.claimed ? ', claimed' : ''}${item.expired ? ', expired' : ''}`}
      accessibilityHint="Tap to claim this reward"
    >
      <View style={styles.cardContent}>
        <Text style={styles.rewardIcon}>⚡</Text>
        <Text style={[styles.rewardLabel, item.claimed && styles.textClaimed]}>
          {item.label}
        </Text>
      </View>
      <View style={[styles.actionIcon, item.claimed && styles.actionIconClaimed]}>
        <Image
          source={item.claimed
            ? require('../../assets/icons8-checkbox-100.png')
            : require('../../assets/icons8-unchecked-checkbox-100.png')
          }
          style={styles.actionIconImage}
          resizeMode="contain"
        />
      </View>
    </TouchableOpacity>
  ), [handleRewardPress]);

  const renderSectionHeader = useCallback(({ section }: { section: RewardSection }): React.JSX.Element => (
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
    </View>
  ), []);

  const ListHeaderComponent = useCallback((): React.JSX.Element => (
    <>
      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerText}>
          Rewards are valid for a few days. If they don't work, they may have expired or already been used on your account.
        </Text>
      </View>
      <BannerAd />
    </>
  ), []);

  if (loading) {
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
          <Text style={styles.headerTitle}>Rewards</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Loading rewards...</Text>
        </View>
      </View>
    );
  }

  if (error) {
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
          <Text style={styles.headerTitle}>Rewards</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>🔌</Text>
          <Text style={styles.errorTitle}>Connection Error</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
            <Text style={styles.retryText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Rewards</Text>
        <View style={styles.headerSpacer} />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderRewardCard}
        renderSectionHeader={renderSectionHeader}
        ListHeaderComponent={ListHeaderComponent}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
        stickySectionHeadersEnabled={false}
      />

      {selectedReward && (
        <ClaimModal
          visible={modalVisible}
          reward={selectedReward}
          onClaim={handleClaimReward}
          onClose={handleCloseModal}
        />
      )}
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
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 40,
  },
  infoBanner: {
    backgroundColor: colors.header,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  infoBannerText: {
    fontSize: typography.sizes.sm,
    color: colors.textHeader,
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    paddingBottom: spacing.lg,
  },
  sectionHeaderContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    ...shadows.sm,
  },
  cardClaimed: {
    backgroundColor: colors.claimed,
    opacity: 0.7,
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
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  textClaimed: {
    color: colors.textSecondary,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: colors.header,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // actionIconClaimed: {
  //   backgroundColor: colors.backgroundLight,
  // },
  actionIconImage: {
    width: 24,
    height: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
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
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  errorMessage: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  retryText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.white,
  },
});

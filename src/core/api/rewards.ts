/**
 * Rewards API
 * API calls for fetching rewards data with mock data for development
 */

import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, RewardsApiResponse, RewardSection } from '../types';

const REWARDS_CACHE_KEY = '@travel_rewards:cached_rewards';

const FALLBACK_REWARDS: RewardSection[] = [
  {
    title: 'Today',
    data: [
      {
        id: 'fallback_reward_001',
        label: '15 Energy',
        icon: 'energy',
        url: 'https://example.com/claim/fallback-1',
        expired: true,
      },
      {
        id: 'fallback_reward_002',
        label: '25 Coins',
        icon: 'coins',
        url: 'https://example.com/claim/fallback-2',
        expired: true,
      },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      {
        id: 'fallback_reward_003',
        label: '10 Gems',
        icon: 'gems',
        url: 'https://example.com/claim/fallback-3',
        expired: true,
      },
    ],
  },
];

/**
 * Fetch rewards from API
 */
export const getRewards = async (): Promise<ApiResponse<RewardSection[]>> => {
  try {
    const response = await client.get<RewardsApiResponse>('/rewards');
    if (!response.data?.data || !Array.isArray(response.data.data)) {
      throw new Error('Invalid rewards payload');
    }

    // Normalize: backend may return 'url' (new) or 'code' (legacy) — prefer 'url'
    const data = response.data.data.map(section => ({
      ...section,
      data: section.data.map(reward => ({
        ...reward,
        url: (reward as any).url ?? (reward as any).code,
      })),
    }));

    await AsyncStorage.setItem(REWARDS_CACHE_KEY, JSON.stringify(data));

    return {
      success: true,
      message: response.data.message,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch rewards:', error);

    try {
      const cached = await AsyncStorage.getItem(REWARDS_CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as RewardSection[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            success: true,
            message: 'Showing last saved rewards. Pull to refresh when network is available.',
            data: parsed,
          };
        }
      }
    } catch (cacheError) {
      console.error('Failed to load cached rewards:', cacheError);
    }

    return {
      success: true,
      message: 'Rewards are temporarily unavailable. Please try again later.',
      data: FALLBACK_REWARDS,
    };
  }
};

/**
 * Refresh rewards data
 * Alias for getRewards with explicit refresh intent
 */
export const refreshRewards = async (): Promise<ApiResponse<RewardSection[]>> => {
  return getRewards();
};

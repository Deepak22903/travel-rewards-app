/**
 * Rewards API
 * API calls for fetching rewards data with mock data for development
 */

import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, RewardsApiResponse, RewardSection } from '../types';

const REWARDS_CACHE_KEY = '@travel_rewards:cached_rewards';

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
    return {
      success: false,
      error: 'Connection error. Please turn on Wi-Fi or mobile data to get the latest rewards.',
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

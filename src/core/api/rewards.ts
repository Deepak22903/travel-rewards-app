/**
 * Rewards API
 * API calls for fetching rewards data with mock data for development
 */

import client from './client';
import { ApiResponse, RewardsApiResponse, RewardSection } from '../types';

// Mock data for development
const MOCK_REWARDS: RewardsApiResponse = {
  success: true,
  message: 'Rewards are valid for a few days. If they don\'t work, they may have expired or already been used on your account.',
  sections: [
    {
      date: '2026-02-08',
      title: 'February 8',
      data: [
        {
          id: 'reward_001',
          label: '15 Energy',
          icon: 'energy',
          url: 'https://game.link/claim/abc123',
          expired: false,
        },
        {
          id: 'reward_002',
          label: '10 Energy',
          icon: 'energy',
          url: 'https://game.link/claim/def456',
          expired: false,
        },
        {
          id: 'reward_003',
          label: '50 Coins',
          icon: 'coins',
          url: 'https://game.link/claim/ghi789',
          expired: false,
        },
      ],
    },
    {
      date: '2026-02-07',
      title: 'February 7',
      data: [
        {
          id: 'reward_004',
          label: '25 Energy',
          icon: 'energy',
          url: 'https://game.link/claim/jkl012',
          expired: false,
        },
        {
          id: 'reward_005',
          label: '100 Coins',
          icon: 'coins',
          url: 'https://game.link/claim/mno345',
          expired: false,
        },
        {
          id: 'reward_006',
          label: '5 Gems',
          icon: 'gems',
          url: 'https://game.link/claim/pqr678',
          expired: false,
        },
      ],
    },
    {
      date: '2026-02-06',
      title: 'February 6',
      data: [
        {
          id: 'reward_007',
          label: '30 Energy',
          icon: 'energy',
          url: 'https://game.link/claim/stu901',
          expired: true,
        },
        {
          id: 'reward_008',
          label: '75 Coins',
          icon: 'coins',
          url: 'https://game.link/claim/vwx234',
          expired: true,
        },
      ],
    },
  ],
};

/**
 * Fetch rewards from API
 * Falls back to mock data in development or if API fails
 */
export const getRewards = async (): Promise<ApiResponse<RewardSection[]>> => {
  try {
    // In development, use mock data directly
    if (__DEV__) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        success: true,
        message: MOCK_REWARDS.message,
        data: MOCK_REWARDS.sections,
      };
    }

    // Production: Make actual API call
    const response = await client.get<RewardsApiResponse>('/rewards');
    return {
      success: true,
      message: response.data.message,
      data: response.data.sections,
    };
  } catch (error) {
    console.error('Failed to fetch rewards:', error);
    
    // Fallback to mock data on error
    if (__DEV__) {
      return {
        success: true,
        message: MOCK_REWARDS.message,
        data: MOCK_REWARDS.sections,
      };
    }

    return {
      success: false,
      error: 'Failed to load rewards. Please try again.',
      data: [],
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

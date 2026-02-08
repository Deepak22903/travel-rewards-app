/**
 * Rewards API
 * API calls for fetching rewards data with mock data for development
 */

import client from './client';
import { ApiResponse, RewardsApiResponse, RewardSection } from '../types';

/**
 * Fetch rewards from API
 */
export const getRewards = async (): Promise<ApiResponse<RewardSection[]>> => {
  try {
    const response = await client.get<RewardsApiResponse>('/rewards');
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Failed to fetch rewards:', error);
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

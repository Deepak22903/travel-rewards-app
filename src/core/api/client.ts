/**
 * Axios API Client
 * HTTP client instance with interceptors and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { ENV } from '../constants/config';
import { RewardsApiResponse } from '../types';

// Mock data for development (when backend is unavailable)
const MOCK_REWARDS: RewardsApiResponse = {
  success: true,
  message: "Rewards are valid for a few days. If they don't work, they may have expired or already been used on your account.",
  data: [
    {
      title: 'Today',
      data: [
        {
          id: 'reward_001',
          label: '15 Energy',
          icon: 'energy',
          url: 'https://example.com/claim/abc123',
          expired: false,
        },
        {
          id: 'reward_002',
          label: '25 Coins',
          icon: 'coins',
          url: 'https://example.com/claim/def456',
          expired: false,
        },
        {
          id: 'reward_003',
          label: '10 Gems',
          icon: 'gems',
          url: 'https://example.com/claim/ghi789',
          expired: false,
        },
      ],
    },
    {
      title: 'Yesterday',
      data: [
        {
          id: 'reward_004',
          label: '20 Energy',
          icon: 'energy',
          url: 'https://example.com/claim/jkl012',
          expired: true,
        },
        {
          id: 'reward_005',
          label: '15 Coins',
          icon: 'coins',
          url: 'https://example.com/claim/mno345',
          expired: false,
        },
      ],
    },
    {
      title: 'February 11',
      data: [
        {
          id: 'reward_006',
          label: '30 Energy',
          icon: 'energy',
          url: 'https://example.com/claim/pqr678',
          expired: true,
        },
      ],
    },
  ],
};

// Create axios instance with default config
const client: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
client.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (__DEV__) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
client.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (__DEV__) {
      console.log('API Response:', response.status, response.config.url);
    }
    return response;
  },
  (error: AxiosError) => {
    // In development, return mock data if API fails (for testing without backend)
    if (__DEV__ && error.config?.url?.includes('/rewards')) {
      console.warn('⚠️  API unavailable, using mock data for development');
      return Promise.resolve({
        data: MOCK_REWARDS,
        status: 200,
        statusText: 'OK (Mock Data)',
        headers: {},
        config: error.config,
      } as any);
    }

    // Handle common errors
    if (error.response) {
      // Server responded with error status
      console.error('Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('Network Error: No response received');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default client;

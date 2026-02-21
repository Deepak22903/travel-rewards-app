/**
 * TypeScript Type Definitions
 * Core interfaces and types for the Travel Rewards app
 */

// Reward Icon Types
export type RewardIconType = 'energy' | 'coins' | 'gems';

// Individual Reward Item
export interface Reward {
  id: string;
  label: string;
  icon: RewardIconType;
  url: string;  // Reward claim URL (renamed from 'code' for consistency)
  expired: boolean;
  claimed?: boolean;  // Track if reward has been claimed
}

// Grouped Rewards by Date
export interface RewardSection {
  title: string;       // Display format: "Today", "Yesterday", "February 7"
  data: Reward[];      // Rewards for this section
}

// API Response Structure
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Rewards API Response
export interface RewardsApiResponse {
  success: boolean;
  message: string;
  data: RewardSection[];
}

// Navigation Types
export type RootStackParamList = {
  Home: undefined;
  Rewards: { fromNotification?: number } | undefined;
  Settings: undefined;
};

// Settings State
export interface SettingsState {
  notificationsEnabled: boolean;
}

// Other App Interface (for cross-promotion)
export interface OtherApp {
  id: string;
  name: string;
  subtitle: string;
  icon: string;  // emoji or image
  url: string;
}

// AsyncStorage Keys
export const STORAGE_KEYS = {
  SETTINGS: '@travel_rewards:settings',
  LAST_REFRESH: '@travel_rewards:last_refresh',
  CLAIMED_REWARDS: '@travel_rewards:claimed_rewards',
  NOTIFICATIONS_ENABLED: '@travel_rewards:notifications_enabled',
} as const;

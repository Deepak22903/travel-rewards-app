/**
 * App Configuration
 * Environment-specific settings and constants
 */

// Detect development mode
const isDev = __DEV__;

interface Environment {
  API_BASE_URL: string;
  APP_STORE_URL: string;
  PLAY_STORE_URL: string;
  ADMOB_APP_ID: string;
}

const dev: Environment = {
  API_BASE_URL: 'https://smartlink-api-601738079869.us-central1.run.app/api',
  APP_STORE_URL: 'https://apps.apple.com/app/id123456789',
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.travelrewards',
  ADMOB_APP_ID: 'ca-app-pub-3940256099942544~3347511713', // Test ID
};

const prod: Environment = {
  API_BASE_URL: 'https://smartlink-api-601738079869.us-central1.run.app/api',
  APP_STORE_URL: 'https://apps.apple.com/app/id123456789',
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.travelrewards',
  ADMOB_APP_ID: 'YOUR_PRODUCTION_ADMOB_ID',
};

export const ENV = isDev ? dev : prod;

export const APP_CONFIG = {
  APP_NAME: 'Travel Rewards',
  APP_VERSION: '1.3.1',
  SHARE_MESSAGE: 'Check out Travel Rewards app for daily game rewards!',
  DISCLAIMER: 'Travel Rewards is an independent application and is in no way affiliated with, endorsed, or approved by Magmatic Games LTD or Travel Town',
};

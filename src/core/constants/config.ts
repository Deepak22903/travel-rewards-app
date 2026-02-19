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
  PRIVACY_POLICY_URL: string;
  TERMS_URL: string;
}

const dev: Environment = {
  API_BASE_URL: 'https://consulting-corpus-pumps-council.trycloudflare.com/api',
  APP_STORE_URL: 'https://apps.apple.com/app/id123456789', // TODO: Replace with real App Store URL after listing is created
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.travelrewards.app',
  ADMOB_APP_ID: 'ca-app-pub-3940256099942544~3347511713', // Test ID
  PRIVACY_POLICY_URL: 'https://example.com/privacy-policy', // TODO: Replace with your hosted privacy policy URL
  TERMS_URL: 'https://example.com/terms', // TODO: Replace with your hosted terms of service URL
};

const prod: Environment = {
  API_BASE_URL: 'https://smartlink-api-601738079869.us-central1.run.app/api',
  APP_STORE_URL: 'https://apps.apple.com/app/id123456789', // TODO: Replace with real App Store URL after listing is created
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.travelrewards.app',
  ADMOB_APP_ID: 'YOUR_PRODUCTION_ADMOB_ID', // TODO: Replace with AdMob App ID from AdMob console
  PRIVACY_POLICY_URL: 'https://example.com/privacy-policy', // TODO: Required for store submission — replace with hosted URL
  TERMS_URL: 'https://example.com/terms', // TODO: Required for store submission — replace with hosted URL
};

export const ENV = isDev ? dev : prod;

export const APP_CONFIG = {
  APP_NAME: 'TT Energy - Reward Links',
  APP_VERSION: '1.3.1',
  SHARE_MESSAGE: 'Check out TT Energy - Reward Links app for daily game rewards!',
  DISCLAIMER: 'TT Energy - Reward Links is an independent application and is in no way affiliated with, endorsed, or approved by Magmatic Games LTD or Travel Town',
};

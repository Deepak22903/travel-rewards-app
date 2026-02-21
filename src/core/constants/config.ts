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
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  APP_STORE_URL: 'https://apps.apple.com/app/id123456789', // TODO: Replace with real App Store URL after listing is created
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.travelrewards.app',
  ADMOB_APP_ID: process.env.EXPO_PUBLIC_ADMOB_APP_ID_DEV ?? 'ca-app-pub-3940256099942544~3347511713',
  PRIVACY_POLICY_URL: 'https://ttenergyapp.blogspot.com/p/privacy-policy-tt-energy-app.html',
  TERMS_URL: 'https://ttenergyapp.blogspot.com/p/terms-conditions-tt-energy.html',
};

const prod: Environment = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  APP_STORE_URL: 'https://apps.apple.com/app/id123456789', // TODO: Replace with real App Store URL after listing is created
  PLAY_STORE_URL: 'https://play.google.com/store/apps/details?id=com.travelrewards.app',
  ADMOB_APP_ID: process.env.EXPO_PUBLIC_ADMOB_APP_ID_PROD ?? '',
  PRIVACY_POLICY_URL: 'https://ttenergyapp.blogspot.com/p/privacy-policy-tt-energy-app.html',
  TERMS_URL: 'https://ttenergyapp.blogspot.com/p/terms-conditions-tt-energy.html',
};

export const ENV = isDev ? dev : prod;

export const APP_CONFIG = {
  APP_NAME: 'TT Energy - Reward Links',
  APP_VERSION: '1.3.1',
  SHARE_MESSAGE: 'Check out TT Energy - Reward Links app for daily game rewards!',
  DISCLAIMER: 'TT Energy - Reward Links is an independent application and is in no way affiliated with, endorsed, or approved by Magmatic Games LTD or Travel Town',
};

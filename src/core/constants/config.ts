/**
 * App Configuration
 * Environment-specific settings and constants
 * 
 * This file now imports from gameConfig.ts for game-specific values.
 * To customize for a different game, edit gameConfig.ts instead of this file.
 */

import { gameConfig, APP_INFO, URL_CONFIG, SOCIAL_CONFIG, TEXT_CONFIG } from './gameConfig';

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
  API_BASE_URL: gameConfig.api.baseUrl,
  APP_STORE_URL: URL_CONFIG.appStore,
  PLAY_STORE_URL: URL_CONFIG.playStore,
  ADMOB_APP_ID: process.env.EXPO_PUBLIC_ADMOB_APP_ID_DEV ?? 'ca-app-pub-3940256099942544~3347511713',
  PRIVACY_POLICY_URL: URL_CONFIG.privacyPolicy,
  TERMS_URL: URL_CONFIG.terms,
};

const prod: Environment = {
  API_BASE_URL: gameConfig.api.baseUrl,
  APP_STORE_URL: URL_CONFIG.appStore,
  PLAY_STORE_URL: URL_CONFIG.playStore,
  ADMOB_APP_ID: process.env.EXPO_PUBLIC_ADMOB_APP_ID_PROD ?? '',
  PRIVACY_POLICY_URL: URL_CONFIG.privacyPolicy,
  TERMS_URL: URL_CONFIG.terms,
};

export const ENV = isDev ? dev : prod;

export const APP_CONFIG = {
  APP_NAME: APP_INFO.name,
  APP_VERSION: APP_INFO.version,
  SHARE_MESSAGE: SOCIAL_CONFIG.shareMessage,
  DISCLAIMER: TEXT_CONFIG.settings.disclaimer,
};

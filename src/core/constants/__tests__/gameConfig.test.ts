/**
 * Game Configuration Tests
 * 
 * Validates that gameConfig.ts has all required fields and values are properly formatted.
 * Run these tests before building a new game app to catch configuration errors early.
 */

import {
  gameConfig,
  APP_INFO,
  GAME_INFO,
  API_CONFIG,
  ADMOB_CONFIG,
  FIREBASE_CONFIG,
  THEME_CONFIG,
  REWARD_TYPES,
  TEXT_CONFIG,
  URL_CONFIG,
} from '../gameConfig';

describe('Game Configuration Validation', () => {
  describe('APP_INFO', () => {
    it('should have valid id', () => {
      expect(APP_INFO.id).toBeDefined();
      expect(APP_INFO.id.length).toBeGreaterThan(0);
      expect(APP_INFO.id).toMatch(/^[a-z0-9_]+$/);
    });

    it('should have valid name', () => {
      expect(APP_INFO.name).toBeDefined();
      expect(APP_INFO.name.length).toBeGreaterThan(0);
    });

    it('should have valid version', () => {
      expect(APP_INFO.version).toBeDefined();
      expect(APP_INFO.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should have valid bundle identifiers', () => {
      expect(APP_INFO.bundleIdIOS).toBeDefined();
      expect(APP_INFO.bundleIdAndroid).toBeDefined();
      expect(APP_INFO.bundleIdIOS).toMatch(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/i);
      expect(APP_INFO.bundleIdAndroid).toMatch(/^[a-z][a-z0-9]*(\.[a-z][a-z0-9]*)+$/i);
    });
  });

  describe('GAME_INFO', () => {
    it('should have valid game information', () => {
      expect(GAME_INFO.name).toBeDefined();
      expect(GAME_INFO.company).toBeDefined();
      expect(GAME_INFO.primaryIcon).toBeDefined();
      expect(GAME_INFO.name.length).toBeGreaterThan(0);
      expect(GAME_INFO.company.length).toBeGreaterThan(0);
    });
  });

  describe('API_CONFIG', () => {
    it('should have API base URL defined', () => {
      expect(API_CONFIG.baseUrl).toBeDefined();
      // Base URL can be empty (using env variable) or a valid URL
      if (API_CONFIG.baseUrl) {
        expect(API_CONFIG.baseUrl).toMatch(/^https?:\/\/.+/);
      }
    });
  });

  describe('ADMOB_CONFIG', () => {
    const admobIdRegex = /^ca-app-pub-\d+~\d+$/;

    it('should have valid AdMob app IDs', () => {
      expect(ADMOB_CONFIG.iosAppId).toBeDefined();
      expect(ADMOB_CONFIG.androidAppId).toBeDefined();
      expect(ADMOB_CONFIG.iosAppId).toMatch(admobIdRegex);
      expect(ADMOB_CONFIG.androidAppId).toMatch(admobIdRegex);
    });
  });

  describe('FIREBASE_CONFIG', () => {
    it('should have valid Firebase configuration', () => {
      expect(FIREBASE_CONFIG.notificationChannelId).toBeDefined();
      expect(FIREBASE_CONFIG.notificationChannelId).toMatch(/^[a-z0-9_]+$/);
      expect(FIREBASE_CONFIG.googleServicesAndroid).toContain('.json');
      expect(FIREBASE_CONFIG.googleServicesIOS).toContain('.plist');
    });
  });

  describe('THEME_CONFIG', () => {
    const hexColorRegex = /^#[0-9A-F]{6}$/i;

    it('should have valid theme colors', () => {
      expect(THEME_CONFIG.colors).toBeDefined();
      Object.entries(THEME_CONFIG.colors).forEach(([key, value]) => {
        expect(value).toMatch(hexColorRegex);
      });
    });

    it('should have splash background color', () => {
      expect(THEME_CONFIG.splashBackgroundColor).toBeDefined();
      expect(THEME_CONFIG.splashBackgroundColor).toMatch(hexColorRegex);
    });
  });

  describe('REWARD_TYPES', () => {
    it('should have at least one reward type', () => {
      const rewardTypes = Object.keys(REWARD_TYPES);
      expect(rewardTypes.length).toBeGreaterThan(0);
    });

    it('should have valid reward type structure', () => {
      Object.entries(REWARD_TYPES).forEach(([key, reward]) => {
        expect(reward.label).toBeDefined();
        expect(reward.icon).toBeDefined();
        expect(reward.label.length).toBeGreaterThan(0);
        expect(reward.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe('TEXT_CONFIG', () => {
    it('should have all required text sections', () => {
      expect(TEXT_CONFIG.home).toBeDefined();
      expect(TEXT_CONFIG.rewards).toBeDefined();
      expect(TEXT_CONFIG.claimModal).toBeDefined();
      expect(TEXT_CONFIG.notificationPermission).toBeDefined();
      expect(TEXT_CONFIG.settings).toBeDefined();
      expect(TEXT_CONFIG.errorBoundary).toBeDefined();
    });

    it('should have non-empty text values', () => {
      expect(TEXT_CONFIG.home.rewardsButton).toBeTruthy();
      expect(TEXT_CONFIG.rewards.screenTitle).toBeTruthy();
      expect(TEXT_CONFIG.settings.screenTitle).toBeTruthy();
    });
  });

  describe('URL_CONFIG', () => {
    const urlRegex = /^https?:\/\/.+/;

    it('should have valid URLs', () => {
      expect(URL_CONFIG.privacyPolicy).toMatch(urlRegex);
      expect(URL_CONFIG.terms).toMatch(urlRegex);
      expect(URL_CONFIG.appStore).toMatch(urlRegex);
      expect(URL_CONFIG.playStore).toMatch(urlRegex);
    });
  });

  describe('Configuration Consistency', () => {
    it('should not have placeholder values', () => {
      const configString = JSON.stringify(gameConfig);
      expect(configString).not.toContain('CHANGE_ME');
      expect(configString).not.toContain('TODO');
      expect(configString).not.toContain('PLACEHOLDER');
      expect(configString).not.toContain('XXXXXXXX');
    });

    it('should have all top-level sections', () => {
      expect(gameConfig.app).toBeDefined();
      expect(gameConfig.game).toBeDefined();
      expect(gameConfig.api).toBeDefined();
      expect(gameConfig.admob).toBeDefined();
      expect(gameConfig.firebase).toBeDefined();
      expect(gameConfig.theme).toBeDefined();
      expect(gameConfig.rewards).toBeDefined();
      expect(gameConfig.text).toBeDefined();
      expect(gameConfig.urls).toBeDefined();
    });
  });
});

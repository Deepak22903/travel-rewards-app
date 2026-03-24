/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎮 GAME CONFIGURATION - EDIT THIS FILE TO CREATE A NEW GAME APP
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is the CENTRAL configuration file for the entire app.
 * To create a new game rewards app, update the values in this file and
 * replace the assets in the /assets folder.
 * 
 * After making changes:
 * 1. Run: npm run validate (to check your configuration)
 * 2. Run: npm run build:game (to update app.json and prepare for build)
 * 3. Replace all asset files in /assets folder
 * 4. Test locally: npm start
 * 5. Build: npx eas build
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * TypeScript interfaces for type safety
 */
export interface GameConfig {
  // App Identity
  app: {
    /** Unique identifier for this game (e.g., 'travel_town', 'monopoly_go') */
    id: string;
    /** Display name shown to users (e.g., 'TT Energy - Reward Links') */
    name: string;
    /** App version (must match package.json) */
    version: string;
    /** URL-friendly slug for Expo (e.g., 'travel-rewards-app') */
    slug: string;
    /** iOS bundle identifier (must be unique on App Store) */
    bundleIdIOS: string;
    /** Android package name (must be unique on Play Store) */
    bundleIdAndroid: string;
  };

  // Game Information
  game: {
    /** The actual game name (e.g., 'Travel Town', 'MONOPOLY GO!') */
    name: string;
    /** Company that makes the game (e.g., 'Magmatic Games LTD') */
    company: string;
    /** Primary emoji/icon for the game (e.g., '⚡', '🎲', '🏝️') */
    primaryIcon: string;
  };

  // API Configuration
  api: {
    /** Base URL for your backend API */
    baseUrl: string;
  };

  // AdMob Configuration
  admob: {
    /** Google AdMob App ID for Android */
    androidAppId: string;
    /** Google AdMob App ID for iOS */
    iosAppId: string;
  };

  // Firebase Configuration
  firebase: {
    /** FCM notification channel ID (Android) */
    notificationChannelId: string;
    /** Path to google-services.json (Android) relative to project root */
    googleServicesAndroid: string;
    /** Path to GoogleService-Info.plist (iOS) relative to project root */
    googleServicesIOS: string;
  };

  // Theme & Branding
  theme: {
    colors: {
      // Backgrounds
      background: string;       // Main app background
      backgroundLight: string;  // Light areas, cards

      // Cards & Borders
      card: string;             // Card background
      cardBorder: string;       // Card border color

      // Text Colors
      textPrimary: string;      // Main text
      textSecondary: string;    // Secondary text
      textLight: string;        // Light/disabled text
      textHeader: string;       // Section headers

      // Accent & Action Colors
      accent: string;           // Primary accent (main buttons)
      buttonGreen: string;      // Share button
      buttonBlue: string;       // Rate button
      header: string;           // Header bar background

      // Status Colors
      success: string;          // Success messages
      error: string;            // Error messages
      warning: string;          // Warning messages
      claimed: string;          // Claimed/disabled state
    };
    /** Splash screen background color (hex) */
    splashBackgroundColor: string;
  };

  // Reward Types
  rewards: {
    [key: string]: {
      /** Display label (e.g., 'Energy', 'Coins', 'Gems') */
      label: string;
      /** Emoji icon (e.g., '⚡', '🪙', '💎') */
      icon: string;
    };
  };

  // UI Text Content
  text: {
    home: {
      rewardsButton: string;
      shareButton: string;
      rateButton: string;
    };
    rewards: {
      screenTitle: string;
      infoBanner: string;
      sectionToday: string;
      sectionYesterday: string;
      connectionError: string;
      loadingRewards: string;
      noRewardsAvailable: string;
      pullToRefresh: string;
    };
    claimModal: {
      closeButton: string;
      claimButton: string;
      claimButtonIcon: string;
      expiredWarning: string;
    };
    settings: {
      screenTitle: string;
      notificationsSectionTitle: string;
      notificationsToggleLabel: string;
      notificationsToggleIcon: string;
      informationSectionTitle: string;
      versionLabel: string;
      disclaimer: string;
      privacyPolicyLabel: string;
      termsLabel: string;
    };
    notificationPermission: {
      modalTitle: string;
      modalBody: string;
      allowButton: string;
      dismissButton: string;
    };
    inAppNotification: {
      defaultTitle: string;
      viewRewardsButton: string;
      closeButton: string;
    };
    errorBoundary: {
      emoji: string;
      title: string;
      message: string;
      retryButton: string;
    };
  };

  // External URLs
  urls: {
    /** Privacy policy URL */
    privacyPolicy: string;
    /** Terms of service URL */
    terms: string;
    /** iOS App Store URL (after app is published) */
    appStore: string;
    /** Google Play Store URL */
    playStore: string;
    /** Facebook page URL (optional) */
    facebook?: string;
    /** Website URL (optional) */
    website?: string;
  };

  // Social & Marketing
  social: {
    /** Message shown when user shares the app */
    shareMessage: string;
  };
}

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎯 CURRENT GAME CONFIGURATION
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * GAME: Travel Town (by Magmatic Games LTD)
 * APP: TT Energy - Reward Links
 * 
 * Edit the values below to match your target game.
 */
export const gameConfig: GameConfig = {
  // ─────────────────────────────────────────────────────────────────────────
  // 📱 APP IDENTITY
  // ─────────────────────────────────────────────────────────────────────────
  app: {
    id: 'travel_town',
    name: 'TT Energy - Reward Links',
    version: '1.3.11',
    slug: 'travel-rewards-app',
    bundleIdIOS: 'com.travelrewards.app',
    bundleIdAndroid: 'com.travelrewards.app',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🎮 GAME INFORMATION
  // ─────────────────────────────────────────────────────────────────────────
  game: {
    name: 'Travel Town',
    company: 'Magmatic Games LTD',
    primaryIcon: '⚡',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🌐 API CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 💰 ADMOB CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  admob: {
    androidAppId: 'ca-app-pub-1430101085831484~2485132182',
    iosAppId: 'ca-app-pub-1430101085831484~2485132182',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🔔 FIREBASE CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  firebase: {
    notificationChannelId: 'default',
    googleServicesAndroid: './google-services.json',
    googleServicesIOS: './GoogleService-Info.plist',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🎨 THEME & BRANDING
  // ─────────────────────────────────────────────────────────────────────────
  theme: {
    colors: {
      // Backgrounds
      background: '#E8D4B8',       // Soft beige
      backgroundLight: '#FFF9F0',  // Off-white

      // Cards & Borders
      card: '#FFF9F0',             // Card background
      cardBorder: '#D4A574',       // Brown borders

      // Text Colors
      textPrimary: '#6B3E26',      // Dark brown
      textSecondary: '#8B7355',    // Medium brown
      textLight: '#A69478',        // Light brown
      textHeader: '#2C3E50',       // Navy headers

      // Accent & Action Colors
      accent: '#F5A623',           // Orange/gold
      buttonGreen: '#4CAF50',      // Share button
      buttonBlue: '#2196F3',       // Rate button
      header: '#D4A574',           // Header bar

      // Status Colors
      success: '#4CAF50',
      error: '#E53935',
      warning: '#FFA726',
      claimed: '#C8C8C8',          // Grayed claimed state
    },
    splashBackgroundColor: '#F5E6D3',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🎁 REWARD TYPES
  // ─────────────────────────────────────────────────────────────────────────
  rewards: {
    energy: {
      label: 'Energy',
      icon: '⚡',
    },
    coins: {
      label: 'Coins',
      icon: '🪙',
    },
    gems: {
      label: 'Gems',
      icon: '💎',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 📝 UI TEXT CONTENT
  // ─────────────────────────────────────────────────────────────────────────
  text: {
    home: {
      rewardsButton: 'Rewards',
      shareButton: 'Share',
      rateButton: 'Rate',
    },
    rewards: {
      screenTitle: 'Rewards',
      infoBanner: 'Rewards are valid for a few days. If they don\'t work, they may have expired or already been used on your account.',
      sectionToday: 'Today',
      sectionYesterday: 'Yesterday',
      connectionError: 'Connection Error',
      loadingRewards: 'Loading rewards...',
      noRewardsAvailable: 'No rewards available',
      pullToRefresh: 'Pull to refresh',
    },
    claimModal: {
      closeButton: 'Close',
      claimButton: 'Claim',
      claimButtonIcon: '🎁',
      expiredWarning: '⚠️ This reward may have expired',
    },
    settings: {
      screenTitle: 'Settings',
      notificationsSectionTitle: 'Notifications',
      notificationsToggleLabel: 'New rewards',
      notificationsToggleIcon: '⚡',
      informationSectionTitle: 'Information',
      versionLabel: 'Version',
      disclaimer: 'TT Energy - Reward Links is an independent application and is in no way affiliated with, endorsed, or approved by Magmatic Games LTD or Travel Town',
      privacyPolicyLabel: 'Privacy Policy',
      termsLabel: 'Terms of Service',
    },
    notificationPermission: {
      modalTitle: 'Don\'t Miss Out!',
      modalBody: 'Get instant alerts when new daily rewards drop — free energy, coins and gems.\n\nBe the first to claim before they expire.',
      allowButton: 'Allow Notifications',
      dismissButton: 'Not now',
    },
    inAppNotification: {
      defaultTitle: 'New rewards available!',
      viewRewardsButton: 'View Rewards',
      closeButton: '✕',
    },
    errorBoundary: {
      emoji: '😕',
      title: 'Oops! Something went wrong',
      message: 'We\'re sorry for the inconvenience. The app encountered an unexpected error.',
      retryButton: 'Try Again',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🔗 EXTERNAL URLS
  // ─────────────────────────────────────────────────────────────────────────
  urls: {
    privacyPolicy: 'https://ttenergyapp.blogspot.com/p/privacy-policy-tt-energy-app.html',
    terms: 'https://ttenergyapp.blogspot.com/p/terms-conditions-tt-energy.html',
    appStore: 'https://apps.apple.com/app/id123456789', // TODO: Update after App Store submission
    playStore: 'https://play.google.com/store/apps/details?id=com.travelrewards.app',
    facebook: '', // Optional
    website: '',  // Optional
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 📢 SOCIAL & MARKETING
  // ─────────────────────────────────────────────────────────────────────────
  social: {
    shareMessage: 'Check out TT Energy - Reward Links app for daily game rewards!',
  },
};

/**
 * Export individual sections for easier imports
 */
export const APP_INFO = gameConfig.app;
export const GAME_INFO = gameConfig.game;
export const API_CONFIG = gameConfig.api;
export const ADMOB_CONFIG = gameConfig.admob;
export const FIREBASE_CONFIG = gameConfig.firebase;
export const THEME_CONFIG = gameConfig.theme;
export const REWARD_TYPES = gameConfig.rewards;
export const TEXT_CONFIG = gameConfig.text;
export const URL_CONFIG = gameConfig.urls;
export const SOCIAL_CONFIG = gameConfig.social;

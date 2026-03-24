/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🎮 GAME CONFIGURATION EXAMPLE - MONOPOLY GO!
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * This is an EXAMPLE configuration for a different game (MONOPOLY GO!).
 * Use this as a reference when creating configuration for your own game.
 * 
 * To use this example:
 * 1. Copy the content below to gameConfig.ts
 * 2. Customize all values for your target game
 * 3. Replace assets in /assets folder
 * 4. Run: npm run validate
 * 5. Run: npm run build:game
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

import { GameConfig } from './gameConfig';

export const exampleGameConfig: GameConfig = {
  // ─────────────────────────────────────────────────────────────────────────
  // 📱 APP IDENTITY
  // ─────────────────────────────────────────────────────────────────────────
  app: {
    id: 'monopoly_go',                          // Unique ID for backend
    name: 'Go\'Rewards - Daily Links',         // App display name
    version: '1.0.0',                           // App version
    slug: 'monopoly-go-rewards-app',            // Expo slug (URL-friendly)
    bundleIdIOS: 'com.monopolygo.rewards',      // iOS bundle identifier
    bundleIdAndroid: 'com.monopolygo.rewards',  // Android package name
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🎮 GAME INFORMATION
  // ─────────────────────────────────────────────────────────────────────────
  game: {
    name: 'MONOPOLY GO!',                       // Actual game name
    company: 'Scopely, Inc.',                   // Game developer/publisher
    primaryIcon: '🎲',                          // Main emoji/icon
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🌐 API CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  api: {
    baseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? '', // Your backend URL
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 💰 ADMOB CONFIGURATION (Get these from your AdMob account)
  // ─────────────────────────────────────────────────────────────────────────
  admob: {
    androidAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
    iosAppId: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🔔 FIREBASE CONFIGURATION
  // ─────────────────────────────────────────────────────────────────────────
  firebase: {
    notificationChannelId: 'monopoly_go_rewards', // Unique channel ID
    googleServicesAndroid: './google-services.json',
    googleServicesIOS: './GoogleService-Info.plist',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🎨 THEME & BRANDING
  // ─────────────────────────────────────────────────────────────────────────
  theme: {
    colors: {
      // Example: MONOPOLY GO! uses vibrant blues and greens
      background: '#E8F4FD',       // Light blue background
      backgroundLight: '#FFFFFF',  // White

      card: '#FFFFFF',             // White cards
      cardBorder: '#4A90E2',       // Blue borders

      textPrimary: '#1A1A1A',      // Black text
      textSecondary: '#666666',    // Gray text
      textLight: '#999999',        // Light gray
      textHeader: '#2C3E50',       // Dark blue headers

      accent: '#4CAF50',           // Green (Monopoly money color)
      buttonGreen: '#4CAF50',      // Green button
      buttonBlue: '#2196F3',       // Blue button
      header: '#4A90E2',           // Blue header

      success: '#4CAF50',
      error: '#E53935',
      warning: '#FFA726',
      claimed: '#BDBDBD',
    },
    splashBackgroundColor: '#E8F4FD',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🎁 REWARD TYPES (Customize based on what rewards your game offers)
  // ─────────────────────────────────────────────────────────────────────────
  rewards: {
    dice: {
      label: 'Dice',
      icon: '🎲',
    },
    money: {
      label: 'Money',
      icon: '💵',
    },
    stickers: {
      label: 'Stickers',
      icon: '⭐',
    },
    tokens: {
      label: 'Tokens',
      icon: '🪙',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 📝 UI TEXT CONTENT (Customize all user-facing text)
  // ─────────────────────────────────────────────────────────────────────────
  text: {
    home: {
      rewardsButton: 'Daily Rewards',
      shareButton: 'Share',
      rateButton: 'Rate Us',
    },
    rewards: {
      screenTitle: 'Daily Rewards',
      infoBanner: 'Free dice rolls and rewards are valid for 48 hours. Claim them before they expire!',
      sectionToday: 'Today',
      sectionYesterday: 'Yesterday',
      connectionError: 'Connection Error',
      loadingRewards: 'Loading rewards...',
      noRewardsAvailable: 'No rewards available right now',
      pullToRefresh: 'Pull down to refresh',
    },
    claimModal: {
      closeButton: 'Close',
      claimButton: 'Claim Now',
      claimButtonIcon: '🎁',
      expiredWarning: '⚠️ This reward may have expired',
    },
    settings: {
      screenTitle: 'Settings',
      notificationsSectionTitle: 'Notifications',
      notificationsToggleLabel: 'Daily rewards alerts',
      notificationsToggleIcon: '🎲',
      informationSectionTitle: 'About',
      versionLabel: 'App Version',
      disclaimer: 'Go\'Rewards is an independent application and is not affiliated with, endorsed by, or approved by Scopely, Inc. or MONOPOLY GO!',
      privacyPolicyLabel: 'Privacy Policy',
      termsLabel: 'Terms of Service',
    },
    notificationPermission: {
      modalTitle: 'Never Miss Free Rewards!',
      modalBody: 'Enable push notifications to get instant alerts when new free dice rolls and rewards are available.\n\nBe the first to claim before they run out!',
      allowButton: 'Enable Notifications',
      dismissButton: 'Maybe Later',
    },
    inAppNotification: {
      defaultTitle: 'New rewards just dropped!',
      viewRewardsButton: 'View Rewards',
      closeButton: '✕',
    },
    errorBoundary: {
      emoji: '😕',
      title: 'Oops! Something went wrong',
      message: 'The app ran into an issue. Please try again.',
      retryButton: 'Retry',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🔗 EXTERNAL URLS (Update with your own URLs)
  // ─────────────────────────────────────────────────────────────────────────
  urls: {
    privacyPolicy: 'https://monopolygorewards.com/privacy',
    terms: 'https://monopolygorewards.com/terms',
    appStore: 'https://apps.apple.com/app/idXXXXXXXXXX',
    playStore: 'https://play.google.com/store/apps/details?id=com.monopolygo.rewards',
    facebook: 'https://facebook.com/monopolygorewards',
    website: 'https://monopolygorewards.com',
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 📢 SOCIAL & MARKETING
  // ─────────────────────────────────────────────────────────────────────────
  social: {
    shareMessage: 'Get free MONOPOLY GO! rewards every day with Go\'Rewards app! Download now:',
  },
};

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 📋 CUSTOMIZATION CHECKLIST
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * When creating a new game config, make sure to update:
 * 
 * ✅ App Identity:
 *    - Unique app ID
 *    - App name
 *    - Bundle IDs (iOS & Android)
 *    - Expo slug
 * 
 * ✅ Game Information:
 *    - Game name
 *    - Company name
 *    - Primary icon/emoji
 * 
 * ✅ API Configuration:
 *    - Backend API base URL
 * 
 * ✅ AdMob:
 *    - Android App ID
 *    - iOS App ID
 *    - Banner ad unit IDs (in .env)
 *    - Interstitial ad unit IDs (in .env)
 * 
 * ✅ Firebase:
 *    - Notification channel ID
 *    - Replace google-services.json
 *    - Replace GoogleService-Info.plist
 * 
 * ✅ Theme:
 *    - All color values to match game aesthetic
 *    - Splash background color
 * 
 * ✅ Reward Types:
 *    - Define all reward types your game has
 *    - Set appropriate labels and emojis
 * 
 * ✅ UI Text:
 *    - All button labels
 *    - All screen titles
 *    - All messages and descriptions
 *    - Disclaimer text
 * 
 * ✅ External URLs:
 *    - Privacy policy URL
 *    - Terms of service URL
 *    - App Store URLs (after publishing)
 *    - Social media links
 * 
 * ✅ Assets (in /assets folder):
 *    - icon.png (1024x1024)
 *    - adaptive-icon.png (1024x1024, foreground only)
 *    - splash-icon.png (your splash logo)
 *    - homeScreenImg.png (main logo for home screen)
 *    - favicon.png (web favicon)
 *    - notification-icon.png (for push notifications)
 *    - All icon images (settings, share, rating, checkboxes, etc.)
 * 
 * ✅ Environment Variables (.env):
 *    - EXPO_PUBLIC_API_BASE_URL
 *    - AdMob unit IDs for dev and prod
 * 
 * ═══════════════════════════════════════════════════════════════════════════
 */

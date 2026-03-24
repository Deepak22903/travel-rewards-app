# Template Guide: Creating a New Game Rewards App

This guide walks you through creating a new rewards app for a different mobile game using this template system.

## Overview

This template allows you to create custom reward apps for different mobile games by:
1. Editing a single configuration file (`gameConfig.ts`)
2. Replacing asset files (icons, splash screens)
3. Updating platform-specific files (Firebase configs)
4. Running build scripts to update app configuration

**No code changes required!** Everything is controlled through configuration.

---

## Quick Start (5-Minute Setup)

```bash
# 1. Edit the configuration
# Open src/core/constants/gameConfig.ts and update all values

# 2. Validate your configuration
npm run validate

# 3. Update build files
npm run build:update

# 4. Replace assets (see ASSETS_GUIDE.md for details)
# - assets/icon.png
# - assets/splash-icon.png
# - assets/adaptive-icon.png
# - assets/favicon.png

# 5. Update Firebase configuration files
# - google-services.json (Android)
# - GoogleService-Info.plist (iOS)

# 6. Test the app
npm start
```

---

## Detailed Step-by-Step Guide

### Step 1: Prepare Game Information

Gather the following information about your target game:

- **Game Name**: e.g., "MONOPOLY GO!"
- **Game Company**: e.g., "Scopely"
- **App Identity**:
  - Unique app ID (lowercase, no spaces): e.g., "monopoly_go"
  - App display name: e.g., "MONOPOLY GO! Daily Rewards"
  - Version number: e.g., "1.0.0"
  
- **Bundle Identifiers** (must be unique):
  - iOS: e.g., "com.monopolygo.rewards.app"
  - Android: e.g., "com.monopolygo.rewards.app"

- **Reward Types**: What rewards does the game offer?
  - Type 1: name, icon emoji (e.g., "Dice", "🎲")
  - Type 2: name, icon emoji (e.g., "Coins", "💰")
  - Type 3: name, icon emoji (e.g., "Stickers", "⭐")

- **Theme Colors**: What colors represent the game?
  - Primary color (hex code)
  - Background color
  - Text colors
  - Button colors

- **External Links**:
  - Privacy Policy URL
  - Terms of Service URL
  - App Store URLs (iOS and Android)

- **AdMob Setup**:
  - Create a new AdMob app for iOS
  - Create a new AdMob app for Android
  - Get AdMob app IDs for both platforms

- **Firebase Setup**:
  - Create a new Firebase project
  - Add iOS and Android apps
  - Download `google-services.json` (Android)
  - Download `GoogleService-Info.plist` (iOS)
  - Choose notification channel ID

- **Backend API**:
  - Backend API base URL
  - App identifier for backend (e.g., "monopoly_go")

---

### Step 2: Edit gameConfig.ts

Open `src/core/constants/gameConfig.ts` and update all sections:

#### 2.1 APP_INFO Section

```typescript
export const APP_INFO = {
  id: 'monopoly_go',              // Unique identifier for backend
  name: 'MONOPOLY GO! Daily Rewards',  // Display name
  version: '1.0.0',               // Version number
};
```

#### 2.2 GAME_INFO Section

```typescript
export const GAME_INFO = {
  name: 'MONOPOLY GO!',           // Game name
  company: 'Scopely',             // Game company
  primaryIcon: '🎲',              // Main emoji representing the game
};
```

#### 2.3 BUNDLE_IDS Section

```typescript
export const BUNDLE_IDS = {
  ios: 'com.monopolygo.rewards.app',
  android: 'com.monopolygo.rewards.app',
};
```

**Important**: These must be unique and not used by any other app in the App Store or Play Store.

#### 2.4 THEME_COLORS Section

```typescript
export const THEME_COLORS = {
  // Update all colors to match your game's theme
  primary: '#0E7C7B',           // Main accent color
  background: '#E8F5E9',        // Screen background
  surface: '#FFFFFF',           // Card/modal background
  // ... update all other colors
};
```

#### 2.5 REWARD_TYPES Section

```typescript
export const REWARD_TYPES = {
  type1: {
    name: 'Dice',
    icon: '🎲',
  },
  type2: {
    name: 'Coins',
    icon: '💰',
  },
  type3: {
    name: 'Stickers',
    icon: '⭐',
  },
};
```

#### 2.6 TEXT_CONFIG Section

Update all user-facing text:
- Home screen messages
- Button labels
- Notification text
- Settings labels
- Error messages
- Share messages

**Tip**: Use Find & Replace to change game name throughout TEXT_CONFIG.

#### 2.7 EXTERNAL_LINKS Section

```typescript
export const EXTERNAL_LINKS = {
  privacyPolicy: 'https://yoursite.com/privacy',
  termsOfService: 'https://yoursite.com/terms',
  appStoreIos: 'https://apps.apple.com/app/idXXXXXXXXX',
  playStoreAndroid: 'https://play.google.com/store/apps/details?id=com.monopolygo.rewards.app',
};
```

#### 2.8 ADMOB_APP_IDS Section

```typescript
export const ADMOB_APP_IDS = {
  ios: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
  android: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX',
};
```

Get these from your AdMob console after creating your app.

#### 2.9 FIREBASE_CONFIG Section

```typescript
export const FIREBASE_CONFIG = {
  channelId: 'monopoly_rewards',  // Notification channel identifier
};
```

#### 2.10 API_CONFIG Section

```typescript
export const API_CONFIG = {
  baseUrl: 'https://your-api.com/api/v1',
};
```

---

### Step 3: Validate Configuration

Run the validation script to check for errors:

```bash
npm run validate
```

This will check:
- ✅ All required fields are filled
- ✅ URLs are valid format
- ✅ AdMob IDs are valid format
- ✅ Required assets exist
- ✅ Theme colors are complete
- ✅ No placeholder values remain

Fix any errors reported before proceeding.

---

### Step 4: Update Build Configuration

Run the build script to update `app.json` and `package.json`:

```bash
npm run build:update
```

Or run both validation and build in one command:

```bash
npm run build:game
```

This will automatically update:
- App name and version in `app.json`
- Bundle identifiers in `app.json`
- AdMob app IDs in `app.json`
- Notification channel ID in `app.json`
- Version in `package.json`

---

### Step 5: Replace Assets

Replace the following asset files with your game-specific designs. See `ASSETS_GUIDE.md` for detailed specifications.

#### Required Assets:

1. **Icon** - `assets/icon.png`
   - 1024x1024 PNG
   - App icon shown on device home screen

2. **Splash Icon** - `assets/splash-icon.png`
   - 1024x1024 PNG (transparent background)
   - Logo shown during app launch

3. **Adaptive Icon** - `assets/adaptive-icon.png`
   - 1024x1024 PNG (transparent background)
   - Android adaptive icon foreground

4. **Favicon** - `assets/favicon.png`
   - 48x48 PNG
   - Web app icon

**Tips**:
- Use consistent branding across all assets
- Ensure icon is recognizable at small sizes
- Splash icon should work on your chosen background color
- Keep adaptive icon content in safe zone (center 66%)

---

### Step 6: Update Firebase Configuration Files

#### Android (google-services.json)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add an Android app with your package name (from `BUNDLE_IDS.android`)
4. Download `google-services.json`
5. Replace the file at project root: `./google-services.json`

#### iOS (GoogleService-Info.plist)

1. In Firebase Console, add an iOS app with your bundle ID (from `BUNDLE_IDS.ios`)
2. Download `GoogleService-Info.plist`
3. Replace the file at project root: `./GoogleService-Info.plist`

#### Configure Firebase Cloud Messaging

1. In Firebase Console → Project Settings → Cloud Messaging
2. Enable Cloud Messaging API
3. Note your Server Key (for backend notifications)

---

### Step 7: Update Backend Configuration

Update your backend to recognize the new game:

1. Add the new app ID (from `APP_INFO.id`) to your backend
2. Configure the backend to send rewards for this game
3. Set up the notification channel ID (from `FIREBASE_CONFIG.channelId`)
4. Test API endpoints:
   - `GET /rewards?app_id=monopoly_go`
   - `POST /notifications/register`

---

### Step 8: Test the Application

#### Local Testing

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

#### Test Checklist:

- [ ] App launches with correct splash screen
- [ ] Home screen shows correct game name and text
- [ ] Rewards load from backend
- [ ] Reward cards show correct icons and colors
- [ ] Claim modal works with correct reward types
- [ ] Share functionality works
- [ ] Notification permission modal shows correct text
- [ ] Settings screen shows correct information
- [ ] Privacy policy and terms links work
- [ ] Rate app buttons link to correct stores
- [ ] Theme colors are applied throughout
- [ ] Error messages are game-specific

---

### Step 9: Build for Production

#### Build Android APK

```bash
npm run build:android:release
```

APK will be in `android/app/build/outputs/apk/release/`

#### Build iOS IPA

1. Open Xcode
2. Archive the project
3. Export IPA for distribution

#### Using EAS Build (Expo Application Services)

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure EAS
eas build:configure

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
```

---

### Step 10: Submit to App Stores

#### Google Play Store

1. Create new app in Google Play Console
2. Upload APK/AAB
3. Fill in store listing with game-specific information
4. Set up content rating
5. Submit for review

#### Apple App Store

1. Create new app in App Store Connect
2. Upload IPA via Xcode or Transporter
3. Fill in store listing with game-specific information
4. Set up privacy details
5. Submit for review

---

## Common Issues & Solutions

### Issue: Validation fails with "placeholder values"

**Solution**: Search for default values like "Travel Town" or "travel_town" in `gameConfig.ts` and replace with your game's values.

### Issue: App crashes on launch

**Solution**: Ensure Firebase configuration files (`google-services.json` and `GoogleService-Info.plist`) match your bundle identifiers.

### Issue: AdMob ads don't show

**Solution**: 
- Verify AdMob app IDs are correct
- Ensure AdMob apps are created in AdMob console
- Test ads may not show immediately (use test device IDs)

### Issue: Notifications don't work

**Solution**:
- Verify Firebase Cloud Messaging is enabled
- Check notification channel ID matches in Firebase and gameConfig
- Ensure backend is sending to correct FCM server key

### Issue: Colors look wrong

**Solution**: Review `THEME_COLORS` section and ensure all color values are valid hex codes (e.g., "#FF5733").

---

## Advanced Customization

### Adding New Reward Types

If your game has more than 3 reward types, edit `gameConfig.ts`:

```typescript
export const REWARD_TYPES = {
  type1: { name: 'Dice', icon: '🎲' },
  type2: { name: 'Coins', icon: '💰' },
  type3: { name: 'Stickers', icon: '⭐' },
  type4: { name: 'Tokens', icon: '🎫' },  // Add new type
};
```

### Changing Fonts

The app uses Fredoka font by default. To change:

1. Install new font package: `npx expo install @expo-google-fonts/your-font`
2. Update `App.tsx` font imports
3. Update `theme.ts` font family

### Custom Backend Integration

If your backend API structure differs:

1. Review `src/core/api/rewards.ts`
2. Update API calls to match your backend
3. Update data transformation if needed

---

## Maintenance & Updates

### Updating App Version

1. Update `APP_INFO.version` in `gameConfig.ts`
2. Run `npm run build:update`
3. Commit changes
4. Build new version

### Updating Content

To update text, rewards, or theme:

1. Edit `gameConfig.ts`
2. Run `npm run validate`
3. Restart development server
4. Test changes

### Backend Changes

If backend API changes:

1. Update `API_CONFIG.baseUrl` if needed
2. Update API integration files in `src/core/api/`
3. Test all API functionality

---

## Support & Resources

- **Template Documentation**: See README.md for architecture details
- **Asset Guidelines**: See ASSETS_GUIDE.md for asset specifications
- **Expo Documentation**: https://docs.expo.dev/
- **React Native**: https://reactnative.dev/docs/getting-started
- **Firebase**: https://firebase.google.com/docs
- **AdMob**: https://admob.google.com/

---

## Checklist for New Game

Use this checklist when creating a new game app:

- [ ] All sections in `gameConfig.ts` updated
- [ ] `npm run validate` passes without errors
- [ ] `npm run build:update` completed successfully
- [ ] All 4 asset files replaced
- [ ] `google-services.json` updated with new project
- [ ] `GoogleService-Info.plist` updated with new project
- [ ] Firebase Cloud Messaging enabled
- [ ] Backend configured for new app ID
- [ ] Local testing completed (all screens and features)
- [ ] Privacy policy URL accessible
- [ ] Terms of service URL accessible
- [ ] App Store and Play Store links prepared
- [ ] AdMob apps created and IDs added
- [ ] Production build tested
- [ ] App store listings prepared

---

## Example: MONOPOLY GO! Configuration

For a complete example of configuring a different game, see:
- `src/core/constants/gameConfig.example.ts`

This shows all values configured for MONOPOLY GO! instead of Travel Town.

---

**Ready to build your app?** Start with Step 1 and follow this guide step by step. Good luck! 🚀

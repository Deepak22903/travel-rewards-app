# AdMob Integration Guide

## 📱 Current Status

The app includes **mock AdMob implementation** that works in Expo Go for development/testing. For production with real ads, you need to:
1. Create an AdMob account
2. Build with EAS (Expo Application Services)
3. Use a development build

---

## 🎯 What's Implemented

### ✅ Banner Ads
- **Location**: Bottom of Rewards screen
- **Type**: Standard banner (320x50)
- **Current**: Shows placeholder in Expo Go
- **Production**: Real ads with development build

### ✅ Interstitial Ads
- **Trigger**: App launch (every 3rd open)
- **Cooldown**: 1 minute between ads
- **Current**: Shows alert dialog in Expo Go
- **Production**: Full-screen ads with development build

### ✅ Ad Configuration
- Test ad unit IDs configured
- Frequency controls implemented
- Platform-specific handling (iOS/Android)

---

## 🚀 Production Setup

### Step 1: Create AdMob Account

1. Go to [AdMob](https://admob.google.com/)
2. Sign in with Google account
3. Click "Get Started"
4. Accept terms and conditions

### Step 2: Create AdMob App

1. In AdMob console, click "Apps" → "Add App"
2. Select your platform:
   - **Android**: Link to Play Store (after publishing) OR create manually
   - **iOS**: Link to App Store (after publishing) OR create manually
3. Enter app name: `Travel Rewards`
4. Note your **App ID**: `ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX`

### Step 3: Create Ad Units

Create these ad units in AdMob:

#### Banner Ad Unit
1. Go to "Ad units" → "Add ad unit"
2. Select "Banner"
3. Name: `Rewards Screen Banner`
4. Copy the **Ad unit ID**: `ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY`

#### Interstitial Ad Unit
1. Go to "Ad units" → "Add ad unit"
2. Select "Interstitial"
3. Name: `App Launch Interstitial`
4. Copy the **Ad unit ID**: `ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ`

### Step 4: Update Configuration

Replace test IDs in `src/core/ads/adConfig.ts`:

```typescript
export const AD_UNIT_IDS = {
  banner: {
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Your iOS banner ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY', // Your Android banner ID
  },
  interstitial: {
    ios: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ', // Your iOS interstitial ID
    android: 'ca-app-pub-XXXXXXXXXXXXXXXX/ZZZZZZZZZZ', // Your Android interstitial ID
  },
};
```

Update `ENV.ADMOB_APP_ID` in `src/core/constants/config.ts`:

```typescript
const prod: Environment = {
  // ... other config
  ADMOB_APP_ID: 'ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX', // Your AdMob App ID
};
```

### Step 5: Configure app.json

Add AdMob App IDs to `app.json`:

```json
{
  "expo": {
    "plugins": [
      [
        "react-native-google-mobile-ads",
        {
          "androidAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "iosAppId": "ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX",
          "userTrackingPermission": "This app uses ads to provide a free experience."
        }
      ]
    ]
  }
}
```

### Step 6: Uncomment Production Code

In these files, uncomment the production implementation:

1. **src/components/BannerAd.tsx**
   - Uncomment the `import` statements
   - Uncomment the production `return` statement
   - Remove mock implementation

2. **src/core/ads/useInterstitialAd.ts**
   - Uncomment production implementation
   - Remove mock implementation

3. **src/core/ads/adConfig.ts**
   - Uncomment `initializeAdMob` function body
   - Keep test device IDs for development

### Step 7: Initialize AdMob in App

Update `App.tsx`:

```typescript
import { initializeAdMob } from './src/core/ads/adConfig';

export default function App(): React.JSX.Element {
  useEffect(() => {
    initializeAdMob();
  }, []);

  return (
    <>
      <AppNavigator />
      <StatusBar style="light" />
    </>
  );
}
```

### Step 8: Build with EAS

Create development build:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build for Android
eas build --profile development --platform android

# Build for iOS (requires Apple Developer account)
eas build --profile development --platform ios
```

---

## 🧪 Testing Ads

### Test Mode (Current - Expo Go)
1. Run app in Expo Go
2. Navigate to Rewards screen
3. See banner ad placeholder
4. Open app 3 times to trigger interstitial alert

### Development Build Testing
1. Install development build on device
2. Ads will show using **test ad unit IDs**
3. Banner ad appears at bottom of Rewards
4. Interstitial appears every 3rd app launch

### Production Testing
1. Replace test IDs with real ad unit IDs
2. Add test devices to AdMob console
3. Build and test on physical devices
4. Verify ads load and display correctly

---

## 💰 Revenue Optimization

### Ad Placement Strategy
- **Banner**: Rewards screen (high visibility)
- **Interstitial**: App launch (non-intrusive)
- **Future**: Rewarded ads for bonus rewards

### Frequency Settings

Adjust in `src/core/ads/adConfig.ts`:

```typescript
export const AD_CONFIG = {
  // Show interstitial every N screen opens
  interstitialFrequency: 3, // Increase for less ads
  
  // Minimum time between interstitials (ms)
  interstitialCooldown: 60000, // 1 minute
  
  // Banner refresh interval (ms)
  bannerRefreshInterval: 30000, // 30 seconds
};
```

### Best Practices
1. **Don't overload with ads** - Users will uninstall
2. **Test different placements** - A/B test locations
3. **Monitor fill rates** - Check AdMob dashboard
4. **Use mediation** - Add more ad networks for better fill
5. **Respect user experience** - Quality over quantity

---

## 📊 AdMob Dashboard

### Key Metrics to Monitor
- **Impressions**: How many ads shown
- **CTR** (Click-Through Rate): % of clicks
- **eCPM**: Revenue per 1000 impressions
- **Fill Rate**: % of ad requests filled
- **Revenue**: Total earnings

### Optimization Tips
1. Enable **mediation** for higher fill rates
2. Use **auto-refresh** for banner ads
3. Implement **rewarded ads** for engagement
4. Test different **ad formats**
5. Monitor **policy violations**

---

## 🔐 Policy Compliance

### AdMob Policies
✅ **Required**:
- Privacy Policy published
- User consent for personalized ads (GDPR)
- Age-appropriate content rating
- No click fraud or manipulation
- Clear ad labeling

❌ **Prohibited**:
- Ads in apps targeting children under 13
- Misleading ad placement
- Encouraging accidental clicks
- Too many ads per page
- Obscuring app content

### GDPR Compliance

For EU users, implement consent:

```typescript
import { AdsConsent } from 'react-native-google-mobile-ads';

const consent = await AdsConsent.requestInfoUpdate();
if (consent.isConsentFormAvailable) {
  await AdsConsent.showForm();
}
```

---

## 🐛 Troubleshooting

### No Ads Showing?
- Check ad unit IDs are correct
- Verify app is approved in AdMob
- Ensure development build (not Expo Go)
- Check network connection
- Review AdMob account status

### Test Ads Not Loading?
- Use official test ad unit IDs
- Check device is registered as test device
- Clear app cache and rebuild

### Production Ads Not Loading?
- Wait 24-48 hours after app launch
- Check AdMob approval status
- Verify bundle ID matches AdMob app
- Check for policy violations

---

## 📚 Resources

- [AdMob Official Docs](https://developers.google.com/admob)
- [React Native Google Mobile Ads](https://docs.page/invertase/react-native-google-mobile-ads)
- [AdMob Policy Center](https://support.google.com/admob/answer/6128543)
- [EAS Build Docs](https://docs.expo.dev/build/introduction/)

---

## 🎯 Next Steps (Optional)

### Rewarded Ads
Offer users rewards for watching ads:

```typescript
// Grant bonus energy/coins after ad completion
const { show, isLoaded } = useRewardedAd();

if (isLoaded) {
  const result = await show();
  if (result === 'rewarded') {
    // Give user reward
    grantBonusEnergy(25);
  }
}
```

### Ad Mediation
Integrate additional ad networks:
- Facebook Audience Network
- Unity Ads
- AppLovin
- Vungle

### Analytics Integration
Track ad performance:
- Firebase Analytics
- Google Analytics 4
- Custom event tracking

---

**Status**: ✅ Mock implementation complete  
**Production**: ⏳ Requires EAS build + AdMob account  
**Estimated Setup Time**: 2-3 hours

# Push Notifications Setup Guide

## 📱 Expo Push Notifications (Current Implementation)

The app currently uses **Expo Push Notifications** which work out-of-the-box with Expo Go for testing.

### Testing with Expo Go
1. Install Expo Go on your physical device
2. Run the app: `npm start`
3. Scan the QR code with Expo Go
4. Go to **Settings** → Toggle **Push Notifications** ON
5. Tap **Test Notification** to receive a test notification
6. Tap the notification to navigate to Rewards screen

---

## 🔥 Firebase Cloud Messaging (FCM) Setup (Production)

For production apps distributed through App Store/Play Store, you'll need to configure FCM.

### Prerequisites
- Firebase account: https://firebase.google.com/
- Google account

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name: `travel-rewards-app`
4. Enable Google Analytics (optional)
5. Create project

### Step 2: Register Your Apps

#### For Android:
1. In Firebase console, click Android icon
2. Enter package name: `com.travelrewards` (or your actual package)
3. Download `google-services.json`
4. Place in: `android/app/google-services.json`

#### For iOS:
1. In Firebase console, click iOS icon
2. Enter bundle ID: `com.travelrewards` (or your actual bundle)
3. Download `GoogleService-Info.plist`
4. Place in: `ios/GoogleService-Info.plist`

### Step 3: Install Firebase SDK

```bash
npm install @react-native-firebase/app @react-native-firebase/messaging
```

### Step 4: Configure app.json

Add FCM configuration to `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "com.travelrewards"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "com.travelrewards"
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#F5A623",
          "sounds": ["./assets/notification-sound.wav"]
        }
      ]
    ]
  }
}
```

### Step 5: Update Notification Permissions

Replace the `projectId` in `src/core/notifications/permissions.ts`:

```typescriptdex.ts (1204 modules)
 WARN  expo-notifications: Push notifications (remote notifications) functionality provided by expo-notifications will be removed from Expo Go in SDK 53. Instead, use a development build. Read more at https://docs.expo.dev/develop/development-builds/introduction/.
 WARN  `expo-notifications` functionality is not fully supported in Expo Go:
We recommend you instead use a development build to avoid limitations. Learn more: https://expo.fyi/dev-client.

const tokenData = await Notifications.getExpoPushTokenAsync({
  projectId: 'YOUR_EXPO_PROJECT_ID', // Get from expo.dev
});
```

### Step 6: Server-Side Integration

To send notifications from your backend:

```typescript
// Example: Node.js backend
const axios = require('axios');

async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'New Rewards Available! 🎁',
    body: 'Check out the latest rewards',
    data: { screen: 'Rewards' },
  };

  await axios.post('https://exp.host/--/api/v2/push/send', message, {
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
  });
}
```

### Step 7: Build & Test

For development build:
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

For production:
```bash
eas build --profile production --platform all
```

---

## 📊 Notification Topics (Optional)

To send notifications to all users without storing tokens:

### Backend Setup:
```typescript
// Subscribe user to "all_users" topic
await admin.messaging().subscribeToTopic(
  [pushToken],
  'all_users'
);

// Send to topic
await admin.messaging().send({
  topic: 'all_users',
  notification: {
    title: 'New Rewards!',
    body: 'Check them out now',
  },
  data: {
    screen: 'Rewards',
  },
});
```

---

## 🧪 Testing Notifications

### Method 1: Expo Push Notification Tool
1. Get your Expo push token from app logs
2. Go to: https://expo.dev/notifications
3. Paste token and send test notification

### Method 2: In-App Test (Already Implemented)
1. Open app → Settings
2. Enable notifications
3. Tap "Test Notification"
4. Receive notification in 2 seconds

### Method 3: Scheduled Notifications
Add to your backend cron job:
```javascript
// Run daily at 9 AM
schedule.scheduleJob('0 9 * * *', async () => {
  await sendPushNotification(tokens, {
    title: 'Daily Rewards Updated!',
    body: 'New energy packs available',
  });
});
```

---

## 🔐 Security Best Practices

1. **Never commit Firebase config files** to public repos
2. **Validate push tokens** before storing
3. **Rate limit** notification sending
4. **Use FCM server keys** securely (environment variables)
5. **Handle token refresh** when devices update

---

## 📝 Notification Data Structure

```typescript
{
  title: string;           // Notification title
  body: string;            // Notification body
  data: {
    screen: 'Home' | 'Rewards' | 'Settings';  // Navigation target
    rewardId?: string;     // Optional: specific reward
    url?: string;          // Optional: deep link
  };
  sound: 'default';
  badge: number;           // iOS badge count
  priority: 'high';
  channelId: 'default';    // Android channel
}
```

---

## 🐛 Troubleshooting

### Notifications not received?
- Check device notification settings
- Verify app has notification permission
- Ensure device is connected to internet
- Check Firebase console for delivery status

### Token issues?
- Token refreshes on app reinstall
- Store tokens with user ID in database
- Handle token expiration

### iOS specific?
- APNs certificate must be valid
- Test with TestFlight build
- Check provisioning profile

### Android specific?
- Verify `google-services.json` is correct
- Check notification channel settings
- Test with release build

---

## 📚 Resources

- [Expo Notifications Docs](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Expo Push Notification Tool](https://expo.dev/notifications)
- [React Native Firebase](https://rnfirebase.io/)

---

**Status**: ✅ Expo notifications implemented  
**Production FCM**: ⏳ Pending Firebase project setup

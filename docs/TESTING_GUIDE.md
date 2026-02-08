# Testing Guide

## Testing Strategy

This guide covers manual testing procedures for the Travel Rewards app across different devices and scenarios.

## 📱 Device Testing Matrix

### Recommended Test Devices

| Device Type | OS Version | Screen Size | Priority | Notes |
|-------------|------------|-------------|----------|-------|
| iPhone 14/15 | iOS 17+ | 6.1" | High | Latest iOS features |
| iPhone SE | iOS 15+ | 4.7" | High | Small screen, older hardware |
| iPhone 11 | iOS 16+ | 6.1" | Medium | Mid-range performance |
| Pixel 7/8 | Android 13+ | 6.3" | High | Pure Android experience |
| Samsung Galaxy S21 | Android 12+ | 6.2" | High | Popular Samsung device |
| OnePlus/Xiaomi | Android 11+ | 6.4" | Medium | Third-party Android skin |
| Budget Android | Android 10+ | 5.5" | Medium | Low-end hardware test |
| iPad | iOS 16+ | 10.2" | Low | Tablet optimization |

### Screen Size Categories

- **Small**: 4.7" - 5.5" (iPhone SE, older Androids)
- **Medium**: 5.8" - 6.1" (iPhone 14, Pixel)
- **Large**: 6.3" - 6.7" (iPhone 15 Pro Max, Samsung S21+)
- **Tablet**: 10"+ (iPad, Android tablets)

## 🧪 Testing with Expo Go

### Install Expo Go

**iOS:**
```bash
# Open App Store and search "Expo Go"
# Or scan QR code from terminal
npx expo start
```

**Android:**
```bash
# Open Play Store and search "Expo Go"
# Or scan QR code from terminal
npx expo start
```

### Run on Physical Device

```bash
# Start development server
cd /home/deepak/.gemini/antigravity/projects/travel-rewards-app
source ~/.nvm/nvm.sh && nvm use 20
npx expo start

# Options:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with device camera
```

### Network Testing

```bash
# Test on same WiFi network
npx expo start --lan

# Test via tunnel (slower but works across networks)
npx expo start --tunnel

# Test on localhost (emulator/simulator only)
npx expo start --localhost
```

## ✅ Manual Test Cases

### Home Screen Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Screen renders** | Open app | Home screen displays with logo and buttons | ⏳ |
| **Logo display** | Check logo | "Travel" and "Rewards" text visible, styled correctly | ⏳ |
| **View Rewards button** | Tap "View Rewards" | Navigates to Rewards screen | ⏳ |
| **Share button** | Tap "Share App" | Opens native share dialog | ⏳ |
| **Rate button** | Tap "Rate Us" | Opens app store (or shows placeholder) | ⏳ |
| **Settings button** | Tap gear icon | Navigates to Settings screen | ⏳ |
| **Interstitial ad** | Open app 3 times | Shows ad dialog/alert on 3rd launch | ⏳ |
| **Screen orientation** | Rotate device | Layout adapts correctly (portrait only) | ⏳ |

### Rewards Screen Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Initial load** | Navigate from Home | Shows loading indicator, then rewards list | ⏳ |
| **Section headers** | Scroll list | Date sections visible (Today, Yesterday, Feb 6) | ⏳ |
| **Reward cards** | Check cards | Icon, label, and arrow visible for each | ⏳ |
| **Expired rewards** | Find expired item | Faded appearance, "EXPIRED" badge | ⏳ |
| **Pull to refresh** | Pull down list | Refresh indicator, data reloads | ⏳ |
| **Tap reward** | Tap any card | Opens claim modal with details | ⏳ |
| **Banner ad** | Scroll to bottom | Banner ad placeholder visible | ⏳ |
| **Empty state** | No rewards | Shows "No Rewards Yet" with emoji and refresh | ⏳ |
| **Error state** | Network off | Shows connection error with retry button | ⏳ |
| **Long list scroll** | Scroll fast | Smooth 60fps scrolling, no jank | ⏳ |
| **Accessibility** | VoiceOver/TalkBack | Screen reader announces elements correctly | ⏳ |

### Claim Modal Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Modal opens** | Tap reward card | Modal slides up with reward details | ⏳ |
| **Reward details** | Check content | Icon, label, URL preview visible | ⏳ |
| **Copy button** | Tap "Copy Link" | Shows "✓ Copied" feedback for 2 seconds | ⏳ |
| **Clipboard** | Paste elsewhere | Reward URL is in clipboard | ⏳ |
| **Claim button** | Tap "Claim Reward" | Opens browser with URL, modal closes | ⏳ |
| **Close button** | Tap "X" or backdrop | Modal dismisses | ⏳ |
| **Expired reward** | Open expired item | Claim button still works (edge case) | ⏳ |

### Settings Screen Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Screen loads** | Navigate to Settings | Settings screen displays | ⏳ |
| **Notifications OFF** | Toggle switch off | Saves preference, updates AsyncStorage | ⏳ |
| **Notifications ON** | Toggle switch on | Requests permission, shows alert | ⏳ |
| **Permission denied** | Deny permission | Shows "Permission Denied" alert | ⏳ |
| **Test notification** | Tap "Test Notification" | Schedules notification, shows confirmation | ⏳ |
| **Notification received** | Wait 5 seconds | Notification appears in tray | ⏳ |
| **Tap notification** | Tap from tray | Opens app to Rewards screen | ⏳ |
| **App version** | Check version | Shows "1.0.0" | ⏳ |
| **Back navigation** | Press back | Returns to previous screen | ⏳ |

### Navigation Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Stack navigation** | Home → Rewards → Settings | Each screen navigates correctly | ⏳ |
| **Back button (Android)** | Press hardware back | Returns to previous screen | ⏳ |
| **Header back button** | Tap header back arrow | Returns to previous screen | ⏳ |
| **Deep link** | Open app from notification | Navigates directly to Rewards | ⏳ |

### Error Boundary Tests

| Test Case | Steps | Expected Result | Status |
|-----------|-------|-----------------|--------|
| **Crash recovery** | Force JS error | Shows error boundary UI with "Try Again" | ⏳ |
| **Try Again** | Tap "Try Again" button | Resets error state, reloads app | ⏳ |
| **Dev mode error** | Check in dev | Shows error details in error boundary | ⏳ |

## 🌐 Network Condition Tests

### Simulate Network Conditions

**iOS Simulator:**
```
Settings → Developer → Network Link Conditioner
- 3G
- LTE
- Very Bad Network
```

**Android Emulator:**
```
Extended Controls (⋯) → Cellular → Network type
- EDGE (2G)
- HSDPA (3G)
- LTE (4G)
```

**Chrome DevTools (Web debugging):**
```
Network tab → Throttling
- Slow 3G
- Fast 3G
- Offline
```

### Network Test Cases

| Condition | Expected Behavior | Status |
|-----------|-------------------|--------|
| **WiFi (fast)** | Rewards load instantly | ⏳ |
| **4G LTE** | Rewards load within 1-2s | ⏳ |
| **3G** | Rewards load within 3-5s, show loading indicator | ⏳ |
| **Offline** | Show connection error with retry | ⏳ |
| **Intermittent** | Retry logic works, eventual success | ⏳ |
| **Timeout** | Shows error after 10s, retry available | ⏳ |

## 📱 Platform-Specific Tests

### iOS-Specific

- [ ] Status bar color (light content)
- [ ] Safe area insets (notch devices)
- [ ] Haptic feedback (if implemented)
- [ ] App icon on home screen
- [ ] Splash screen on launch
- [ ] Background notification handling
- [ ] App Store rating flow

### Android-Specific

- [ ] Status bar color and style
- [ ] Navigation bar handling
- [ ] Hardware back button
- [ ] Adaptive icon
- [ ] Splash screen
- [ ] Background notification handling
- [ ] Play Store rating flow
- [ ] Different Android skins (Samsung, OnePlus, etc.)

## 🔍 Performance Tests

### Measure Performance

```bash
# Start with performance monitoring
npx expo start --dev-client

# Check metrics in terminal:
# - Bundle size
# - RAM usage
# - JS thread FPS
# - UI thread FPS
```

### Performance Checklist

- [ ] App launches in < 3 seconds (cold start)
- [ ] Screen transitions < 300ms
- [ ] List scrolls at 60 FPS
- [ ] No memory leaks (test 10+ min session)
- [ ] API calls complete < 2 seconds
- [ ] Modal animations smooth
- [ ] No frame drops during interaction

## 🎯 Accessibility Tests

### Enable Screen Reader

**iOS:** Settings → Accessibility → VoiceOver
**Android:** Settings → Accessibility → TalkBack

### Accessibility Checklist

- [ ] All buttons have accessibility labels
- [ ] Screen reader announces correctly
- [ ] Navigation works with gestures
- [ ] Text scaling works (large text)
- [ ] Touch targets ≥ 44x44 points
- [ ] Color contrast meets WCAG AA
- [ ] No reliance on color alone

### Test with Large Text

**iOS:** Settings → Accessibility → Display & Text Size
**Android:** Settings → Display → Font size

## 🐛 Bug Reporting Template

```markdown
**Device:** iPhone 14 Pro / Pixel 7
**OS:** iOS 17.2 / Android 13
**App Version:** 1.0.0
**Build:** Expo Go / Development Build

**Issue:**
Brief description of the problem

**Steps to Reproduce:**
1. Open app
2. Navigate to Rewards
3. Tap first reward
4. Error occurs

**Expected:**
What should happen

**Actual:**
What actually happened

**Screenshots/Video:**
[Attach if available]

**Logs:**
```
Error: Failed to fetch
  at getRewards (rewards.ts:25)
```

**Additional Context:**
Network condition, specific device features, etc.
```

## 📝 Testing Checklist Summary

### Pre-Launch Checklist

- [ ] Test on minimum 3 iOS devices (or simulators)
- [ ] Test on minimum 3 Android devices (or emulators)
- [ ] Test all user flows end-to-end
- [ ] Test with slow network (3G simulation)
- [ ] Test offline behavior
- [ ] Test notification delivery
- [ ] Test with screen reader enabled
- [ ] Test with large text size
- [ ] Test error recovery (crashes, network errors)
- [ ] Verify all interactive elements accessible
- [ ] Check app icon and splash screen
- [ ] Verify deep linking works
- [ ] Test ad display (banner and interstitial)
- [ ] Performance check (FPS, memory, launch time)
- [ ] Security check (no sensitive data logged)

### Known Limitations (Expo Go)

- ❌ Real ads won't show (requires development build)
- ❌ Custom notification sounds (requires development build)
- ❌ Background location (not needed for this app)
- ✅ Everything else works perfectly

## 🚀 Next Steps

After manual testing:
1. Document any bugs found
2. Fix critical issues
3. Re-test fixed issues
4. Get beta testers (TestFlight/Play Internal Testing)
5. Collect feedback
6. Iterate and improve

## 📚 Resources

- [Expo Device Testing](https://docs.expo.dev/workflow/run-on-device/)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [iOS Simulator Guide](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device)
- [Android Emulator](https://developer.android.com/studio/run/emulator)

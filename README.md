# 🎁 Travel Rewards App

A cross-platform React Native mobile application for displaying and claiming daily game rewards. Built with Expo, TypeScript, and designed with a warm, inviting theme.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-~54.0.33-000020.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

## 📱 Features

### Core Functionality
- ✅ **Daily Rewards Display** - Browse rewards grouped by date with pull-to-refresh
- ✅ **One-Tap Claiming** - Copy reward links or open directly in browser
- ✅ **Push Notifications** - Get notified when new rewards are available
- ✅ **Ad Monetization** - Banner and interstitial ads with smart frequency control
- ✅ **Settings Management** - Configure notification preferences
- ✅ **Share & Rate** - Built-in sharing and app store rating functionality

### Technical Highlights
- 🎨 Custom warm beige theme with consistent design system
- 🔔 Local push notification support
- 💰 AdMob integration (ready for production)
- ♿ Full accessibility support (VoiceOver/TalkBack)
- 🛡️ Error boundaries for crash recovery
- 📊 Performance optimized with React hooks and memoization
- 🌍 Cross-platform (iOS & Android)

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v20.20.0+ (use nvm: `nvm use 20`)
- **npm**: v10.8.2+
- **Expo CLI**: Latest version
- **iOS Simulator** (Mac) or **Android Studio** (for emulator)
- **Physical device** with Expo Go app (recommended for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/Deepak22903/travel-rewards-app.git
cd travel-rewards-app

# Use Node 20
nvm use 20
# or
source ~/.nvm/nvm.sh && nvm use 20

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

#### On Physical Device (Recommended)
1. Install **Expo Go** from App Store (iOS) or Play Store (Android)
2. Scan the QR code from the terminal
3. App will load on your device

#### On Simulator/Emulator
```bash
# iOS Simulator (Mac only)
npx expo start --ios

# Android Emulator
npx expo start --android

# Web browser
npx expo start --web
```

## 📂 Project Structure

```
travel-rewards-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── BannerAd.tsx    # Banner advertisement component
│   │   ├── ClaimModal.tsx  # Reward claiming modal
│   │   └── ErrorBoundary.tsx # Crash recovery wrapper
│   ├── core/
│   │   ├── ads/            # AdMob configuration and hooks
│   │   ├── api/            # API client and endpoints
│   │   ├── constants/      # Theme, config, and app constants
│   │   ├── notifications/  # Push notification handling
│   │   └── types/          # TypeScript type definitions
│   ├── navigation/         # React Navigation setup
│   └── screens/           # Main app screens
│       ├── HomeScreen.tsx
│       ├── RewardsScreen.tsx
│       └── SettingsScreen.tsx
├── assets/                 # Images, icons, splash screens
├── docs/                   # Documentation files
│   ├── ADMOB_SETUP.md
│   ├── APP_ICON_SETUP.md
│   ├── NOTIFICATIONS_SETUP.md
│   ├── PERFORMANCE.md
│   └── TESTING_GUIDE.md
├── App.tsx                 # Root component
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

## 🛠 Tech Stack

### Core
- **Framework**: React Native 0.81.5
- **Platform**: Expo ~54.0.33
- **Language**: TypeScript 5.9.2
- **Navigation**: React Navigation 7

### Features
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **API Client**: Axios
- **Storage**: AsyncStorage
- **Notifications**: expo-notifications
- **Ads**: react-native-google-mobile-ads
- **Clipboard**: expo-clipboard

### Development
- **Package Manager**: npm
- **Version Control**: Git
- **Code Quality**: TypeScript strict mode
- **Node Version**: 20.20.0 (via nvm)

## 🎨 Design System

### Color Palette
- **Background**: #F5E6D3 (Warm beige)
- **Accent**: #F5A623 (Golden orange)
- **Text Primary**: #5D4E37 (Dark brown)
- **Card**: #FDF8F3 (Off-white)
- **Success**: #4CAF50 (Green)

### Typography
- **Font Sizes**: 12px - 48px
- **Font Weights**: 400, 500, 600, 700

## 📖 Documentation

Comprehensive guides available in the project:

- **[AdMob Setup Guide](ADMOB_SETUP.md)** - Complete AdMob integration instructions
- **[App Icon Setup](APP_ICON_SETUP.md)** - Icon and splash screen creation
- **[Notifications Setup](NOTIFICATIONS_SETUP.md)** - Push notification configuration
- **[Performance Guide](PERFORMANCE.md)** - Optimization strategies
- **[Testing Guide](TESTING_GUIDE.md)** - Manual testing procedures
- **[Implementation Plan](ImplementationPlan.md)** - Full project roadmap

## 🧪 Testing

### Development Testing
```bash
# Start with clear cache
npx expo start --clear

# Test on iOS simulator
npx expo start --ios

# Test on Android emulator
npx expo start --android
```

### Testing Checklist
- [ ] Home screen navigation
- [ ] Rewards list display and refresh
- [ ] Reward modal (copy/claim functionality)
- [ ] Settings (notifications toggle)
- [ ] Test notification
- [ ] Share and rate functionality
- [ ] Error states (offline mode)
- [ ] Accessibility (screen reader)

See [TESTING_GUIDE.md](TESTING_GUIDE.md) for comprehensive test cases.

## 🚀 Deployment

### Build for Production

#### Install EAS CLI
```bash
npm install -g eas-cli
eas login
```

#### Configure Project
```bash
eas build:configure
```

#### Build for Platforms
```bash
# Android
eas build --profile production --platform android

# iOS (requires Apple Developer account)
eas build --profile production --platform ios

# Both platforms
eas build --profile production --platform all
```

### App Store Submission
See [Phase 9 documentation](ImplementationPlan.md#phase-9-store-submission) for complete store submission guide.

## 🔧 Configuration

### Environment Variables
Configure in `src/core/constants/config.ts`:
- API_BASE_URL
- APP_STORE_URL
- PLAY_STORE_URL
- ADMOB_APP_ID

### AdMob Setup
1. Create AdMob account
2. Generate app and ad unit IDs
3. Update `src/core/ads/adConfig.ts`
4. See [ADMOB_SETUP.md](ADMOB_SETUP.md) for details

### Notifications Setup
1. Configure Firebase project (for production)
2. Update `app.json` with notification settings
3. See [NOTIFICATIONS_SETUP.md](NOTIFICATIONS_SETUP.md) for details

## 📊 Features Status

| Feature | Status | Notes |
|---------|--------|-------|
| Navigation | ✅ Complete | 3 screens with stack navigation |
| Home Screen | ✅ Complete | Logo, actions, settings |
| Rewards Screen | ✅ Complete | SectionList, pull-to-refresh |
| Claim Modal | ✅ Complete | Copy/open functionality |
| Settings | ✅ Complete | Notifications toggle, persistence |
| Push Notifications | ✅ Complete | Local notifications working |
| Banner Ads | ✅ Complete | Mock in Expo Go, ready for prod |
| Interstitial Ads | ✅ Complete | Frequency control implemented |
| Error Boundaries | ✅ Complete | Crash recovery |
| Accessibility | ✅ Complete | Screen reader support |
| Performance | ✅ Optimized | 60fps scrolling |

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style
- Use TypeScript strict mode
- Follow existing code structure
- Add comments for complex logic
- Test on both iOS and Android

## 📝 Development Timeline

- **Phase 1**: Project foundation ✅
- **Phase 2**: Home screen ✅
- **Phase 3**: Rewards screen ✅
- **Phase 4**: Settings screen ✅
- **Phase 5**: Push notifications ✅
- **Phase 6**: Ad monetization ✅
- **Phase 7**: Polish & testing ✅
- **Phase 8**: Store submission ⏳

## 🐛 Known Issues

- Push notifications limited in Expo Go (requires development build)
- Real ads require development build (mock implementation in Expo Go)
- Package version warnings (non-critical for development)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Deepak**
- GitHub: [@Deepak22903](https://github.com/Deepak22903)

## 🙏 Acknowledgments

- Expo team for excellent tooling
- React Navigation for routing solution
- Google AdMob for monetization
- Open source community

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Check documentation in `/docs` folder
- Review implementation plan

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced analytics
- [ ] Rewarded video ads
- [ ] User accounts & authentication
- [ ] Cross-promotion with other apps
- [ ] Backend API integration

---

**Built with ❤️ using React Native & Expo**

# 🎁 Game Rewards App Template

A configurable, cross-platform React Native template for building reward apps for different mobile games. Built with Expo, TypeScript, and designed for easy customization.

**Current Configuration**: Travel Town Daily Rewards

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

## 🎮 Using This Template

This project is a **template system** - you can easily create similar reward apps for different mobile games!

### Quick Template Usage

```bash
# 1. Edit configuration (single file!)
nano src/core/constants/gameConfig.ts

# 2. Validate your changes
npm run validate

# 3. Update build configuration
npm run build:update

# 4. Replace assets (icons, splash screens)
# See ASSETS_GUIDE.md for specifications

# 5. Start development
npm start
```

### Complete Setup Guides

- **[Template Guide](TEMPLATE_GUIDE.md)** - Step-by-step guide to create a new game app
- **[Assets Guide](ASSETS_GUIDE.md)** - Detailed specifications for icons and images
- **[Example Config](src/core/constants/gameConfig.example.ts)** - MONOPOLY GO! configuration example

### Template Features

- ✅ **Single config file** - All game-specific settings in `gameConfig.ts`
- ✅ **No code changes needed** - Just edit configuration and replace assets
- ✅ **Automatic validation** - Built-in checks for common mistakes
- ✅ **Build scripts** - Automatically sync app.json with your config
- ✅ **Complete documentation** - Guides for every step
- ✅ **Working example** - See how to configure a different game

### NPM Scripts for Template

```bash
npm run validate       # Validate gameConfig.ts
npm run build:update   # Update app.json from config
npm run build:game     # Validate + update (recommended)
```

---

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
│   │   │   ├── gameConfig.ts         # ⭐ MAIN CONFIG FILE
│   │   │   ├── gameConfig.example.ts # Example for different game
│   │   │   ├── config.ts             # Imports from gameConfig
│   │   │   └── theme.ts              # Theme from gameConfig
│   │   ├── notifications/  # Push notification handling
│   │   └── types/          # TypeScript type definitions
│   ├── navigation/         # React Navigation setup
│   └── screens/           # Main app screens
│       ├── HomeScreen.tsx
│       ├── RewardsScreen.tsx
│       └── SettingsScreen.tsx
├── assets/                 # Images, icons, splash screens (replace these!)
├── scripts/                # Template build and validation scripts
│   ├── validateConfig.js   # Validates gameConfig.ts
│   └── buildGame.js        # Updates app.json from config
├── docs/                   # Documentation files
│   ├── ADMOB_SETUP.md
│   ├── APP_ICON_SETUP.md
│   ├── NOTIFICATIONS_SETUP.md
│   ├── PERFORMANCE.md
│   └── TESTING_GUIDE.md
├── TEMPLATE_GUIDE.md       # ⭐ How to create new game app
├── ASSETS_GUIDE.md         # ⭐ Asset specifications
├── App.tsx                 # Root component
├── app.json               # Expo configuration (auto-updated)
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

### Theme Customization

All colors, text, and branding are configured in `src/core/constants/gameConfig.ts`:

```typescript
// Example: Travel Town theme (current)
THEME_COLORS: {
  background: '#F5E6D3',     // Warm beige
  primary: '#F5A623',        // Golden orange
  text: '#5D4E37',           // Dark brown
}

// Can be changed to any game theme!
```

### Default Colors (Travel Town)
- **Background**: #F5E6D3 (Warm beige)
- **Accent**: #F5A623 (Golden orange)
- **Text Primary**: #5D4E37 (Dark brown)
- **Card**: #FDF8F3 (Off-white)
- **Success**: #4CAF50 (Green)

### Typography
- **Font Family**: Fredoka (Google Fonts)
- **Font Sizes**: 12px - 48px
- **Font Weights**: 400, 500, 600, 700

## 📖 Documentation

### Template Documentation (Start Here!)

- **[Template Guide](TEMPLATE_GUIDE.md)** ⭐ - Complete guide to creating a new game app
- **[Assets Guide](ASSETS_GUIDE.md)** ⭐ - Specifications for icons and splash screens
- **[Example Config](src/core/constants/gameConfig.example.ts)** - MONOPOLY GO! configuration

### Technical Documentation

Comprehensive technical guides available in the [`docs/`](docs/) directory:

- **[AdMob Setup Guide](docs/ADMOB_SETUP.md)** - Complete AdMob integration instructions
- **[App Icon Setup](docs/APP_ICON_SETUP.md)** - Icon and splash screen creation
- **[Notifications Setup](docs/NOTIFICATIONS_SETUP.md)** - Push notification configuration
- **[Performance Guide](docs/PERFORMANCE.md)** - Optimization strategies
- **[Testing Guide](docs/TESTING_GUIDE.md)** - Manual testing procedures
- **[Implementation Plan](docs/ImplementationPlan.md)** - Full project roadmap
- **[Phase 1 Summary](docs/PHASE1_COMPLETE.md)** - Foundation completion report
- **[Phase 8 Summary](docs/PHASE8_COMPLETE.md)** - Polish & testing completion report

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

See [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for comprehensive test cases.

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
docs/
### App Store Submission
See [Phase 9 documentation](ImplementationPlan.md#phase-9-store-submission) for complete store submission guide.

## 🔧 Configuration

### Game-Specific Configuration

**All game-specific settings are in ONE file**: `src/core/constants/gameConfig.ts`

This includes:
- App name, version, and bundle identifiers
- Game name, company, and branding
- Theme colors (all UI colors)
- Reward types (names and icons)
- All UI text and messages
- External URLs (privacy, terms, app stores)
- AdMob app IDs
- Firebase configuration
- Backend API settings

**To create a new game app**: See [TEMPLATE_GUIDE.md](TEMPLATE_GUIDE.md)

### Legacy Configuration Files

These files now import from `gameConfig.ts`:
- `src/core/constants/config.ts` - App configuration
- `src/core/constants/theme.ts` - Theme colors
- `src/core/ads/adConfig.ts` - AdMob configuration

### Environment Variables

No environment variables needed! Everything is in `gameConfig.ts`.

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

### App Features
- [ ] Multi-language support
- [ ] Dark mode theme
- [ ] Advanced analytics
- [ ] Rewarded video ads
- [ ] User accounts & authentication
- [ ] Cross-promotion with other apps

### Template System
- [ ] CLI tool for interactive configuration
- [ ] Asset generator/optimizer
- [ ] Automated testing for configurations
- [ ] More game examples
- [ ] Plugin system for custom features

---

**Built with ❤️ using React Native & Expo**

**Template System**: Create reward apps for any mobile game in minutes!

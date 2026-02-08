# App Icon & Splash Screen Setup

## Current Status

The app currently uses default Expo icons and splash screen. For production, custom assets should be created with your branding.

## Asset Requirements

### App Icon
- **File**: `assets/icon.png`
- **Size**: 1024x1024 px (iOS requirement)
- **Format**: PNG with transparency
- **Guidelines**:
  - Simple, recognizable design
  - Works well at small sizes (20x20 to 180x180)
  - No transparency on edges for Android adaptive icon
  - Travel/rewards themed (e.g., airplane, gift box, compass)

### Adaptive Icon (Android)
- **File**: `assets/adaptive-icon.png`
- **Size**: 1024x1024 px
- **Safe Zone**: Keep important elements within 768x768 center circle
- **Background**: Solid color matching theme (#F5E6D3)
- **Foreground**: Icon design with transparency

### Splash Screen
- **File**: `assets/splash-icon.png`
- **Size**: 1242x2436 px (iPhone 11 Pro Max)
- **Format**: PNG
- **Background**: #F5E6D3 (warm beige from theme)
- **Content**: Centered logo/icon with app name
- **Guidelines**:
  - Keep content in safe area (center 60%)
  - Avoid text that's too small
  - Consistent with app icon design

### Favicon (Web)
- **File**: `assets/favicon.png`
- **Size**: 48x48 px or 32x32 px
- **Format**: PNG
- **Design**: Simplified version of app icon

### Notification Icon (Android)
- **File**: `assets/notification-icon.png`
- **Size**: 96x96 px (xxxhdpi)
- **Format**: PNG with transparency
- **Guidelines**:
  - Monochrome silhouette (white icon, transparent background)
  - Simple, recognizable at small size
  - Android will tint it based on system settings

## Design Recommendations

### Color Palette
Use the app's existing theme colors:
- **Primary Background**: #F5E6D3 (warm beige)
- **Accent**: #F5A623 (golden orange)
- **Text**: #2C2C2E (dark gray)

### Icon Concepts
1. **Travel Theme**:
   - ✈️ Airplane + gift box
   - 🗺️ Map with reward pin
   - 🎁 Wrapped gift with travel badge

2. **Rewards Theme**:
   - ⚡ Energy bolt (matches app's energy icon)
   - 🪙 Coin with plane silhouette
   - 💎 Gem with destination tag

3. **Combination**:
   - Circular badge with plane + energy/coin icons
   - Passport-style icon with reward stamps

## Quick Setup (Using Default Assets)

The current setup already includes default Expo assets. To test with custom icons:

### 1. Generate Icons Online
Use these free tools:
- [App Icon Generator](https://www.appicon.co/) - Upload 1024x1024, get all sizes
- [Icon Kitchen](https://icon.kitchen/) - Android adaptive icons
- [Figma](https://www.figma.com/) - Design from scratch
- [Canva](https://www.canva.com/) - Template-based design

### 2. Replace Files
```bash
# Replace in assets/ folder
assets/icon.png                  # Main app icon (1024x1024)
assets/adaptive-icon.png         # Android adaptive (1024x1024)
assets/splash-icon.png           # Splash screen image (1242x2436)
assets/favicon.png               # Web favicon (48x48)
assets/notification-icon.png     # Android notification icon (96x96)
```

### 3. Test Icons
```bash
# Clear cache and restart
npx expo start --clear

# For development build
eas build --profile development --platform android
```

## app.json Configuration

Already configured in `app.json`:

```json
{
  "expo": {
    "name": "Travel Rewards",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "backgroundColor": "#F5E6D3"
    },
    "ios": {
      "bundleIdentifier": "com.travelrewards.app"
    },
    "android": {
      "package": "com.travelrewards.app",
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#F5E6D3"
      }
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#F5A623"
        }
      ]
    ]
  }
}
```

## Production Checklist

- [ ] Create custom app icon (1024x1024)
- [ ] Create adaptive icon foreground (1024x1024)
- [ ] Create splash screen (1242x2436)
- [ ] Create notification icon silhouette (96x96)
- [ ] Test on iOS simulator
- [ ] Test on Android emulator
- [ ] Test on physical devices
- [ ] Verify icon looks good at all sizes
- [ ] Verify splash screen timing (not too fast/slow)
- [ ] Verify notification icon color/visibility

## Resources

- [Expo Icon Requirements](https://docs.expo.dev/develop/user-interface/app-icons/)
- [Expo Splash Screen Guide](https://docs.expo.dev/develop/user-interface/splash-screen/)
- [Android Adaptive Icons](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/app-icons)
- [Material Design Icon System](https://m3.material.io/styles/icons/overview)

## Notes

- Current assets are placeholders from Expo template
- Custom icons should be created before production launch
- Icons significantly impact first impression and downloads
- Consider hiring a designer for professional results
- Budget: $50-$200 for quality icon design on Fiverr/Upwork

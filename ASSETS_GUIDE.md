# Assets Guide: Creating App Icons and Images

This guide provides detailed specifications for all visual assets needed for your game rewards app.

## Overview

You need to create **4 asset files** to fully customize the app's appearance:

1. **Icon** (`icon.png`) - Main app icon
2. **Splash Icon** (`splash-icon.png`) - Launch screen logo
3. **Adaptive Icon** (`adaptive-icon.png`) - Android adaptive icon
4. **Favicon** (`favicon.png`) - Web app icon

All assets go in the `assets/` folder at the project root.

---

## Asset Specifications

### 1. App Icon (`icon.png`)

**Purpose**: The main icon users see on their device home screen.

**Specifications**:
- **Dimensions**: 1024 × 1024 pixels
- **Format**: PNG
- **Background**: Solid color (no transparency)
- **Content**: Logo or symbol representing your game
- **Safe Zone**: Keep important content within center 90% (rounded corners may crop edges)

**Design Tips**:
- Use colors from your game's theme
- Keep design simple - it will be displayed at small sizes (60-180px)
- Ensure good contrast between foreground and background
- Test how it looks at different sizes
- Avoid small text (it becomes unreadable)
- Make it instantly recognizable

**Examples**:
```
Travel Town:  ⚡ lightning bolt on warm beige background
MONOPOLY GO!: 🎲 dice on green/blue gradient
Coin Master:  🪙 coin shield on purple background
```

**Export Settings**:
- PNG-24
- No transparency
- sRGB color space
- Optimize file size (keep under 1MB)

---

### 2. Splash Icon (`splash-icon.png`)

**Purpose**: Logo displayed in the center of the screen when the app launches.

**Specifications**:
- **Dimensions**: 1024 × 1024 pixels
- **Format**: PNG
- **Background**: **Transparent** (required!)
- **Content**: Logo or symbol, same as icon or simplified version
- **Safe Zone**: Keep content within center 80% for best display

**Important Notes**:
- This displays ON TOP of your splash background color (set in `THEME_COLORS.splashBackground`)
- Use transparency to let background color show through
- Consider how it looks on your chosen background color
- This can be the same design as your icon, just with transparent background

**Design Tips**:
- Simplify the design if needed (no text unless large)
- Ensure logo has good contrast with splash background color
- Center the main visual element
- Leave padding around edges (at least 10% on each side)
- Test against your splash background color

**Background Color**:
Set in `gameConfig.ts`:
```typescript
THEME_COLORS: {
  splashBackground: '#F5E6D3',  // Your splash screen background
}
```

**Preview Your Splash**:
Splash screen = `splashBackground` color + `splash-icon.png` centered on top

**Export Settings**:
- PNG-24
- **Transparent background**
- sRGB color space
- Optimize file size

---

### 3. Adaptive Icon (`adaptive-icon.png`)

**Purpose**: Foreground layer for Android adaptive icons (Android 8.0+).

**Specifications**:
- **Dimensions**: 1024 × 1024 pixels
- **Format**: PNG
- **Background**: **Transparent** (required!)
- **Content**: Logo or symbol
- **Safe Zone**: **Critical!** Keep all important content within center 66% (circle diameter ~660px)

**Android Adaptive Icons Explained**:

Android uses a 2-layer system:
1. **Background layer**: Solid color (set in `THEME_COLORS.splashBackground`)
2. **Foreground layer**: Your adaptive-icon.png

Android can crop adaptive icons into different shapes:
- Circle (most common)
- Rounded square
- Squircle
- Device-specific shapes

**Safe Zone**:
```
┌─────────────────────┐
│  ┌───────────────┐  │  Outer 17% may be cropped
│  │               │  │
│  │   ┌───────┐   │  │  Safe zone (center 66%)
│  │   │ LOGO  │   │  │  Keep ALL content here!
│  │   └───────┘   │  │
│  │               │  │
│  └───────────────┘  │
└─────────────────────┘
    1024x1024 canvas
```

**Design Tips**:
- Design for the **circle** (most restrictive shape)
- Keep logo centered
- Keep content within 660px diameter circle at center
- Test how it looks when masked to different shapes
- Can be same as splash-icon.png if it fits safe zone

**Common Mistakes**:
- ❌ Content too close to edges → gets cropped
- ❌ Text in corners → becomes unreadable
- ❌ Horizontal/vertical logo → doesn't fit circle
- ✅ Centered icon within safe zone → works everywhere

**Testing**:
Use Android Studio's Image Asset Studio to preview different shapes:
```bash
Android Studio → Image Asset → Icon Type: Adaptive Icon
```

**Export Settings**:
- PNG-24
- **Transparent background**
- sRGB color space

---

### 4. Favicon (`favicon.png`)

**Purpose**: Icon for web version and browser tabs.

**Specifications**:
- **Dimensions**: 48 × 48 pixels
- **Format**: PNG
- **Background**: Can be solid or transparent
- **Content**: Simplified version of your icon

**Design Tips**:
- Very small size - simplify your icon as much as possible
- High contrast between foreground and background
- Can be a cropped/simplified version of your main icon
- Should be recognizable but doesn't need detail

**Export Settings**:
- PNG-8 or PNG-24
- Optimize file size (should be tiny, under 10KB)
- sRGB color space

---

## Asset Checklist

Before replacing assets, ensure:

- [ ] **icon.png**: 1024x1024, PNG, solid background, centered design
- [ ] **splash-icon.png**: 1024x1024, PNG, **transparent** background
- [ ] **adaptive-icon.png**: 1024x1024, PNG, **transparent**, content in center 66%
- [ ] **favicon.png**: 48x48, PNG, simplified design
- [ ] All files optimized for size (use tools like TinyPNG)
- [ ] Tested splash icon on your background color
- [ ] Tested adaptive icon with circle mask
- [ ] All designs match game theme and brand

---

## Design Workflow

### Recommended Tools

**Vector Design**:
- Figma (free, web-based)
- Adobe Illustrator
- Sketch
- Inkscape (free)

**Raster Editing**:
- Adobe Photoshop
- GIMP (free)
- Affinity Photo

**Online Tools**:
- Canva (templates available)
- Figma (free tier)
- Remove.bg (background removal)

**Optimization**:
- TinyPNG (https://tinypng.com/)
- ImageOptim (Mac)
- Squoosh (https://squoosh.app/)

---

### Step-by-Step Workflow

#### 1. Create Master Design (1024x1024)

Start with a vector or high-resolution design:
- Create 1024x1024 artboard
- Design your icon/logo
- Keep it simple and recognizable
- Use game's brand colors

#### 2. Export Main Icon

- Add solid background color
- Ensure content is well-positioned
- Export as PNG: `icon.png`
- Optimize file size

#### 3. Create Transparent Version

- Remove background
- Ensure logo has clean edges (no artifacts)
- Export as PNG: `splash-icon.png`
- Test on your background color

#### 4. Create Adaptive Icon

Option A: Use same as splash-icon.png if it fits safe zone

Option B: Create new version:
- Remove background
- Ensure content fits in center circle (660px diameter)
- Simplify if needed
- Export as PNG: `adaptive-icon.png`

#### 5. Create Favicon

- Scale down to 48x48 OR
- Simplify design for small size
- Export as PNG: `favicon.png`
- Optimize aggressively

#### 6. Validate Assets

Run validation script:
```bash
npm run validate
```

This checks:
- All files exist
- File sizes are reasonable
- Naming is correct

---

## Design Templates

### Figma Template Structure

```
Frame: Icon (1024x1024)
├── Background (solid color)
└── Logo (centered)

Frame: Splash Icon (1024x1024)
├── Background Color Preview
└── Logo (transparent, centered)

Frame: Adaptive Icon (1024x1024)
├── Safe Zone Guide (circle, 660px)
├── Background Color Preview
└── Logo (transparent, within safe zone)

Frame: Favicon (48x48)
└── Simplified Logo
```

### Color Consistency

Match colors from `gameConfig.ts`:
```typescript
THEME_COLORS: {
  primary: '#F5A623',        // Use for main logo color
  background: '#E8D4B8',     // Use for icon background
  splashBackground: '#F5E6D3', // Splash screen background
}
```

---

## Platform-Specific Guidelines

### iOS App Store Requirements

- Icons must not include transparency
- Icons should not look like iOS system icons
- Icons should not include Apple products or imagery
- Test on various iOS devices (different screen sizes)

### Google Play Store Requirements

- Adaptive icon foreground should work with any background
- Test with different device shapes/themes
- Icons should not violate trademark/copyright
- High-resolution icon required for store listing (512x512)

**Note**: The 1024x1024 icon will be automatically resized for store listings.

---

## Testing Your Assets

### Visual Testing

1. **Icon Testing**:
   ```bash
   npm start
   # Install on real device
   # Check home screen icon appearance
   ```

2. **Splash Screen Testing**:
   ```bash
   npm start
   # Open app
   # Observe splash screen (appears briefly on launch)
   ```

3. **Adaptive Icon Testing**:
   - Android only
   - Check on different Android devices
   - Try different home screen icon shapes (if device supports)

### Automated Validation

```bash
npm run validate
```

Checks:
- ✓ All files exist
- ✓ Files are correct format
- ✓ File sizes are reasonable (not too large)

---

## Common Issues & Solutions

### Issue: Icon looks blurry

**Solution**: 
- Ensure you're exporting at exactly 1024x1024
- Don't scale up smaller images
- Use vector source when possible
- Avoid compression artifacts

### Issue: Splash icon has white box around it

**Solution**:
- Ensure transparency is properly exported
- Check PNG has alpha channel
- Re-export with transparency enabled

### Issue: Adaptive icon is cropped

**Solution**:
- Content is outside safe zone
- Scale down content to fit within center 66%
- Keep minimum 17% margin on all sides

### Issue: Colors don't match

**Solution**:
- Use exact hex codes from `gameConfig.ts`
- Ensure color space is sRGB
- Check color profile in export settings

### Issue: File size too large

**Solution**:
- Optimize PNG files (use TinyPNG)
- Remove unnecessary metadata
- Use appropriate bit depth (24-bit for most)
- Consider reducing color palette if possible

---

## Examples Gallery

### Travel Town (Default)

```
icon.png:
- Lightning bolt ⚡ on warm beige (#E8D4B8)
- Clean, simple design
- Warm, inviting feel

splash-icon.png:
- Same lightning bolt on transparent background
- Displays over beige splash background (#F5E6D3)

adaptive-icon.png:
- Lightning bolt centered in circle
- Well within safe zone
- Works with all Android shapes
```

### MONOPOLY GO! (Example)

```
icon.png:
- Dice 🎲 on green/blue gradient
- Bold, recognizable
- Game-themed colors

splash-icon.png:
- Dice on transparent background
- Displays over light green splash (#E8F5E9)

adaptive-icon.png:
- Centered dice icon
- Fits perfectly in circle
- Vibrant colors pop
```

---

## Quick Reference

| Asset | Size | Background | Use Case |
|-------|------|------------|----------|
| `icon.png` | 1024×1024 | Solid | Home screen icon |
| `splash-icon.png` | 1024×1024 | **Transparent** | Launch screen |
| `adaptive-icon.png` | 1024×1024 | **Transparent** | Android icon layer |
| `favicon.png` | 48×48 | Any | Web/browser |

**Safe Zones**:
- Icon: Center 90% recommended
- Splash Icon: Center 80% recommended
- Adaptive Icon: Center 66% **required**
- Favicon: Entire canvas (already small)

---

## Resources

**Icon Design**:
- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/app-icons
- Material Design Icons: https://material.io/design/iconography
- Android Adaptive Icons: https://developer.android.com/develop/ui/views/launch/icon_design_adaptive

**Tools**:
- Figma Icon Templates: Search "mobile app icon" in Community
- Canva: Search "app icon" templates
- Icon Preview Tools: https://icon.kitchen/

**Optimization**:
- TinyPNG: https://tinypng.com/
- Squoosh: https://squoosh.app/
- ImageOptim: https://imageoptim.com/

---

**Need help?** See TEMPLATE_GUIDE.md for the complete setup process.

# Font Switching Guide 🎨

## 📍 **File to Edit:**
`src/core/constants/fonts.ts`

---

## 🔄 **How to Switch Fonts:**

1. Open `src/core/constants/fonts.ts`
2. Find the 4 font options (lines 12-72)
3. **Uncomment ONE option** (remove the `//` at the start of lines)
4. **Comment out the others** (add `//` at the start of lines)
5. Save the file
6. Reload the app (shake device → Reload, or `r` in Expo terminal)

---

## 🎨 **Font Options:**

### **Option 1: Fredoka** ⭐ (Currently Active)
```
Style: Rounded & Playful
Best for: Game UIs, kid-friendly apps
Readability: Excellent
Weights: 300, 400, 500, 600, 700
```

**Lines to uncomment:** 12-22
**Lines to comment:** 27-36, 41-53, 58-68

---

### **Option 2: Lilita One**
```
Style: Bold & Fun
Best for: Comic book feel, high impact
Readability: Good (bold only)
Weights: 400 only (bold everywhere)
```

**Lines to uncomment:** 27-36
**Lines to comment:** 12-22, 41-53, 58-68

---

### **Option 3: Baloo 2**
```
Style: Soft & Friendly
Best for: Warm, approachable apps
Readability: Excellent
Weights: 400, 500, 600, 700, 800
Special: Indian language support
```

**Lines to uncomment:** 41-53
**Lines to comment:** 12-22, 27-36, 58-68

---

### **Option 4: Chewy**
```
Style: Hand-drawn & Quirky
Best for: Maximum playfulness, unique look
Readability: Good (casual)
Weights: 400 only
```

**Lines to uncomment:** 58-68
**Lines to comment:** 12-22, 27-36, 41-53

---

## 📝 **Example: Switching to Baloo 2**

### Before (Fredoka active):
```typescript
// OPTION 1: Fredoka ✅ ACTIVE
import {
  Fredoka_300Light,
  // ...
} from '@expo-google-fonts/fredoka';

export const customFonts = {
  // ...
};

// OPTION 3: Baloo 2 ❌ COMMENTED
// import {
//   Baloo2_400Regular,
//   // ...
// } from '@expo-google-fonts/baloo-2';
// 
// export const customFonts = {
//   // ...
// };
```

### After (Baloo 2 active):
```typescript
// OPTION 1: Fredoka ❌ COMMENTED
// import {
//   Fredoka_300Light,
//   // ...
// } from '@expo-google-fonts/fredoka';
// 
// export const customFonts = {
//   // ...
// };

// OPTION 3: Baloo 2 ✅ ACTIVE
import {
  Baloo2_400Regular,
  // ...
} from '@expo-google-fonts/baloo-2';

export const customFonts = {
  // ...
};
```

---

## 🚀 **Testing Tips:**

1. **Try Option 1 first** (Fredoka - already active)
2. **Try Option 2** (Lilita One - bold everywhere)
3. **Try Option 3** (Baloo 2 - soft & friendly)
4. **Try Option 4** (Chewy - most quirky)

### What to Check:
- ✅ Logo area (should see font change)
- ✅ "Rewards" button text
- ✅ Share/Rate button text
- ✅ Rewards screen cards
- ✅ Settings screen text

---

## ⚠️ **Common Issues:**

### **App doesn't reload after changing font?**
- Shake device → tap "Reload"
- Or press `r` in the Expo terminal
- Or completely restart Expo: `Ctrl+C` then `npm start`

### **Error: "Cannot find module..."?**
- Make sure you commented out the OLD font
- Make sure you uncommented the NEW font correctly
- Check that all `//` are in the right places

### **Fonts look the same?**
- Make sure to reload the app after saving
- Try a complete restart: close Expo → `npm start`

---

## 🎯 **Recommendation:**

Start with **Fredoka** (Option 1) - it's already active and looks great for a travel rewards app!

If you want something bolder → try **Lilita One** (Option 2)
If you want something softer → try **Baloo 2** (Option 3)
If you want maximum fun → try **Chewy** (Option 4)

---

**Happy font testing!** 🎨

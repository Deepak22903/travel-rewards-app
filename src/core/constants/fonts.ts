/**
 * Font Configuration
 * 
 * INSTRUCTIONS:
 * - Uncomment ONE font option below (remove the //)
 * - Comment out the others (add // in front)
 * - Save the file and reload the app (shake device → Reload)
 * - Try each font to see which you like best!
 */

// ============================================
// OPTION 1: Fredoka (Rounded & Playful) ⭐ RECOMMENDED
// ============================================
import {
  Fredoka_300Light,
  Fredoka_400Regular,
  Fredoka_500Medium,
  Fredoka_600SemiBold,
  Fredoka_700Bold,
} from '@expo-google-fonts/fredoka';

export const customFonts = {
  'Custom-Light': Fredoka_300Light,
  'Custom-Regular': Fredoka_400Regular,
  'Custom-Medium': Fredoka_500Medium,
  'Custom-SemiBold': Fredoka_600SemiBold,
  'Custom-Bold': Fredoka_700Bold,
};

// ============================================
// OPTION 2: Lilita One (Bold & Fun)
// ============================================
// import { LilitaOne_400Regular } from '@expo-google-fonts/lilita-one';
// 
// export const customFonts = {
//   'Custom-Light': LilitaOne_400Regular,
//   'Custom-Regular': LilitaOne_400Regular,
//   'Custom-Medium': LilitaOne_400Regular,
//   'Custom-SemiBold': LilitaOne_400Regular,
//   'Custom-Bold': LilitaOne_400Regular,
// };

// ============================================
// OPTION 3: Baloo 2 (Soft & Friendly)
// ============================================
// import {
//   Baloo2_400Regular,
//   Baloo2_500Medium,
//   Baloo2_600SemiBold,
//   Baloo2_700Bold,
//   Baloo2_800ExtraBold,
// } from '@expo-google-fonts/baloo-2';
// 
// export const customFonts = {
//   'Custom-Light': Baloo2_400Regular,
//   'Custom-Regular': Baloo2_400Regular,
//   'Custom-Medium': Baloo2_500Medium,
//   'Custom-SemiBold': Baloo2_600SemiBold,
//   'Custom-Bold': Baloo2_700Bold,
// };

// ============================================
// OPTION 4: Chewy (Hand-drawn & Quirky)
// ============================================
// import { Chewy_400Regular } from '@expo-google-fonts/chewy';
// 
// export const customFonts = {
//   'Custom-Light': Chewy_400Regular,
//   'Custom-Regular': Chewy_400Regular,
//   'Custom-Medium': Chewy_400Regular,
//   'Custom-SemiBold': Chewy_400Regular,
//   'Custom-Bold': Chewy_400Regular,
// };

// Font family names to use in styles
export const fontFamily = {
  light: 'Custom-Light',
  regular: 'Custom-Regular',
  medium: 'Custom-Medium',
  semibold: 'Custom-SemiBold',
  bold: 'Custom-Bold',
};

// Font weights mapping
export const fontWeights = {
  '300': 'Custom-Light',
  '400': 'Custom-Regular',
  '500': 'Custom-Medium',
  '600': 'Custom-SemiBold',
  '700': 'Custom-Bold',
  regular: 'Custom-Regular',
  medium: 'Custom-Medium',
  semibold: 'Custom-SemiBold',
  bold: 'Custom-Bold',
} as const;

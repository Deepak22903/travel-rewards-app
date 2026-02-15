/**
 * Font Configuration
 * Using Fredoka (Rounded & Playful)
 */

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

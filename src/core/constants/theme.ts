/**
 * Design System - Theme Constants
 * Color palette and styling tokens for the Travel Rewards app
 */

export const colors = {
  // Backgrounds
  background: '#E8D4B8',       // Soft beige (target app)
  backgroundLight: '#FFF9F0',  // Card white
  
  // Cards & Borders
  card: '#FFF9F0',             // Off-white card background
  cardBorder: '#D4A574',       // Brown borders
  
  // Text
  textPrimary: '#6B3E26',      // Dark brown (target app)
  textSecondary: '#8B7355',    // Medium brown
  textLight: '#A69478',        // Light brown
  textHeader: '#2C3E50',       // Navy section headers
  
  // Accent & Actions
  accent: '#F5A623',           // Orange/gold
  buttonGreen: '#4CAF50',      // Share button
  buttonBlue: '#2196F3',       // Rate button
  header: '#D4A574',           // Header bar
  
  // Status
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FFA726',
  claimed: '#C8C8C8',          // Claimed/grayed state
  
  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

import { fontFamily } from './fonts';

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 48,
  },
  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  family: fontFamily,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
};

export const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

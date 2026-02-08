/**
 * Design System - Theme Constants
 * Color palette and styling tokens for the Travel Rewards app
 */

export const colors = {
  // Backgrounds
  background: '#F5E6D3',       // Warm beige
  backgroundLight: '#FDF8F3',  // Off-white
  
  // Cards & Borders
  card: '#FDF8F3',             // Off-white
  cardBorder: '#E8D4C4',       // Light brown
  
  // Text
  textPrimary: '#5D4E37',      // Dark brown
  textSecondary: '#8B7355',    // Medium brown
  textLight: '#A69478',        // Light brown
  
  // Accent & Actions
  accent: '#F5A623',           // Orange/gold
  buttonGreen: '#4CAF50',      // Share/rate buttons
  header: '#D4A574',           // Header bar
  
  // Status
  success: '#4CAF50',
  error: '#E53935',
  warning: '#FFA726',
  
  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

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

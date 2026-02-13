/**
 * NativeBase Theme Configuration
 * Extends NativeBase with custom Travel Rewards theme
 */

import { extendTheme } from 'native-base';

// Import existing theme constants for consistency
import { colors as customColors } from './theme';

export const nativeBaseTheme = extendTheme({
  colors: {
    // Map custom colors to NativeBase color scheme
    primary: {
      50: customColors.backgroundLight,   // #FDF8F3
      100: customColors.background,       // #F5E6D3
      200: customColors.cardBorder,       // #E8D4C4
      300: customColors.header,           // #D4A574
      400: '#C8935F',                     // Mid-tone
      500: customColors.textSecondary,    // #8B7355
      600: customColors.textPrimary,      // #5D4E37 (main)
      700: '#4A3E2D',
      800: '#362E22',
      900: '#2A2318',
    },
    accent: {
      50: '#FFF8E6',
      100: '#FFEFC2',
      200: '#FFE59E',
      300: '#FFDB7A',
      400: '#FFD156',
      500: customColors.accent,           // #F5A623 (main)
      600: '#E09519',
      700: '#CC840F',
      800: '#B87305',
      900: '#A46200',
    },
    success: {
      50: '#E8F5E9',
      100: '#C8E6C9',
      200: '#A5D6A7',
      300: '#81C784',
      400: '#66BB6A',
      500: customColors.success,          // #4CAF50 (main)
      600: '#43A047',
      700: '#388E3C',
      800: '#2E7D32',
      900: '#1B5E20',
    },
    error: {
      50: '#FFEBEE',
      100: '#FFCDD2',
      200: '#EF9A9A',
      300: '#E57373',
      400: '#EF5350',
      500: customColors.error,            // #E53935 (main)
      600: '#D32F2F',
      700: '#C62828',
      800: '#B71C1C',
      900: '#8B0000',
    },
    warning: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFAD33',
      500: customColors.warning,          // #FFA726 (main)
      600: '#FB8C00',
      700: '#F57C00',
      800: '#EF6C00',
      900: '#E65100',
    },
  },
  
  config: {
    // Use light mode by default
    initialColorMode: 'light',
    useSystemColorMode: false,
  },

  components: {
    Button: {
      baseStyle: {
        borderRadius: 'lg',
        _text: {
          fontWeight: 'semibold',
        },
      },
      defaultProps: {
        colorScheme: 'primary',
      },
      variants: {
        solid: (props: any) => {
          const { colorScheme } = props;
          if (colorScheme === 'success') {
            return {
              bg: 'success.500',
              _pressed: { bg: 'success.600' },
              _hover: { bg: 'success.600' },
            };
          }
          return {
            bg: 'accent.500',
            _pressed: { bg: 'accent.600' },
            _hover: { bg: 'accent.600' },
          };
        },
        outline: {
          borderColor: 'primary.200',
          _text: { color: 'primary.600' },
        },
      },
    },
    
    Card: {
      baseStyle: {
        bg: 'primary.50',
        borderColor: 'primary.200',
        borderWidth: 1,
        borderRadius: 'lg',
        shadow: 2,
      },
    },

    Heading: {
      baseStyle: {
        color: 'primary.600',
        fontWeight: 'bold',
      },
    },

    Text: {
      baseStyle: {
        color: 'primary.600',
      },
      defaultProps: {
        fontSize: 'md',
      },
    },

    Badge: {
      baseStyle: {
        borderRadius: 'md',
        px: 2,
        py: 1,
      },
      variants: {
        solid: (props: any) => {
          const { colorScheme } = props;
          return {
            bg: `${colorScheme}.500`,
            _text: { color: 'white', fontWeight: 'semibold', fontSize: 'xs' },
          };
        },
        subtle: (props: any) => {
          const { colorScheme } = props;
          return {
            bg: `${colorScheme}.100`,
            _text: { color: `${colorScheme}.800`, fontWeight: 'semibold', fontSize: 'xs' },
          };
        },
      },
    },

    Modal: {
      baseStyle: {
        _backdrop: {
          bg: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },

    Spinner: {
      defaultProps: {
        color: 'accent.500',
      },
    },
  },

  fontConfig: {
    // Use system fonts for now
    // Can be extended with custom fonts later
  },

  fonts: {
    heading: undefined,
    body: undefined,
    mono: undefined,
  },

  fontSizes: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
  },

  sizes: {
    // Custom sizes for consistency
    container: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

export type CustomTheme = typeof nativeBaseTheme;

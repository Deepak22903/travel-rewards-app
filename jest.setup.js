/**
 * Jest Setup
 * Global test configuration and mocks
 */

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock Expo Clipboard
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(() => Promise.resolve()),
  getStringAsync: jest.fn(() => Promise.resolve('')),
}));

// Mock React Navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
  };
});

// Mock Expo Notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  scheduleNotificationAsync: jest.fn(() => Promise.resolve('notification-id')),
  cancelScheduledNotificationAsync: jest.fn(() => Promise.resolve()),
  setNotificationChannelAsync: jest.fn(() => Promise.resolve()),
}));

// Mock React Native AdMob (commented out - not installed yet)
// jest.mock('react-native-google-mobile-ads', () => ({
//   BannerAd: 'BannerAd',
//   BannerAdSize: {
//     BANNER: 'BANNER',
//     FULL_BANNER: 'FULL_BANNER',
//     LARGE_BANNER: 'LARGE_BANNER',
//     MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
//   },
//   InterstitialAd: {
//     createForAdRequest: jest.fn(() => ({
//       addAdEventListener: jest.fn(() => jest.fn()),
//       load: jest.fn(),
//       show: jest.fn(),
//     })),
//   },
//   TestIds: {
//     BANNER: 'test-banner-id',
//     INTERSTITIAL: 'test-interstitial-id',
//   },
// }));

// Mock NativeBase useToast
jest.mock('native-base', () => {
  const actual = jest.requireActual('native-base');
  return {
    ...actual,
    useToast: () => ({
      show: jest.fn(),
      close: jest.fn(),
      closeAll: jest.fn(),
      isActive: jest.fn(() => false),
    }),
  };
});

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock global fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
);

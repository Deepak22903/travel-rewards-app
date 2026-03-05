/**
 * App Navigator
 * Stack navigation configuration for the app
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList } from '../core/types';
import { HomeScreen, RewardsScreen, SettingsScreen } from '../screens';
import { colors, typography } from '../core/constants/theme';
import { useNotifications } from '../core/notifications/useNotifications';
import { registerAndroidNotificationChannel } from '../core/notifications/permissions';
import {
  InAppNotificationBanner,
  InAppNotificationBannerHandle,
} from '../components/InAppNotificationBanner';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  const bannerRef = useRef<InAppNotificationBannerHandle>(null);

  // Stable callback: reads bannerRef at call-time so it never needs to be
  // recreated when the banner mounts/unmounts its imperative handle.
  const handleForegroundNotification = useCallback(
    (title: string, body: string, onPress: () => void) => {
      bannerRef.current?.show(title, body, onPress);
    },
    [],
  );

  // Setup notification listeners
  useNotifications(navigationRef, handleForegroundNotification);

  useEffect(() => {
    // Register Android notification channel on mount
    registerAndroidNotificationChannel();
  }, []);

  return (
    // SafeAreaProvider must wrap both NavigationContainer and the banner so
    // that useSafeAreaInsets() inside InAppNotificationBanner resolves the
    // correct top inset even though the banner sits outside NavigationContainer.
    <SafeAreaProvider>
      <View style={{ flex: 1 }}>
        <NavigationContainer ref={navigationRef}>
          <Stack.Navigator
            initialRouteName="Home"
            screenOptions={{
              headerStyle: {
                backgroundColor: colors.header,
              },
              headerTintColor: colors.white,
              headerTitleStyle: {
                fontWeight: '600',
                fontSize: typography.sizes.lg,
              },
              cardStyle: {
                backgroundColor: colors.background,
              },
            }}
          >
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Rewards"
              component={RewardsScreen}
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>

        {/* Overlaid above all screens; position:absolute inside the component */}
        <InAppNotificationBanner ref={bannerRef} />
      </View>
    </SafeAreaProvider>
  );
};

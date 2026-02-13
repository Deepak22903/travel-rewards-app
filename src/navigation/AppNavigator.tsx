/**
 * App Navigator
 * Stack navigation configuration for the app
 */

import React, { useRef, useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from '../core/types';
import { HomeScreen, RewardsScreen, SettingsScreen } from '../screens';
import { colors, typography } from '../core/constants/theme';
import { useNotifications } from '../core/notifications/useNotifications';
import { registerAndroidNotificationChannel } from '../core/notifications/permissions';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const navigationRef = useRef<NavigationContainerRef<RootStackParamList>>(null);
  
  // Setup notification listeners
  useNotifications(navigationRef);

  useEffect(() => {
    // Register Android notification channel on mount
    registerAndroidNotificationChannel();
  }, []);

  return (
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
  );
};

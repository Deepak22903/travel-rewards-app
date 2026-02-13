/**
 * App Root Component
 * Main entry point for the Travel Rewards application
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { NativeBaseProvider } from 'native-base';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components';
import { nativeBaseTheme } from './src/core/constants/nativeBaseTheme';

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <NativeBaseProvider theme={nativeBaseTheme}>
        <AppNavigator />
        <StatusBar style="light" />
      </NativeBaseProvider>
    </ErrorBoundary>
  );
}


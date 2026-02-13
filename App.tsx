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

// NativeBase requires initial window metrics for proper rendering
const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <NativeBaseProvider theme={nativeBaseTheme} initialWindowMetrics={inset}>
        <AppNavigator />
        <StatusBar style="light" />
      </NativeBaseProvider>
    </ErrorBoundary>
  );
}


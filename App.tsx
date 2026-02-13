/**
 * App Root Component
 * Main entry point for the Travel Rewards application
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ErrorBoundary } from './src/components';

export default function App(): React.JSX.Element {
  return (
    <ErrorBoundary>
      <AppNavigator />
      <StatusBar style="light" />
    </ErrorBoundary>
  );
}


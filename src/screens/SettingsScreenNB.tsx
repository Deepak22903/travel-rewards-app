/**
 * Settings Screen (NativeBase Version)
 * App settings and preferences
 */

import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Box,
  VStack,
  HStack,
  Text,
  Switch,
  Divider,
  Pressable,
  useToast,
  Center,
  Spinner,
} from 'native-base';
import { STORAGE_KEYS, SettingsState } from '../core/types';
import { APP_CONFIG } from '../core/constants/config';
import { logStorageError } from '../core/utils/errorLogger';

const DEFAULT_SETTINGS: SettingsState = {
  notificationsEnabled: true,
};

export const SettingsScreenNB: React.FC = () => {
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const loadSettings = useCallback(async (): Promise<void> => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
      }
    } catch (error) {
      logStorageError(error, 'read', STORAGE_KEYS.SETTINGS);
      toast.show({
        description: 'Unable to load settings',
        placement: 'top',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const saveSettings = useCallback(async (newSettings: SettingsState): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
      setSettings(newSettings);
      
      toast.show({
        description: '✓ Settings saved',
        placement: 'top',
        duration: 1500,
      });
    } catch (error) {
      logStorageError(error, 'write', STORAGE_KEYS.SETTINGS);
      toast.show({
        description: 'Unable to save settings',
        placement: 'top',
        status: 'error',
      });
    }
  }, [toast]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleToggleNotifications = useCallback((value: boolean): void => {
    const newSettings = { ...settings, notificationsEnabled: value };
    saveSettings(newSettings);
  }, [settings, saveSettings]);

  if (loading) {
    return (
      <Center flex={1} bg="primary.100">
        <Spinner size="lg" color="accent.500" />
      </Center>
    );
  }

  return (
    <Box flex={1} bg="primary.100" safeArea>
      <VStack space={0} flex={1}>
        {/* Header */}
        <Box px={6} py={4} bg="primary.50">
          <Text fontSize="2xl" fontWeight="bold" color="primary.800">
            Settings
          </Text>
        </Box>

        {/* Settings List */}
        <VStack space={0} flex={1}>
          {/* Notifications Section */}
          <Box px={6} py={4}>
            <Text fontSize="xs" fontWeight="semibold" color="primary.500" textTransform="uppercase" mb={2}>
              Notifications
            </Text>
            
            <Pressable>
              <HStack
                bg="primary.50"
                p={4}
                borderRadius="lg"
                alignItems="center"
                justifyContent="space-between"
                shadow={1}
              >
                <VStack flex={1} mr={4}>
                  <Text fontWeight="semibold" color="primary.800" fontSize="md">
                    Push Notifications
                  </Text>
                  <Text fontSize="sm" color="primary.500" mt={1}>
                    Get notified when new rewards are available
                  </Text>
                </VStack>
                
                <Switch
                  isChecked={settings.notificationsEnabled}
                  onToggle={handleToggleNotifications}
                  colorScheme="success"
                  size="md"
                  accessibilityLabel="Toggle push notifications"
                />
              </HStack>
            </Pressable>
          </Box>

          <Divider my={4} />

          {/* App Info Section */}
          <Box px={6} py={4}>
            <Text fontSize="xs" fontWeight="semibold" color="primary.500" textTransform="uppercase" mb={2}>
              About
            </Text>
            
            <VStack space={3}>
              {/* App Version */}
              <HStack
                bg="primary.50"
                p={4}
                borderRadius="lg"
                alignItems="center"
                justifyContent="space-between"
                shadow={1}
              >
                <Text fontWeight="semibold" color="primary.800" fontSize="md">
                  App Version
                </Text>
                <Text fontSize="sm" color="primary.500">
                  {APP_CONFIG.VERSION}
                </Text>
              </HStack>

              {/* App Name */}
              <HStack
                bg="primary.50"
                p={4}
                borderRadius="lg"
                alignItems="center"
                justifyContent="space-between"
                shadow={1}
              >
                <Text fontWeight="semibold" color="primary.800" fontSize="md">
                  App Name
                </Text>
                <Text fontSize="sm" color="primary.500">
                  {APP_CONFIG.APP_NAME}
                </Text>
              </HStack>
            </VStack>
          </Box>

          {/* Footer Note */}
          <Box px={6} py={4} mt="auto">
            <Text fontSize="xs" color="primary.400" textAlign="center" lineHeight="sm">
              Settings are automatically saved.{'\n'}
              Changes take effect immediately.
            </Text>
          </Box>
        </VStack>
      </VStack>
    </Box>
  );
};

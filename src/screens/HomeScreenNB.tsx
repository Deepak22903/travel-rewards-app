/**
 * Home Screen (NativeBase Version)
 * Landing page with logo, navigation, and action buttons
 */

import React, { useEffect } from 'react';
import { Platform, Linking, Share as RNShare } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  Box,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  IconButton,
  Center,
  useToast,
} from 'native-base';
import { RootStackParamList } from '../core/types';
import { ENV, APP_CONFIG } from '../core/constants/config';
import { useInterstitialAd } from '../core/ads/useInterstitialAd';
import { shouldShowInterstitial } from '../core/ads/adConfig';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreenNB: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isLoaded: adLoaded, show: showInterstitial } = useInterstitialAd();
  const toast = useToast();

  useEffect(() => {
    // Show interstitial ad on app launch if conditions are met
    const checkAndShowAd = async () => {
      if (adLoaded && await shouldShowInterstitial()) {
        showInterstitial();
      }
    };
    checkAndShowAd();
  }, [adLoaded, showInterstitial]);

  const handleShare = async (): Promise<void> => {
    try {
      const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
      await RNShare.share({
        message: `${APP_CONFIG.SHARE_MESSAGE}\n\n${storeUrl}`,
        title: APP_CONFIG.APP_NAME,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      toast.show({
        description: 'Unable to share',
        placement: 'top',
      });
    }
  };

  const handleRate = (): void => {
    const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
    Linking.openURL(storeUrl).catch(err => {
      console.error('Error opening store:', err);
      toast.show({
        description: 'Unable to open app store',
        placement: 'top',
      });
    });
  };

  return (
    <Box flex={1} bg="primary.100" safeArea>
      {/* Settings Icon */}
      <Box position="absolute" top={4} right={4} zIndex={10}>
        <IconButton
          onPress={() => navigation.navigate('Settings')}
          icon={<Text fontSize="2xl">⚙️</Text>}
          bg="primary.50"
          borderRadius="full"
          shadow={2}
          _pressed={{ bg: 'primary.200' }}
          accessibilityLabel="Settings"
          accessibilityHint="Open app settings"
        />
      </Box>

      {/* Center Content */}
      <Center flex={1} px={6}>
        <VStack space={6} alignItems="center" w="100%">
          {/* Logo Section */}
          <VStack space={1} alignItems="center">
            <Heading
              size="3xl"
              color="primary.600"
              fontWeight="bold"
            >
              Travel
            </Heading>
            <Heading
              size="3xl"
              color="accent.500"
              fontWeight="bold"
              mt={-2}
            >
              Rewards
            </Heading>
          </VStack>

          {/* Subtitle */}
          <Text
            fontSize="lg"
            color="primary.500"
            fontWeight="medium"
            textAlign="center"
          >
            Daily Game Rewards
          </Text>

          {/* View Rewards Button */}
          <Button
            onPress={() => navigation.navigate('Rewards')}
            colorScheme="success"
            size="lg"
            w="100%"
            maxW="400px"
            leftIcon={<Text fontSize="2xl">⚡</Text>}
            shadow={3}
            _pressed={{ bg: 'success.600' }}
          >
            View Rewards
          </Button>
        </VStack>
      </Center>

      {/* Bottom Buttons */}
      <Box px={6} pb={8}>
        <HStack space={4} justifyContent="center" w="100%" maxW="400px" mx="auto">
          <Button
            onPress={handleShare}
            variant="outline"
            flex={1}
            leftIcon={<Text fontSize="xl">📤</Text>}
            _text={{ color: 'primary.600', fontWeight: 'semibold' }}
            borderColor="primary.200"
            bg="primary.50"
            _pressed={{ bg: 'primary.200' }}
          >
            Share App
          </Button>

          <Button
            onPress={handleRate}
            variant="outline"
            flex={1}
            leftIcon={<Text fontSize="xl">⭐</Text>}
            _text={{ color: 'primary.600', fontWeight: 'semibold' }}
            borderColor="primary.200"
            bg="primary.50"
            _pressed={{ bg: 'primary.200' }}
          >
            Rate Us
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

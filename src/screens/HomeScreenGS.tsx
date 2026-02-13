/**
 * Home Screen (Gluestack-UI Version)
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
  ButtonText,
  Center,
  Pressable,
} from '@gluestack-ui/themed';
import { RootStackParamList } from '../core/types';
import { ENV, APP_CONFIG } from '../core/constants/config';
import { useInterstitialAd } from '../core/ads/useInterstitialAd';
import { shouldShowInterstitial } from '../core/ads/adConfig';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreenGS: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { isLoaded: adLoaded, show: showInterstitial } = useInterstitialAd();

  useEffect(() => {
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
    }
  };

  const handleRate = (): void => {
    const storeUrl = Platform.OS === 'ios' ? ENV.APP_STORE_URL : ENV.PLAY_STORE_URL;
    Linking.openURL(storeUrl).catch(err => {
      console.error('Error opening store:', err);
    });
  };

  return (
    <Box flex={1} bg="#F5E6D3">
      {/* Settings Icon */}
      <Box position="absolute" top="$4" right="$4" zIndex={10}>
        <Pressable
          onPress={() => navigation.navigate('Settings')}
          bg="#FDF8F3"
          borderRadius="$full"
          p="$3"
          sx={{
            ':active': { bg: '#E8D4C4' },
          }}
        >
          <Text fontSize="$2xl">⚙️</Text>
        </Pressable>
      </Box>

      {/* Center Content */}
      <Center flex={1} px="$6">
        <VStack space="xl" alignItems="center" w="$full">
          {/* Logo Section */}
          <VStack space="xs" alignItems="center">
            <Heading size="4xl" color="#5D4E37" fontWeight="$bold">
              Travel
            </Heading>
            <Heading size="4xl" color="#F5A623" fontWeight="$bold">
              Rewards
            </Heading>
          </VStack>

          {/* Subtitle */}
          <Text fontSize="$lg" color="#8B7355" fontWeight="$medium">
            Daily Game Rewards
          </Text>

          {/* View Rewards Button */}
          <Button
            onPress={() => navigation.navigate('Rewards')}
            bg="#4CAF50"
            size="lg"
            w="$full"
            maxWidth={400}
            sx={{
              ':active': { bg: '#43A047' },
            }}
          >
            <HStack space="sm" alignItems="center">
              <Text fontSize="$2xl">⚡</Text>
              <ButtonText color="white" fontSize="$md" fontWeight="$semibold">
                View Rewards
              </ButtonText>
            </HStack>
          </Button>
        </VStack>
      </Center>

      {/* Bottom Buttons */}
      <Box px="$6" pb="$8">
        <HStack space="md" justifyContent="center" w="$full" maxWidth={400} mx="auto">
          <Button
            onPress={handleShare}
            variant="outline"
            flex={1}
            borderColor="#E8D4C4"
            bg="#FDF8F3"
            sx={{
              ':active': { bg: '#E8D4C4' },
            }}
          >
            <HStack space="sm" alignItems="center">
              <Text fontSize="$xl">📤</Text>
              <ButtonText color="#5D4E37" fontSize="$sm" fontWeight="$semibold">
                Share
              </ButtonText>
            </HStack>
          </Button>

          <Button
            onPress={handleRate}
            variant="outline"
            flex={1}
            borderColor="#E8D4C4"
            bg="#FDF8F3"
            sx={{
              ':active': { bg: '#E8D4C4' },
            }}
          >
            <HStack space="sm" alignItems="center">
              <Text fontSize="$xl">⭐</Text>
              <ButtonText color="#5D4E37" fontSize="$sm" fontWeight="$semibold">
                Rate
              </ButtonText>
            </HStack>
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

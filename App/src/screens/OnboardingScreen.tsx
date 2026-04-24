import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

// Simple colored placeholder if you don't have assets yet
const SlideImage = ({ emoji }: { emoji: string }) => (
  <View style={styles.emojiContainer}>
    <Text style={styles.emoji}>{emoji}</Text>
  </View>
);

const SLIDES = [
  {
    backgroundColor: '#EAF4FF',
    image: <SlideImage emoji="👋" />,
    title: 'Welcome',
    subtitle: 'Your personal health & nutrition companion — built just for you.',
  },
  {
    backgroundColor: '#F0FFF4',
    image: <SlideImage emoji="📷" />,
    title: 'Scan Products',
    subtitle: 'Instantly get full nutrition info by scanning any product barcode.',
  },
  {
    backgroundColor: '#F5F0FF',
    image: <SlideImage emoji="🤖" />,
    title: 'AI Nutritionist',
    subtitle: 'Get personalized dietary advice and answers powered by AI.',
  },
  {
    backgroundColor: '#FFF8F0',
    image: <SlideImage emoji="🥗" />,
    title: 'Meal Planner',
    subtitle: 'Plan balanced, goal-aligned meals with ease.',
  },
];

export default function OnboardingScreen() {
  const navigation = useNavigation<Nav>();

  const handleFinish = async () => {
    await AsyncStorage.setItem('onboardingDone', 'true');
    navigation.replace('GetStarted');
  };

  return (
    <Onboarding
      pages={SLIDES}
      onDone={handleFinish}
      onSkip={handleFinish}
      showSkip={true}
    />
  );
}

const styles = StyleSheet.create({
  emojiContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
  },
});
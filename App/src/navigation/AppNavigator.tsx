import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import GetStarted from '../Auth/GetStarted';
import LoginScreen from '../Auth/LoginScreen';
import SignupScreen from '../Auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import BottomTabs from './BottomTabs';

import ProfileDetails from '../screens/ProfileDetails';
import ProfileScreen from '../screens/ProfileScreen';

import ConsumptionPlanner from '../screens/ConsumptionPlanner';
import HealthTips from '../screens/HealthTips';
import ProductDetails from '../screens/ProductDetails';
import AIScreen from '../screens/AIScreen';
import ProfileForm from '../screens/ProfileForm';
import Scanner from '../screens/Scanner';
import RecipeScreen from '../screens/RecipeScreen';

import ForgotPasswordScreen from '../screens/ForgetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

import OnboardingScreen from '../screens/OnboardingScreen';

import ProgressScreen from '../screens/ProgressScreen';

export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  MainApp: undefined;

  ProfileDetails: { id?: string } | undefined;
  ProfileScreen: undefined;

  ConsumptionPlanner: undefined;
  HealthTips: undefined;
  ProductDetails: { code?: string } | undefined;

  AIScreen: undefined;
  AI: undefined;

  ProfileForm: undefined;
  Scanner: undefined;

  RecipeScreen: undefined;

  ForgotPassword: undefined;
  ChangePasswordScreen: undefined;

   Onboarding: undefined;

   Progress: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator({
  initialRoute,
}: {
  initialRoute: string;
}) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute as any}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />

      <Stack.Screen name="AIScreen" component={AIScreen} />
      <Stack.Screen name="AI" component={AIScreen} />

      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />

      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="MainApp" component={BottomTabs} />

      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

      <Stack.Screen name="ConsumptionPlanner" component={ConsumptionPlanner} />
      <Stack.Screen name="HealthTips" component={HealthTips} />

      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="ProfileForm" component={ProfileForm} />
      <Stack.Screen name="Scanner" component={Scanner} />

      <Stack.Screen name="RecipeScreen" component={RecipeScreen} />

      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />

      <Stack.Screen name="Progress" component={ProgressScreen} />
    </Stack.Navigator>
  );
}
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GetStarted from '../Auth/GetStarted';
import LoginScreen from '../Auth/LoginScreen';
import SignupScreen from '../Auth/SignupScreen';
import HomeScreen from '../screens/HomeScreen';
import BottomTabs from './BottomTabs';
import ProfileDetails from '../screens/ProfileDetails';
import ConsumptionPlanner from '../screens/ConsumptionPlanner';
import HealthTips from '../screens/HealthTips';
import ProductDetails from '../screens/ProductDetails';
import AIScreen from '../screens/AIScreen';
import ProfileForm from '../screens/ProfileForm';
import ProfileScreen from '../screens/ProfileDetails';
import Scanner from '../screens/Scanner';
import ForgotPasswordScreen from '../Auth/ForgetPasswordScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';

export type RootStackParamList = {
  GetStarted: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  MainApp: undefined;
  ProfileDetails: undefined;
  ConsumptionPlanner: undefined;
  HealthTips: undefined;
  ProductDetails: undefined;
  AIScreen: undefined;
  ProfileForm: undefined;
  ProfileScreen: undefined;
  Scanner: undefined;
  ForgotPassword: undefined;
  ChangePasswordScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GetStarted" component={GetStarted} />
      <Stack.Screen name="AIScreen" component={AIScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetails} />
      <Stack.Screen name="MainApp" component={BottomTabs} />
      <Stack.Screen name="ConsumptionPlanner" component={ConsumptionPlanner} />
      <Stack.Screen name="HealthTips" component={HealthTips} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="ProfileForm" component={ProfileForm} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="Scanner" component={Scanner} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
      />
    </Stack.Navigator>
  );
}

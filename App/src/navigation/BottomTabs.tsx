import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AIScreen from '../screens/AIScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScanScreen from '../screens/ScanScreen';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 75,
        },
      }}
    >
      {/* Home Tab */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: '#1e90ff',
            paddingTop: 2,
          },
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/homeIcon.png')}
              style={{ width: 26, height: 26, tintColor: '#1e90ff' }}
            />
          ),
        }}
      />

      {/* Scan Tab */}
      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Scan',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: '#1e90ff',
            paddingTop: 2,
          },
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/scanIcon.png')}
              style={{ width: 26, height: 26, tintColor: '#1e90ff' }}
            />
          ),
        }}
      />

      {/* AI Tab */}
      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'AI',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: '#1e90ff',
            paddingTop: 2,
          },
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/robotLogo.png')}
              style={{ width: 40, height: 40 }}
            />
          ),
        }}
      />

      {/* Profile Tab */}
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            color: '#1e90ff',
            paddingTop: 2,
          },
          tabBarIcon: () => (
            <Image
              source={require('../assets/icons/profileIcon.png')}
              style={{ width: 26, height: 26, tintColor: '#1e90ff' }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

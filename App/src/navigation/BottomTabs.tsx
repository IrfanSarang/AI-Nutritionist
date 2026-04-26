import React from 'react';
import { Image, View } from 'react-native';
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
        headerShown: false,
        tabBarStyle: { height: 70 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Image
                source={require('../assets/icons/homeIcon.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: '#1e90ff',
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Scan"
        component={ScanScreen}
        options={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 10,
              }}
            >
              <Image
                source={require('../assets/icons/scanIcon.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: '#1e90ff',
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AI"
        component={AIScreen}
        options={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                padding: 8,
                borderRadius: 12,
              }}
            >
              <Image
                source={require('../assets/icons/robotLogo.png')}
                style={{
                  width: 36,
                  height: 36,
                }}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                padding: 6,
                borderRadius: 10,
              }}
            >
              <Image
                source={require('../assets/icons/profileIcon.png')}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: '#1e90ff',
                }}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;

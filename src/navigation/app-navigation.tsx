import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList, MainTabParamList } from './types';
import { Colors } from '../constants';

// Screens
import {
  HomeScreen,
  MoviesScreen,
  TVShowsScreen,
  ProfileScreen,
  MovieDetailScreen,
  WatchMovieScreen,
  SearchScreen,
} from '../screens';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Custom Tab Icon with Netflix Style
const TabIcon = ({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) => {
  return (
    <View style={styles.iconWrapper}>
      <Ionicons 
        name={name} 
        size={focused ? 28 : 24} 
        color={color}
        style={{ 
          marginBottom: focused ? 2 : 0,
        }} 
      />
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: Colors.background,
          borderTopWidth: 1,
          borderTopColor: 'rgba(255, 255, 255, 0.1)',
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8,
          paddingTop: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.5,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#737373',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: -2,
          letterSpacing: 0.3,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Movies',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "film" : "film-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TVShows"
        component={TVShowsScreen}
        options={{
          tabBarLabel: 'TV Shows',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "tv" : "tv-outline"} color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'My Netflix',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} color={color} focused={focused} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.secondary,
          },
          headerTintColor: Colors.text,
          headerShadowVisible: false,
          animation: 'slide_from_right',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={MainTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MovieDetail"
          component={MovieDetailScreen}
          options={{ title: 'Chi tiết phim' }}
        />
        <Stack.Screen
          name="WatchMovie"
          component={WatchMovieScreen}
          options={{ 
            title: 'Xem phim',
            headerShown: true,
            animation: 'fade_from_bottom',
          }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{ title: 'Tìm kiếm' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  activeIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginTop: 4,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

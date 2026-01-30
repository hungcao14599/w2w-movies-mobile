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

// Custom Tab Icon with Gradient
const TabIcon = ({ name, color, focused }: { name: keyof typeof Ionicons.glyphMap; color: string; focused: boolean }) => {
  if (focused) {
    return (
      <View style={styles.activeIconContainer}>
        <LinearGradient
          colors={['rgba(229, 9, 20, 0.2)', 'transparent']}
          style={styles.iconGlow}
        >
          <Ionicons name={name} size={26} color={color} />
        </LinearGradient>
      </View>
    );
  }
  return <Ionicons name={name} size={24} color={color} />;
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
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: 75,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          paddingTop: 10,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[Colors.menuBg, Colors.bgGradient1]}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.tabBarBorder} />
          </LinearGradient>
        ),
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: '#808080',
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginTop: 4,
          letterSpacing: 0.5,
        },
        tabBarIconStyle: {
          marginTop: 5,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Trang chủ',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Movies"
        component={MoviesScreen}
        options={{
          tabBarLabel: 'Phim lẻ',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="film" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="TVShows"
        component={TVShowsScreen}
        options={{
          tabBarLabel: 'Phim bộ',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="tv" color={color} focused={focused} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon name="person" color={color} focused={focused} />
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
  tabBarBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.menuBorder,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  activeIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGlow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

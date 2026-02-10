import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  Easing,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Sound bars animations
  const bar1Anim = useRef(new Animated.Value(0.5)).current;
  const bar2Anim = useRef(new Animated.Value(0.7)).current;
  const bar3Anim = useRef(new Animated.Value(0.6)).current;
  const bar4Anim = useRef(new Animated.Value(0.8)).current;
  const bar5Anim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Pulse animation for the glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sound bars animation
    const animateSoundBar = (anim: Animated.Value, delay: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 400,
            easing: Easing.ease,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    animateSoundBar(bar1Anim, 0);
    animateSoundBar(bar2Anim, 100);
    animateSoundBar(bar3Anim, 200);
    animateSoundBar(bar4Anim, 300);
    animateSoundBar(bar5Anim, 400);

    // Main animation sequence - Netflix style
    Animated.sequence([
      // Quick fade in background
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      // Dramatic logo entrance with glow
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 15,
          friction: 4,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
      // Hold and let it breathe
      Animated.delay(1200),
      // Quick fade out like Netflix
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      onFinish();
    });
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Pure Black Background - Netflix Style */}
      <View style={styles.blackBackground} />

      {/* Animated Red Glow - Netflix Effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            opacity: glowAnim,
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            'rgba(229, 9, 20, 0.3)',
            'rgba(229, 9, 20, 0.15)',
            'rgba(229, 9, 20, 0)',
          ]}
          style={styles.redGlow}
        />
      </Animated.View>

      {/* Main Logo Container */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Giant "K" - Text Only, No Background, No Glow */}
        <Text style={styles.letterK}>K</Text>

        {/* Brand Text Below */}
        <View style={styles.brandContainer}>
          <Text style={styles.brandName}>W2W MOVIES</Text>
          <View style={styles.brandUnderline} />
        </View>
      </Animated.View>

      {/* Netflix-style Sound Wave Animation */}
      <Animated.View
        style={[
          styles.soundWaveContainer,
          {
            opacity: logoOpacity,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.soundBar,
            styles.soundBar1,
            { height: bar1Anim.interpolate({ inputRange: [0, 1], outputRange: [15, 35] }) },
          ]}
        />
        <Animated.View
          style={[
            styles.soundBar,
            styles.soundBar2,
            { height: bar2Anim.interpolate({ inputRange: [0, 1], outputRange: [20, 40] }) },
          ]}
        />
        <Animated.View
          style={[
            styles.soundBar,
            styles.soundBar3,
            { height: bar3Anim.interpolate({ inputRange: [0, 1], outputRange: [18, 38] }) },
          ]}
        />
        <Animated.View
          style={[
            styles.soundBar,
            styles.soundBar4,
            { height: bar4Anim.interpolate({ inputRange: [0, 1], outputRange: [22, 42] }) },
          ]}
        />
        <Animated.View
          style={[
            styles.soundBar,
            styles.soundBar5,
            { height: bar5Anim.interpolate({ inputRange: [0, 1], outputRange: [12, 30] }) },
          ]}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  blackBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  glowContainer: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redGlow: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.75,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40,
  },
  letterK: {
    fontSize: 180,
    fontWeight: '900',
    color: Colors.primary, // Netflix red #E50914
    letterSpacing: -5,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 8 },
    textShadowRadius: 20,
    includeFontPadding: false,
    textAlign: 'center',
  },
  brandContainer: {
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 8,
    textShadowColor: 'rgba(229, 9, 20, 0.8)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  brandUnderline: {
    width: 120,
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 8,
  },
  soundWaveContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
    height: 50,
  },
  soundBar: {
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  soundBar1: {},
  soundBar2: {},
  soundBar3: {},
  soundBar4: {},
  soundBar5: {},
});

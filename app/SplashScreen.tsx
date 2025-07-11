import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function SplashScreenPage() {
  useEffect(() => {
    // TUNGGU 2.5 DETIK LALU SEMBUNYIKAN SPLASH EXPO
    const timer = setTimeout(async () => {
      await SplashScreen.hideAsync(); // Sembunyikan splash bawaan Expo
      router.replace('/(tabs)'); // Navigasi ke Home
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#0f0f0f', '#1a1a1a', '#121212']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.logoWrapper}>
        <Image
          source={require('../assets/logo.png')}
          style={styles.logo}
          resizeMode="cover"
        />
      </View>

      <Text style={styles.title}>MovieFinder</Text>
      <Text style={styles.tagline}>Temukan Film Favoritmu dengan Mudah</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    backgroundColor: '#1f1f1f',
    borderRadius: 100,
    padding: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    marginBottom: 30,
  },
  logo: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
});

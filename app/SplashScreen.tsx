import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('../(tabs)');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#000000', '#1a1a1a']} style={styles.container}>
      <Image
        source={require('../assets/Cinema_XXI.jpg')}
        style={styles.logo}
        resizeMode="cover"
      />
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
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
    marginBottom: 30,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 10,
  },
});

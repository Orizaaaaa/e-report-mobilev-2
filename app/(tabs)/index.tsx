
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  StyleSheet,
  Text,
  View
} from 'react-native';

// 🚫 Mencegah splash screen tertutup otomatis
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const init = async () => {
      try {
        // 🔄 Jalankan animasi fade-in logo
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }).start();

        // ⏳ Simulasi loading tambahan
        await new Promise(resolve => setTimeout(resolve, 1500));

        const user = await AsyncStorage.getItem('user');
        const parsed = user ? JSON.parse(user) : null;

        // ✅ Sembunyikan splash screen
        await SplashScreen.hideAsync();

        // 🔁 Arahkan ke halaman sesuai role
        if (parsed?.role === 'admin') {
          router.replace('/admin');
        } else if (parsed?.role === 'user') {
          router.replace('/home');
        } else {
          router.replace('/login');
        }

        setReady(true);
      } catch (err) {
        console.error('❌ Error saat init:', err);
        await SplashScreen.hideAsync();
        router.replace('/login');
      }
    };

    init();
  }, []);

  if (!ready) {
    return (
      <View style={styles.container}>
        <Text>KAFIR APP</Text>
        <ActivityIndicator size="large" color="#FF840C" />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E2A38',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
});
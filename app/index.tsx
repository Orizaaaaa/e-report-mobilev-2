import { db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Easing,
  StyleSheet,
  View
} from 'react-native';

// 🚫 Mencegah splash screen tertutup otomatis
SplashScreen.preventAutoHideAsync();

// 🛠️ Konfigurasi notifikasi
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: true,
  }),
});

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

        // 🔔 Register push notification
        const token = await registerForPushNotificationsAsync();
        if (token) {
          const userData = await AsyncStorage.getItem('user');
          const parsed = userData ? JSON.parse(userData) : null;
          const role = parsed?.role || 'user';
          await saveTokenToFirestore(token, role);
        }

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
          router.replace('/user');
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
        <Animated.Image
          source={require('../assets/images/splash-icon.png')} // ganti dengan path logo kamu
          style={[styles.logo, { opacity: logoOpacity }]}
          resizeMode="contain"
        />
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
  text: {
    fontSize: 16,
    color: '#333',
  },
});

const registerForPushNotificationsAsync = async () => {
  if (!Device.isDevice) {
    Alert.alert('Gunakan perangkat fisik untuk menerima notifikasi');
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    Alert.alert('Izin notifikasi ditolak');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  console.log('📱 Expo Push Token:', tokenData.data);
  return tokenData.data;
};

const saveTokenToFirestore = async (token: string, role: 'admin' | 'user') => {
  try {
    await setDoc(doc(db, 'users', `${role}-token`), { token, role });
    console.log(`✅ Token ${role} disimpan`);
  } catch (err) {
    console.error('❌ Gagal menyimpan token:', err);
  }
};

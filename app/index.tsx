import { db } from '@/lib/firebase/firebase';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { Alert, Text, View } from 'react-native';


const Index = () => {

  // INI SEBAIK NYA DI PINDAH KAN KE HALAMAN INDEX KARENA UNTUK PUSH NOTIF NYA
  Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true, // kita akan tampilkan manual
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: false,
      shouldShowList: true,
    }),
  });

  useEffect(() => {
    // Dapatkan token dan simpan
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        saveTokenToFirestore(token, 'user'); // Ganti ke 'admin' jika perlu
      }
    });
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (!Device.isDevice) {
      Alert.alert('Gunakan perangkat fisik');
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


  return (
    <View >
      <Text>hallo</Text>
    </View>
  );
};


export default Index;

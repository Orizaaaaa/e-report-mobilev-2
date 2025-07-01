import { db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

// Notifikasi di foreground akan ditangani manual
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: false, // kita akan tampilkan manual
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: false,
    shouldShowList: true,
  }),
});

const Index = () => {
  const [notifContent, setNotifContent] = useState<{ title?: string; body?: string }>({});

  useEffect(() => {
    // Dapatkan token dan simpan
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        saveTokenToFirestore(token, 'user'); // Ganti ke 'admin' jika perlu
      }
    });

    // Saat notifikasi diterima dalam kondisi app aktif
    const foregroundListener = Notifications.addNotificationReceivedListener(notification => {
      const { title, body }: any = notification.request.content;
      Alert.alert(title || 'Notifikasi', body || '');
      setNotifContent({ title, body });
    });

    // Saat user klik notifikasi (dari tray)
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      const { title, body }: any = response.notification.request.content;
      Alert.alert('Notifikasi Diketuk', `${title}\n${body}`);
      setNotifContent({ title, body });
    });

    return () => {
      foregroundListener.remove();
      responseListener.remove();
    };
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

  const sendNotificationToRole = async (targetRole: 'admin' | 'user') => {
    try {
      // Ambil data user login dari AsyncStorage
      const userStr = await AsyncStorage.getItem('user');
      const currentUser = userStr ? JSON.parse(userStr) : null;

      if (!currentUser) {
        Alert.alert('User belum login');
        return;
      }

      const snapshot = await getDocs(collection(db, 'users'));
      let targetToken = '';

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.role === targetRole) {
          targetToken = data.token;
        }
      });

      if (!targetToken) {
        Alert.alert(`Token ${targetRole} tidak ditemukan`);
        return;
      }

      // Buat sapaan sesuai role
      const greeting =
        targetRole === 'admin'
          ? 'Halo admin'
          : `Halo ${currentUser.name || currentUser.email || 'pengguna'}`;

      const message = {
        to: targetToken,
        sound: 'default',
        title: greeting,
        body: `Notifikasi dikirim oleh ${currentUser.email} pada ${new Date().toLocaleTimeString()}`,
        priority: 'high',
        data: { clicked: true },
      };

      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      Alert.alert(`📤 Notifikasi berhasil dikirim ke ${targetRole}`);
    } catch (err) {
      console.error('❌ Gagal mengirim notifikasi:', err);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>📲 Notifikasi Real-Time via FCM</Text>

      <Button title="🔔 Kirim ke Admin" onPress={() => sendNotificationToRole('admin')} />
      <View style={{ height: 12 }} />
      <Button title="🔔 Kirim ke User" onPress={() => sendNotificationToRole('user')} />

      {notifContent.title && (
        <View style={styles.notifBox}>
          <Text style={styles.notifTitle}>📬 Notifikasi Masuk</Text>
          <Text style={styles.notifText}>{notifContent.title}</Text>
          <Text style={styles.notifText}>{notifContent.body}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
  notifBox: {
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  notifTitle: { fontWeight: 'bold', fontSize: 16 },
  notifText: { fontSize: 14 },
});

export default Index;

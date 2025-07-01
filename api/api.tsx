import { db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, getDocs } from 'firebase/firestore';
import { Alert } from 'react-native';

export const sendNotificationToRole =
    async (targetRole: 'admin' | 'user', messageNotif: string) => {
        // jadi ini di buat kan text pada saat msau kirim notifikasi
        try {
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

            const greeting =
                targetRole === 'admin'
                    ? 'Halo admin'
                    : `Halo ${currentUser.name || currentUser.email || 'pengguna'}`;

            const message = {
                to: targetToken,
                sound: 'default',
                title: greeting,
                body: `${messageNotif} ${currentUser.email} pada ${new Date().toLocaleTimeString()}`,
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

            // Alert.alert(`📤 Notifikasi berhasil dikirim ke ${targetRole}`);
        } catch (err) {
            console.error('❌ Gagal mengirim notifikasi:', err);
        }
    };

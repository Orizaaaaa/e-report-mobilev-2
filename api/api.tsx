import { db, storage } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Alert } from 'react-native';

export const sendNotificationToRole =
    async (targetRole: 'admin' | 'user', messageNotif: string) => {

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
                    : `Halo`;

            const message = {
                to: targetToken,
                sound: 'default',
                title: greeting,
                body: `${messageNotif} pada ${new Date().toLocaleTimeString()}`,
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

export const sendNotificationToUid = async (targetUid: string, messageNotif: string) => {
    try {
        const userStr = await AsyncStorage.getItem('user');
        const currentUser = userStr ? JSON.parse(userStr) : null;

        if (!currentUser) {
            Alert.alert('User belum login');
            return;
        }

        const userDoc = await getDoc(doc(db, 'users', targetUid));
        if (!userDoc.exists()) {
            Alert.alert('User dengan UID tersebut tidak ditemukan');
            return;
        }

        const targetData = userDoc.data();
        const targetToken = targetData.token;

        if (!targetToken) {
            Alert.alert('Token user tidak ditemukan');
            return;
        }

        const message = {
            to: targetToken,
            sound: 'default',
            title: `Halo ${targetData.name || 'pengguna'}`,
            body: `${messageNotif} pada ${new Date().toLocaleTimeString()}`,
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

        // Alert.alert('📤 Notifikasi berhasil dikirim');
    } catch (err) {
        console.error('❌ Gagal mengirim notifikasi:', err);
    }
};

export const uploadImagesToStorage = async (images: string[], uid: string): Promise<string[]> => {
    const urls: string[] = [];

    for (const image of images) {
        const filename = `${uid}_${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
        const imageRef = ref(storage, `reports/${filename}`);

        const response = await fetch(image);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);
        urls.push(url);
    }

    return urls;
};

export const uploadOneImageToStorage = async (imageUri: string, uid: string, folderStorage = 'reports'): Promise<string> => {
    try {
        const filename = `${uid}_${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`;
        const imageRef = ref(storage, `${folderStorage}/${filename}`);

        const response = await fetch(imageUri);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);
        const url = await getDownloadURL(imageRef);

        return url;
    } catch (error) {
        console.error('❌ Gagal upload gambar:', error);
        throw error;
    }
};
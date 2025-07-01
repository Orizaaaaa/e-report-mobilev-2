import { auth, db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import {
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';

// ✅ Fungsi ambil token notifikasi
const registerForPushNotificationsAsync = async (): Promise<string | undefined> => {
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
    return tokenData.data;
};

export default function LoginRegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const uid = result.user.uid;

            const userDocRef = doc(db, 'users', uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                Alert.alert('Data user tidak ditemukan di Firestore');
                return;
            }

            const userDataFromFirestore = userDocSnap.data();

            // Ambil token terbaru dari perangkat
            const pushToken = await registerForPushNotificationsAsync();

            // Bandingkan token baru dengan token lama di Firestore
            if (pushToken && userDataFromFirestore.token !== pushToken) {
                await setDoc(userDocRef, { token: pushToken }, { merge: true });
                console.log('✅ Token diperbarui di Firestore');
            }

            // Gabungkan data Firestore dengan token terbaru (jika ada)
            const completeUserData = {
                uid,
                email: result.user.email || '',
                name: userDataFromFirestore.name || '',
                nik: userDataFromFirestore.nik || '',
                phone: userDataFromFirestore.phone || '',
                location: userDataFromFirestore.location || '',
                role: userDataFromFirestore.role || 'user',
                token: pushToken || userDataFromFirestore.token || '',
            };

            // Simpan seluruh data ke AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(completeUserData));

            Alert.alert('Login Berhasil', `Selamat datang, ${completeUserData.name}`);
        } catch (error: any) {
            Alert.alert('Gagal Login', error.message);
        }
    };

    const router = useRouter()
    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Login</Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 20,
                }}
            />

            <TouchableOpacity
                onPress={signIn}
                style={{
                    backgroundColor: '#007bff',
                    padding: 12,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text>Belum punya akun? Daftar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

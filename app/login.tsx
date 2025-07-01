import { auth, db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
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
            const userDoc = await getDoc(userDocRef);
            const role = userDoc.exists() ? userDoc.data().role : 'user';

            // ✅ Ambil token notifikasi setelah login
            const pushToken = await registerForPushNotificationsAsync();

            // ✅ Simpan token ke dokumen user
            const userDataToSave = {
                email: result.user.email,
                role,
                token: pushToken || '',
            };
            await setDoc(userDocRef, userDataToSave, { merge: true });

            // ✅ Simpan ke AsyncStorage untuk digunakan di halaman lain
            const userData = { uid, email: result.user.email, role };
            await AsyncStorage.setItem('user', JSON.stringify(userData));

            Alert.alert('Login Berhasil', userData.email ?? '');
        } catch (error: any) {
            Alert.alert('Gagal Login', error.message);
        }
    };

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
        </SafeAreaView>
    );
}

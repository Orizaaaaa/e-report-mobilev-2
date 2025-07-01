import AuthInput from '@/components/elements/AuthInput/AuthInput';
import { auth, db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import {
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TouchableOpacity,
    View
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
    const [form, setForm] = useState({ email: '', password: '' });
    const handleChange = (name: string, text: string) => {
        setForm({ ...form, [name]: text });
    };

    // validation regex
    const [emailValidate, setEmailValidate] = useState(true)
    useEffect(() => {
        if (form.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            setEmailValidate(emailRegex.test(form.email));
        }
    }, [form.email]);

    const signIn = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, form.email, form.password);
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
        <SafeAreaView className='bg-white' style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>Login</Text>

            <View className='w-full flex items-center justify-center mb-4' >
                <AuthInput placeholder='Email' value={form.email} onChangeText={(text) => handleChange('email', text)} isPass={false}
                    border={emailValidate ? 'border-gray-200' : 'border-red-500'} />
            </View>

            <View className='w-full flex items-center justify-center' >
                <AuthInput placeholder='Password' value={form.password} onChangeText={(text) => handleChange('password', text)} isPass={true} />
            </View>



            <TouchableOpacity
                onPress={signIn}
                className='w-full flex items-center justify-center py-4 bg-primaryNavy  rounded-lg mt-4'
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity className='mt-4' onPress={() => router.push('/register')}>
                <Text className='text-slate-400 font-light' >Belum punya akun? Daftar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

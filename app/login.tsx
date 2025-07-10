import AuthInput from '@/components/elements/AuthInput/AuthInput';
import { useRoleStore } from '@/hook/stores/roleStore'; // ✅ Tambahkan ini
import { auth, db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useRouter } from 'expo-router';
import {
    sendPasswordResetEmail,
    signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
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
    const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
    const [modalSentVisible, setModalSentVisible] = useState(false);
    const [emailReset, setEmailReset] = useState({
        email: '',
    });
    const [loading, setLoading] = useState(false)
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
    const router = useRouter()
    const signIn = async () => {
        if (!form.email.trim() || !form.password.trim()) {
            Alert.alert('Peringatan', 'Email dan password tidak boleh kosong!');
            return;
        }

        setLoading(true)
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
                image: userDataFromFirestore.image || '',
                uid: uid,
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
            useRoleStore.getState().setRole(completeUserData.role);

            if (completeUserData.role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/user')
            }

            setLoading(false)


        } catch (error: any) {
            setLoading(false)
            Alert.alert('Gagal Login', error.message);
        }
    };

    const handleSendPasswordReset = async () => {
        try {
            if (!emailReset.email) {
                Alert.alert("Gagal", "Email pengguna tidak ditemukan.");
                return;
            }
            await sendPasswordResetEmail(auth, emailReset.email);
            setEmailReset({ email: '' });
            setModalConfirmVisible(false);
            setModalSentVisible(true);
            router.replace('/login');
        } catch (error) {
            console.error("❌ Gagal mengirim email reset password:", error);
            Alert.alert("Gagal", "Terjadi kesalahan saat mengirim email.");
        }
    };

    console.log(emailReset);


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
                disabled={loading}
                className='w-full flex items-center justify-center py-4 bg-primaryNavy  rounded-lg mt-4'
            >
                {loading ? <ActivityIndicator size="large" color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Masuk</Text>}


            </TouchableOpacity>



            <TouchableOpacity className='mt-4' onPress={() => router.push('/register')}>
                <Text className='text-slate-400 font-light' >Belum punya akun? Register</Text>
            </TouchableOpacity>
            <TouchableOpacity className='mt-2' onPress={() => setModalConfirmVisible(true)}>
                <Text className='text-slate-400 font-light' >Lupa kata sandi ?</Text>
            </TouchableOpacity>

            {/* Modal Konfirmasi Ganti Password */}
            <Modal
                transparent
                visible={modalConfirmVisible}
                animationType="fade"
                onRequestClose={() => setModalConfirmVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white p-6 rounded-xl w-full">
                        <Text className="text-lg font-semibold mb-3 text-center">Masukan email anda di bawah ini jika ingin ubah password</Text>
                        <View className='w-full flex items-center justify-center mb-4' >
                            <AuthInput placeholder='Email' value={emailReset.email} onChangeText={(text) => setEmailReset({ ...emailReset, email: text })} isPass={false}
                            />
                        </View>
                        <View className="flex-row justify-end gap-4 mt-4">
                            <TouchableOpacity className='bg-gray-200 py-2 px-4 rounded-lg' onPress={() => setModalConfirmVisible(false)}>
                                <Text className="text-primaryNavy">Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='bg-primaryOrange py-2 px-4 rounded-lg' onPress={handleSendPasswordReset}>
                                <Text className="text-white font-semibold">Iya</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal Notifikasi Email Terkirim */}
            <Modal
                transparent
                visible={modalSentVisible}
                animationType="fade"
                onRequestClose={() => setModalSentVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white p-6 rounded-xl w-full">
                        <Text className="text-lg font-semibold text-center mb-2">Email telah dikirim</Text>
                        <Text className="text-center text-gray-700">Silakan cek email Anda untuk mengganti password.</Text>
                        <TouchableOpacity
                            onPress={() => setModalSentVisible(false)}
                            className="mt-4 bg-primaryOrange py-2 px-4 rounded-lg self-center"
                        >
                            <Text className="text-white font-medium">Tutup</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>


    );
}

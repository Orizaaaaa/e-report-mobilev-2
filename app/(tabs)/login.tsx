import { auth, db } from '@/database/firebase';
import { useRoleStore } from '@/hook/state/stores/roleStore';
import { movePage } from '@/utils/helper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
// Sesuaikan path sesuai struktur project Anda

type Props = {};

const Login = (props: Props) => {
    const [loading, setLoading] = React.useState(false);
    const [form, setForm] = React.useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = React.useState({
        email: '',
        password: '',
        general: ''
    });
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    // fungsi handleChange umum
    const handleChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        // Hapus error saat user mulai mengetik
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }));
        }
    };



    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: '',
            password: '',
            general: ''
        };

        // Validasi email
        if (!form.email) {
            newErrors.email = 'Email harus diisi';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            newErrors.email = 'Format email tidak valid';
            isValid = false;
        }

        // Validasi password
        if (!form.password) {
            newErrors.password = 'Password harus diisi';
            isValid = false;
        } else if (form.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setErrors({ email: '', password: '', general: '' });

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

            // Gabungkan data Firestore dengan token terbaru (jika ada)
            const completeUserData = {
                image: userDataFromFirestore.image || '',
                uid: uid,
                email: result.user.email || '',
                name: userDataFromFirestore.namaLengkap || '',
                nik: userDataFromFirestore.nik || '',
                phone: userDataFromFirestore.noTelp || '',
                alamat: userDataFromFirestore.alamat || '',
                role: userDataFromFirestore.role || 'user',
            };

            // Simpan seluruh data ke AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(completeUserData));
            useRoleStore.getState().setRole(completeUserData.role);
            if (completeUserData.role === 'admin') {
                router.push('/(tabs)/admin/home')
            } else {
                router.push('/home')
            }

            setLoading(false)
            // Reset form setelah login berhasil
            setForm({ email: '', password: '' });
            // Navigasi atau tindakan setelah login berhasil
            // navigation.navigate('Home');

        } catch (error: any) {
            console.log('Login error:', error);

            // Handle error spesifik
            switch (error.code) {
                case 'auth/invalid-email':
                    setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }));
                    break;
                case 'auth/user-disabled':
                    setErrors(prev => ({ ...prev, general: 'Akun ini telah dinonaktifkan' }));
                    break;
                case 'auth/user-not-found':
                    setErrors(prev => ({ ...prev, email: 'Email tidak terdaftar' }));
                    break;
                case 'auth/wrong-password':
                    setErrors(prev => ({ ...prev, password: 'Password salah' }));
                    break;
                case 'auth/invalid-credential':
                    setErrors(prev => ({ ...prev, general: 'Email atau password salah' }));
                    break;
                case 'auth/too-many-requests':
                    setErrors(prev => ({ ...prev, general: 'Terlalu banyak percobaan gagal. Coba lagi nanti' }));
                    break;
                case 'auth/network-request-failed':
                    setErrors(prev => ({ ...prev, general: 'Koneksi internet bermasalah' }));
                    break;
                default:
                    setErrors(prev => ({ ...prev, general: 'Terjadi kesalahan. Silakan coba lagi' }));
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-[#2AA8E1]">
            {/* Bagian Header Biru */}
            <View className="items-center justify-center pt-14 pb-5">
                {/* Ilustrasi gambar */}
                <Image
                    source={require('../../assets/images/login_image.png')}
                    className="w-48 h-40"
                    resizeMode="contain"
                />
            </View>

            {/* Bagian Konten Putih dengan lengkungan di atas */}
            <View className="flex-1 bg-white rounded-t-3xl p-6">
                <Text className="text-xl font-bold mb-4 text-[#205072]">Sign In</Text>
                <ScrollView>
                    {/* Input Email */}
                    <View className="mb-4">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.email ? 'border-red-500' : 'border-[#205072]'}`}>
                            <Ionicons name="mail-outline" size={20} color={errors.email ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Email"
                                className="flex-1 ml-2 py-3"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={form.email}
                                onChangeText={text => handleChange('email', text)}
                            />
                        </View>
                        {errors.email ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.email}</Text> : null}
                    </View>

                    {/* Input Password */}
                    <View className="mb-6">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.password ? 'border-red-500' : 'border-[#205072]'}`}>
                            <Ionicons name="lock-closed-outline" size={20} color={errors.password ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Password"
                                className="flex-1 ml-2 py-3"
                                secureTextEntry={!isPasswordVisible}
                                value={form.password}
                                onChangeText={text => handleChange('password', text)}
                            />
                            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                                <Ionicons
                                    name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color={errors.password ? '#FF0000' : '#205072'}
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.password}</Text> : null}
                    </View>

                    {/* Error General */}
                    {errors.general ? (
                        <View className="mb-4 p-3 bg-red-100 rounded-lg">
                            <Text className="text-red-500 text-center">{errors.general}</Text>
                        </View>
                    ) : null}

                    {/* Button Submit */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        disabled={loading}
                        className='flex justify-center items-center bg-yellow-400 py-3 rounded-xl mb-4'
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#205072" />
                        ) : (
                            <Text className='text-[#205072] font-medium text-lg'>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link Lupa Password */}
                    <TouchableOpacity className="items-center mb-6">
                        <Text className="text-[#205072]">Lupa Password?</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View className="flex-row items-center mb-6">
                        <View className="flex-1 h-px bg-gray-300" />
                        <Text className="mx-3 text-gray-500">atau</Text>
                        <View className="flex-1 h-px bg-gray-300" />
                    </View>

                    {/* Social Login Options */}
                    <View className="flex-row justify-center gap-2">
                        <TouchableOpacity className="p-3 border border-gray-300 rounded-full">
                            <Ionicons name="logo-google" size={24} color="#DB4437" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-3 border border-gray-300 rounded-full">
                            <Ionicons name="logo-facebook" size={24} color="#4267B2" />
                        </TouchableOpacity>
                        <TouchableOpacity className="p-3 border border-gray-300 rounded-full">
                            <Ionicons name="logo-apple" size={24} color="#000000" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                {/* Footer Sign Up */}
                <View className="flex-row justify-center mt-4">
                    <Text className="text-gray-600">Belum punya akun? </Text>
                    <TouchableOpacity onPress={() => movePage('/register')}>
                        <Text className="text-[#205072] font-bold">Daftar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

export default Login;
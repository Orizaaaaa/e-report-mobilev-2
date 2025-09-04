import { auth, db } from '@/database/firebase'
import { Feather, FontAwesome, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'

type Props = {}

const Register = (props: Props) => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        namaLengkap: '',
        nik: '',
        tanggalLahir: '',
        usia: '',
        pekerjaan: '',
        alamat: '',
        email: '',
        noTelp: '',
        password: '',
        role: 'user'
    })

    const [errors, setErrors] = useState({
        namaLengkap: '',
        nik: '',
        tanggalLahir: '',
        usia: '',
        pekerjaan: '',
        alamat: '',
        email: '',
        noTelp: '',
        password: '',
        general: ''
    })

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    // fungsi handleChange umum
    const handleChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
        // Hapus error saat user mulai mengetik
        if (errors[field as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
        if (errors.general) {
            setErrors(prev => ({ ...prev, general: '' }))
        }
    }

    const validateForm = () => {
        let isValid = true
        const newErrors = {
            namaLengkap: '',
            nik: '',
            tanggalLahir: '',
            usia: '',
            pekerjaan: '',
            alamat: '',
            email: '',
            noTelp: '',
            password: '',
            general: ''
        }

        // Validasi Nama Lengkap
        if (!form.namaLengkap.trim()) {
            newErrors.namaLengkap = 'Nama lengkap harus diisi'
            isValid = false
        } else if (form.namaLengkap.trim().length < 3) {
            newErrors.namaLengkap = 'Nama minimal 3 karakter'
            isValid = false
        }

        // Validasi NIK
        if (!form.nik.trim()) {
            newErrors.nik = 'NIK harus diisi'
            isValid = false
        } else if (!/^\d{16}$/.test(form.nik)) {
            newErrors.nik = 'NIK harus 16 digit angka'
            isValid = false
        }

        // Validasi Tanggal Lahir
        if (!form.tanggalLahir.trim()) {
            newErrors.tanggalLahir = 'Tanggal lahir harus diisi'
            isValid = false
        }

        // Validasi Usia
        if (!form.usia.trim()) {
            newErrors.usia = 'Usia harus diisi'
            isValid = false
        } else if (!/^\d+$/.test(form.usia)) {
            newErrors.usia = 'Usia harus berupa angka'
            isValid = false
        } else if (parseInt(form.usia) < 17 || parseInt(form.usia) > 100) {
            newErrors.usia = 'Usia harus antara 17-100 tahun'
            isValid = false
        }

        // Validasi Pekerjaan
        if (!form.pekerjaan.trim()) {
            newErrors.pekerjaan = 'Pekerjaan harus diisi'
            isValid = false
        }

        // Validasi Alamat
        if (!form.alamat.trim()) {
            newErrors.alamat = 'Alamat harus diisi'
            isValid = false
        } else if (form.alamat.trim().length < 10) {
            newErrors.alamat = 'Alamat terlalu pendek'
            isValid = false
        }

        // Validasi Email
        if (!form.email.trim()) {
            newErrors.email = 'Email harus diisi'
            isValid = false
        } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            newErrors.email = 'Format email tidak valid'
            isValid = false
        }

        // Validasi No Telepon
        if (!form.noTelp.trim()) {
            newErrors.noTelp = 'Nomor telepon harus diisi'
            isValid = false
        } else if (!/^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(form.noTelp)) {
            newErrors.noTelp = 'Format nomor telepon tidak valid'
            isValid = false
        }

        // Validasi Password
        if (!form.password) {
            newErrors.password = 'Password harus diisi'
            isValid = false
        } else if (form.password.length < 6) {
            newErrors.password = 'Password minimal 6 karakter'
            isValid = false
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(form.password)) {
            newErrors.password = 'Password harus mengandung huruf besar, huruf kecil, dan angka'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setLoading(true)
        setErrors({
            namaLengkap: '',
            nik: '',
            tanggalLahir: '',
            usia: '',
            pekerjaan: '',
            alamat: '',
            email: '',
            noTelp: '',
            password: '',
            general: '',
        })

        try {
            // 1. Buat akun di Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            )
            const user = userCredential.user

            // 2. Simpan data lengkap ke Firestore
            await setDoc(doc(db, 'users', user.uid), {
                namaLengkap: form.namaLengkap.trim(),
                nik: form.nik,
                tanggalLahir: form.tanggalLahir,
                usia: parseInt(form.usia),
                pekerjaan: form.pekerjaan.trim(),
                alamat: form.alamat.trim(),
                email: form.email.toLowerCase().trim(),
                noTelp: form.noTelp,
                createdAt: new Date().toISOString(),
            })

            setLoading(false)
            Alert.alert(
                'Sukses',
                'Akun berhasil dibuat!',
                [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('Login' as never)
                    }
                ]
            )

        } catch (error: any) {
            console.error('Register error:', error)
            setLoading(false)

            // Handle error spesifik dari Firebase
            switch (error.code) {
                case 'auth/email-already-in-use':
                    setErrors(prev => ({ ...prev, email: 'Email sudah terdaftar' }))
                    break
                case 'auth/invalid-email':
                    setErrors(prev => ({ ...prev, email: 'Format email tidak valid' }))
                    break
                case 'auth/weak-password':
                    setErrors(prev => ({ ...prev, password: 'Password terlalu lemah' }))
                    break
                case 'auth/operation-not-allowed':
                    setErrors(prev => ({ ...prev, general: 'Registrasi tidak diizinkan' }))
                    break
                case 'auth/network-request-failed':
                    setErrors(prev => ({ ...prev, general: 'Koneksi internet bermasalah' }))
                    break
                default:
                    setErrors(prev => ({ ...prev, general: 'Terjadi kesalahan. Silakan coba lagi' }))
            }
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-[#2AA8E1]">
            {/* Bagian Header Biru */}
            <View className="items-center justify-center pt-14 pb-5">
                <Image
                    source={require('../../assets/images/login_image.png')}
                    className="w-48 h-40"
                    resizeMode="contain"
                />
            </View>

            {/* Bagian Konten Putih dengan lengkungan di atas */}
            <View className="flex-1 bg-white rounded-t-3xl p-6">
                <Text className="text-xl font-bold mb-4 text-[#205072]">Sign Up</Text>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Nama Lengkap */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.namaLengkap ? 'border-red-500' : 'border-[#205072]'}`}>
                            <Ionicons name="person" size={24} color={errors.namaLengkap ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Nama Lengkap"
                                className="flex-1 ml-2 py-3"
                                value={form.namaLengkap}
                                onChangeText={text => handleChange('namaLengkap', text)}
                            />
                        </View>
                        {errors.namaLengkap ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.namaLengkap}</Text> : null}
                    </View>

                    {/* NIK */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.nik ? 'border-red-500' : 'border-[#205072]'}`}>
                            <MaterialCommunityIcons name="card-account-details" size={24} color={errors.nik ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="No KTP / NIK"
                                className="flex-1 ml-2 py-3"
                                keyboardType="numeric"
                                maxLength={16}
                                value={form.nik}
                                onChangeText={text => handleChange('nik', text)}
                            />
                        </View>
                        {errors.nik ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.nik}</Text> : null}
                    </View>

                    {/* Tanggal Lahir */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.tanggalLahir ? 'border-red-500' : 'border-[#205072]'}`}>
                            <Feather name="calendar" size={24} color={errors.tanggalLahir ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Tanggal Lahir (DD/MM/YYYY)"
                                className="flex-1 ml-2 py-3"
                                value={form.tanggalLahir}
                                onChangeText={text => handleChange('tanggalLahir', text)}
                            />
                        </View>
                        {errors.tanggalLahir ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.tanggalLahir}</Text> : null}
                    </View>

                    {/* Usia */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.usia ? 'border-red-500' : 'border-[#205072]'}`}>
                            <MaterialCommunityIcons name="timer-sand" size={24} color={errors.usia ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Usia"
                                className="flex-1 ml-2 py-3"
                                keyboardType="numeric"
                                maxLength={3}
                                value={form.usia}
                                onChangeText={text => handleChange('usia', text)}
                            />
                        </View>
                        {errors.usia ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.usia}</Text> : null}
                    </View>

                    {/* Pekerjaan */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.pekerjaan ? 'border-red-500' : 'border-[#205072]'}`}>
                            <Foundation name="shopping-bag" size={24} color={errors.pekerjaan ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Pekerjaan"
                                className="flex-1 ml-2 py-3"
                                value={form.pekerjaan}
                                onChangeText={text => handleChange('pekerjaan', text)}
                            />
                        </View>
                        {errors.pekerjaan ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.pekerjaan}</Text> : null}
                    </View>

                    {/* Alamat */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.alamat ? 'border-red-500' : 'border-[#205072]'}`}>
                            <Ionicons name="location-sharp" size={24} color={errors.alamat ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Alamat Lengkap"
                                className="flex-1 ml-2 py-3"
                                multiline
                                numberOfLines={3}
                                textAlignVertical="top"
                                value={form.alamat}
                                onChangeText={text => handleChange('alamat', text)}
                            />
                        </View>
                        {errors.alamat ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.alamat}</Text> : null}
                    </View>

                    {/* Email */}
                    <View className="mb-3">
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

                    {/* No Telepon */}
                    <View className="mb-3">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.noTelp ? 'border-red-500' : 'border-[#205072]'}`}>
                            <MaterialIcons name="phone-in-talk" size={24} color={errors.noTelp ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="No Telp Aktif (08...)"
                                className="flex-1 ml-2 py-3"
                                keyboardType="phone-pad"
                                value={form.noTelp}
                                onChangeText={text => handleChange('noTelp', text)}
                            />
                        </View>
                        {errors.noTelp ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.noTelp}</Text> : null}
                    </View>

                    {/* Password */}
                    <View className="mb-4">
                        <View className={`flex-row items-center border-2 rounded-xl px-3 ${errors.password ? 'border-red-500' : 'border-[#205072]'}`}>
                            <FontAwesome name="lock" size={24} color={errors.password ? '#FF0000' : '#205072'} />
                            <TextInput
                                placeholder="Masukan Password"
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
                            <Text className='text-[#205072] font-medium text-lg'>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* Link ke Login */}
                    <View className="flex-row justify-center mt-4">
                        <Text className="text-gray-600">Sudah punya akun? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('login' as never)}>
                            <Text className="text-[#205072] font-bold">Login</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Register
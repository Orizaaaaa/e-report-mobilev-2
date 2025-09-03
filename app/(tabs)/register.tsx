import { auth, db } from '@/database/firebase'
import { Feather, FontAwesome, Foundation, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import React, { useState } from 'react'
import { Alert, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

type Props = {}

const Register = (props: Props) => {
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
    })

    // fungsi handleChange umum
    const handleChange = (field: keyof typeof form, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }))
    }

    const handleSubmit = async () => {
        // Cek apakah ada field kosong
        if (
            !form.namaLengkap ||
            !form.nik ||
            !form.tanggalLahir ||
            !form.usia ||
            !form.pekerjaan ||
            !form.alamat ||
            !form.email ||
            !form.noTelp ||
            !form.password
        ) {
            Alert.alert('Error', 'Semua field wajib diisi')
            return
        }

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
                namaLengkap: form.namaLengkap,
                nik: form.nik,
                tanggalLahir: form.tanggalLahir,
                usia: form.usia,
                pekerjaan: form.pekerjaan,
                alamat: form.alamat,
                email: form.email,
                noTelp: form.noTelp,
                createdAt: new Date().toISOString(),
            })

            Alert.alert('Sukses', 'Akun berhasil dibuat!')
        } catch (error: any) {
            console.error(error)
            Alert.alert('Error', error.message)
        }
    }


    console.log(form);

    return (
        <SafeAreaView className="flex-1 bg-[#2AA8E1]">
            {/* Bagian Header Biru */}
            <View className="items-center justify-center pt-14 pb-5">
                {/* Ilustrasi gambar */}
                <Image
                    source={require('../../assets/images/login_image.png')} // ganti sesuai path ilustrasi kamu
                    className="w-48 h-40"
                    resizeMode="contain"
                />
            </View>

            {/* Bagian Konten Putih dengan lengkungan di atas */}
            <View className="flex-1 bg-white rounded-t-3xl p-6">
                <Text className="text-xl font-bold mb-4 text-[#205072]">Sign Up</Text>
                <ScrollView>
                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <Ionicons name="person" size={24} color="#205072" />
                        <TextInput
                            placeholder="Nama Lengkap"
                            className="flex-1 ml-2"
                            value={form.namaLengkap}
                            onChangeText={text => handleChange('namaLengkap', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <MaterialCommunityIcons name="card-account-details" size={24} color="#205072" />
                        <TextInput
                            placeholder="No KTP / NIK"
                            className="flex-1 ml-2"
                            value={form.nik}
                            onChangeText={text => handleChange('nik', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <Feather name="calendar" size={24} color="#205072" />
                        <TextInput
                            placeholder="Tanggal Lahir"
                            className="flex-1 ml-2"
                            value={form.tanggalLahir}
                            onChangeText={text => handleChange('tanggalLahir', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <MaterialCommunityIcons name="timer-sand" size={24} color="#205072" />
                        <TextInput
                            placeholder="Usia"
                            className="flex-1 ml-2"
                            keyboardType="numeric"
                            value={form.usia}
                            onChangeText={text => handleChange('usia', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <Foundation name="shopping-bag" size={24} color="#205072" />
                        <TextInput
                            placeholder="Pekerjaan"
                            className="flex-1 ml-2"
                            value={form.pekerjaan}
                            onChangeText={text => handleChange('pekerjaan', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <Ionicons name="location-sharp" size={24} color="#205072" />
                        <TextInput
                            placeholder="Alamat"
                            className="flex-1 ml-2"
                            value={form.alamat}
                            onChangeText={text => handleChange('alamat', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <Ionicons name="mail-outline" size={20} color="#205072" />
                        <TextInput
                            placeholder="Email"
                            className="flex-1 ml-2"
                            keyboardType="email-address"
                            value={form.email}
                            onChangeText={text => handleChange('email', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <MaterialIcons name="phone-in-talk" size={24} color="#205072" />
                        <TextInput
                            placeholder="No Telp Aktif"
                            className="flex-1 ml-2"
                            keyboardType="phone-pad"
                            value={form.noTelp}
                            onChangeText={text => handleChange('noTelp', text)}
                        />
                    </View>

                    <View className="flex-row items-center border-2 border-[#205072] mb-4 rounded-xl px-3">
                        <FontAwesome name="lock" size={24} color="#205072" />
                        <TextInput
                            placeholder="Masukan Password"
                            className="flex-1 ml-2"
                            secureTextEntry
                            value={form.password}
                            onChangeText={text => handleChange('password', text)}
                        />
                    </View>
                    <TouchableOpacity onPress={handleSubmit} className='flex justify-center items-center bg-yellow-400 py-3 rounded-xl'>
                        <Text className='text-[#205072] font-medium text-lg' >Sign Up</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default Register

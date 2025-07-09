// sesuaikan path config firebase kamu
import { useRoleStore } from '@/hook/stores/roleStore';
import { auth } from '@/lib/firebase/firebase';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import React, { useState } from 'react';
import { Alert, Modal, Text, TouchableOpacity, View } from 'react-native';

const Setting = () => {

    const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
    const [modalSentVisible, setModalSentVisible] = useState(false);
    const [modalLogoutVisible, setModalLogoutVisible] = useState(false);

    const handleSendPasswordReset = async () => {
        try {
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;

            if (!user?.email) {
                Alert.alert("Gagal", "Email pengguna tidak ditemukan.");
                return;
            }
            await sendPasswordResetEmail(auth, user.email);
            setModalConfirmVisible(false);
            setModalSentVisible(true);
            router.replace('/login');
        } catch (error) {
            console.error("❌ Gagal mengirim email reset password:", error);
            Alert.alert("Gagal", "Terjadi kesalahan saat mengirim email.");
        }
    };


    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            useRoleStore.getState().setRole(null);
            setModalLogoutVisible(false);
            router.replace('/login');
        } catch (error) {
            console.error("❌ Gagal logout:", error);
            Alert.alert("Gagal", "Logout gagal. Silakan coba lagi.");
        }
    };

    return (
        <View className='py-12 px-3'>
            <View className='flex-row items-center gap-6'>
                <AntDesign onPress={() => router.back()} name="arrowleft" size={24} color="black" />
                <Text className='font-medium text-lg'>Pengaturan dan aktifitas</Text>
            </View>

            <View className="mt-10 px-4">
                {/* Ganti Password */}
                <TouchableOpacity
                    onPress={() => setModalConfirmVisible(true)}
                    className="flex-row justify-between items-center bg-white px-4 py-3 mb-4 rounded-xl shadow-md"
                >
                    <Text className="text-base text-gray-800">Ganti Password</Text>
                    <MaterialIcons name="password" size={24} color="black" />
                </TouchableOpacity>


                {/* Logout */}
                <TouchableOpacity
                    onPress={() => setModalLogoutVisible(true)}
                    className="flex-row justify-between items-center bg-white px-4 py-3 mb-4 rounded-xl shadow-md"
                >
                    <Text className="text-base text-gray-800">Logout</Text>
                    <MaterialIcons name="logout" size={24} color="red" />
                </TouchableOpacity>
            </View>

            {/* Modal Konfirmasi Ganti Password */}
            <Modal
                transparent
                visible={modalConfirmVisible}
                animationType="fade"
                onRequestClose={() => setModalConfirmVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white p-6 rounded-xl w-full">
                        <Text className="text-lg font-semibold mb-3 text-center">Apakah Anda yakin ingin mengganti password?</Text>
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

            {/* Modal Konfirmasi Logout */}
            <Modal
                transparent
                visible={modalLogoutVisible}
                animationType="fade"
                onRequestClose={() => setModalLogoutVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white p-6 rounded-xl w-full">
                        <Text className="text-lg font-semibold mb-3 text-center">Apakah Anda yakin ingin logout?</Text>
                        <View className="flex-row justify-end gap-4 mt-4">
                            <TouchableOpacity className='bg-gray-200 py-2 px-4 rounded-lg' onPress={() => setModalLogoutVisible(false)}>
                                <Text className="text-primaryNavy">Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity className='bg-red-500 py-2 px-4 rounded-lg' onPress={handleLogout}>
                                <Text className="text-white font-semibold">Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default Setting;

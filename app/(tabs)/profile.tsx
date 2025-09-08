import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { useRoleStore } from "@/hook/state/stores/roleStore";
import { AntDesign, Entypo, FontAwesome5, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

interface CompleteUserData {
    image: string;
    uid: string;
    email: string;
    name: string;
    nik: string;
    phone: string;
    alamat: string;
    usia: string;
    role: string;
}

export default function Profile() {
    const [userData, setUserData] = useState<CompleteUserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        name: '',
        email: '',
        nik: '',
        phone: '',
        alamat: '',
        usia: ''
    });
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            useRoleStore.getState().setRole('admin');
            router.replace('/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    }

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userJson = await AsyncStorage.getItem('user');

            if (userJson) {
                const userData: CompleteUserData = JSON.parse(userJson);
                setUserData(userData);
                // Set form data untuk edit
                setEditForm({
                    name: userData.name || '',
                    email: userData.email || '',
                    nik: userData.nik || '',
                    phone: userData.phone || '',
                    alamat: userData.alamat || '',
                    usia: userData.usia || ''
                });
            }
        } catch (error) {
            console.error('Gagal mengambil data user:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPress = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        // Reset form ke data asli
        if (userData) {
            setEditForm({
                name: userData.name || '',
                email: userData.email || '',
                nik: userData.nik || '',
                phone: userData.phone || '',
                alamat: userData.alamat || '',
                usia: userData.usia || ''
            });
        }
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        try {
            if (!userData) return;

            // Validasi sederhana
            if (!editForm.name || !editForm.email) {
                Alert.alert('Error', 'Nama dan email harus diisi');
                return;
            }

            // Update user data
            const updatedUserData = {
                ...userData,
                name: editForm.name,
                email: editForm.email,
                nik: editForm.nik,
                phone: editForm.phone,
                alamat: editForm.alamat,
                usia: editForm.usia
            };

            // Simpan ke AsyncStorage
            await AsyncStorage.setItem('user', JSON.stringify(updatedUserData));
            setUserData(updatedUserData);
            setIsEditing(false);

            Alert.alert('Sukses', 'Profil berhasil diperbarui');
        } catch (error) {
            console.error('Gagal menyimpan perubahan:', error);
            Alert.alert('Error', 'Gagal menyimpan perubahan');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-white"
        >
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="bg-['#2AA8E1'] py-12 rounded-bl-[60px]">
                    <View className="flex-row justify-between items-center px-3">
                        <ButtonBack colorIcon="white" />
                        <TouchableOpacity onPress={() => router.push('/profile')}>
                            <Octicons name="gear" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                    <View className="flex justify-center items-center">
                        <View className='w-28 h-28 rounded-xl'>
                            <Image
                                className='w-full h-full rounded-full'
                                source={require('../../assets/images/human.png')}
                                resizeMode='cover'
                            />
                        </View>
                        <View className="mt-5">
                            {isEditing ? (
                                <TextInput
                                    className="text-white text-xl text-center bg-blue-700 rounded-lg px-4 py-2"
                                    value={editForm.name}
                                    onChangeText={(text) => setEditForm({ ...editForm, name: text })}
                                    placeholder="Nama"
                                />
                            ) : (
                                <Text className="text-white text-xl">{userData?.name}</Text>
                            )}
                        </View>
                    </View>
                </View>

                <View className="flex-1 bg-['#2AA8E1']">
                    <View className="bg-white rounded-tr-[60px] p-4 -mt-0 flex-1">
                        <View className="mt-9 flex-row justify-between px-2">
                            <Text className="text-lg font-medium">Informasi Pribadi</Text>
                            {isEditing ? (
                                <View className="flex-row">
                                    <TouchableOpacity onPress={handleCancelEdit} className="mr-4">
                                        <AntDesign name="close" size={24} color="#FF3B30" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleSaveEdit}>
                                        <AntDesign name="check" size={24} color="#002B5A" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity onPress={handleEditPress}>
                                    <AntDesign name="edit" size={24} color="#002B5A" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <View className="w-full bg-['#2AA8E1'] py-3 mt-6 rounded-2xl">
                            {/* NIK Field */}
                            <View className="border-b-2 border-white pb-2 mb-2">
                                <View className="flex-row justify-between px-4 py-2">
                                    <View className="flex-row justify-center items-center gap-2">
                                        <Ionicons name="person-circle-outline" size={24} color="white" />
                                        <Text className="text-white">NIK</Text>
                                    </View>
                                    {isEditing ? (
                                        <TextInput
                                            className="text-white text-right bg-blue-600 rounded px-2 py-1 w-40"
                                            value={editForm.nik}
                                            onChangeText={(text) => setEditForm({ ...editForm, nik: text })}
                                            placeholder="Masukkan NIK"
                                            keyboardType="numeric"
                                        />
                                    ) : (
                                        <Text className="text-white">{userData?.nik}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Email Field */}
                            <View className="border-b-2 border-white pb-2 mb-2">
                                <View className="flex-row justify-between px-4 py-2">
                                    <View className="flex-row justify-center items-center gap-2">
                                        <Fontisto name="email" size={24} color="white" />
                                        <Text className="text-white">email</Text>
                                    </View>
                                    {isEditing ? (
                                        <TextInput
                                            className="text-white text-right bg-blue-600 rounded px-2 py-1 w-40"
                                            value={editForm.email}
                                            onChangeText={(text) => setEditForm({ ...editForm, email: text })}
                                            placeholder="Masukkan email"
                                            keyboardType="email-address"
                                            autoCapitalize="none"
                                        />
                                    ) : (
                                        <Text className="text-white">{userData?.email}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Phone Field */}
                            <View className="border-b-2 border-white pb-2 mb-2">
                                <View className="flex-row justify-between px-4 py-2">
                                    <View className="flex-row justify-center items-center gap-2">
                                        <FontAwesome5 name="whatsapp" size={24} color="white" />
                                        <Text className="text-white">nomor handphone</Text>
                                    </View>
                                    {isEditing ? (
                                        <TextInput
                                            className="text-white text-right bg-blue-600 rounded px-2 py-1 w-40"
                                            value={editForm.phone}
                                            onChangeText={(text) => setEditForm({ ...editForm, phone: text })}
                                            placeholder="Masukkan nomor handphone"
                                            keyboardType="phone-pad"
                                        />
                                    ) : (
                                        <Text className="text-white">{userData?.phone}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Address Field */}
                            <View className="border-b-2 border-white pb-2 mb-2">
                                <View className="flex-row justify-between px-4 py-2">
                                    <View className="flex-row justify-center items-center gap-2">
                                        <Entypo name="location-pin" size={22} color="white" />
                                        <Text className="text-white">lokasi</Text>
                                    </View>
                                    {isEditing ? (
                                        <TextInput
                                            className="text-white text-right bg-blue-600 rounded px-2 py-1 w-40"
                                            value={editForm.alamat}
                                            onChangeText={(text) => setEditForm({ ...editForm, alamat: text })}
                                            placeholder="Masukkan alamat"
                                        />
                                    ) : (
                                        <Text className="text-white">{userData?.alamat}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Age Field */}
                            <View className="border-b-2 border-white pb-2 mb-2">
                                <View className="flex-row justify-between px-4 py-2">
                                    <View className="flex-row justify-center items-center gap-2">
                                        <Ionicons name="time-outline" size={24} color="white" />
                                        <Text className="text-white">usia</Text>
                                    </View>
                                    {isEditing ? (
                                        <TextInput
                                            className="text-white text-right bg-blue-600 rounded px-2 py-1 w-40"
                                            value={editForm.usia}
                                            onChangeText={(text) => setEditForm({ ...editForm, usia: text })}
                                            placeholder="Masukkan usia"
                                            keyboardType="numeric"
                                        />
                                    ) : (
                                        <Text className="text-white">{userData?.usia}</Text>
                                    )}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleLogout}
                                className="border-b-2 border-white pb-2 mb-2"
                            >
                                <View className="px-4 py-2 items-center">
                                    <Text className="text-white font-medium">Logout</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {isEditing && (
                            <View className="mt-6 flex-row justify-between">
                                <TouchableOpacity
                                    className="bg-gray-300 py-3 px-6 rounded-lg flex-1 mr-2"
                                    onPress={handleCancelEdit}
                                >
                                    <Text className="text-gray-700 font-medium text-center">Batal</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-['#2AA8E1'] py-3 px-6 rounded-lg flex-1 ml-2"
                                    onPress={handleSaveEdit}
                                >
                                    <Text className="text-white font-medium text-center">Simpan</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
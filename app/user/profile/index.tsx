import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { AntDesign, Entypo, FontAwesome5, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import { uploadOneImageToStorage } from "@/api/api";
import { db } from "@/lib/firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";

// Define the UserType for type safety
type UserType = {
    uid: string; // tambahkan ini untuk referensi dokumen Firestore
    name: string;
    nik: string;
    email: string;
    phone: string;
    location: string;
    image: string;
};

export default function Profile() {
    const [user, setUser] = useState<UserType | null>(null);
    const [form, setForm] = useState<UserType>({
        uid: '',
        name: '',
        nik: '',
        email: '',
        phone: '',
        location: '',
        image: '',
    });
    const [isEditing, setIsEditing] = useState(false);

    useFocusEffect(
        useCallback(() => {
            const getUserData = async () => {
                try {
                    const jsonValue = await AsyncStorage.getItem('user');
                    if (jsonValue !== null) {
                        const parsed = JSON.parse(jsonValue);
                        setUser(parsed);
                        setForm(parsed);
                    }
                } catch (error) {
                    console.error('Gagal mengambil data user dari AsyncStorage', error);
                    Alert.alert("Error", "Gagal memuat data profil.");
                }
            };
            getUserData();
        }, [])
    );

    const handleChange = (field: keyof UserType, value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const handleInputImageChange = (field: keyof UserType, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            handleInputImageChange("image", imageUri);
        }
    };

    const handleSave = async () => {
        if (!user) return;

        try {
            const uid = user.uid;
            let updatedData: Partial<UserType> = {};

            (['name', 'nik', 'email', 'phone', 'location'] as (keyof UserType)[]).forEach(field => {
                if (form[field] !== user[field]) {
                    updatedData[field] = form[field];
                }
            });

            if (form.image !== user.image && form.image.startsWith('file://')) {
                const uploadedUrl = await uploadOneImageToStorage(form.image, uid, 'users_profiles');
                updatedData.image = uploadedUrl;
            }

            if (Object.keys(updatedData).length === 0) {
                Alert.alert("Info", "Tidak ada perubahan yang disimpan.");
                setIsEditing(false);
                return;
            }

            const userDocRef = doc(db, "users", uid);
            await updateDoc(userDocRef, updatedData);

            const updatedUser = { ...user, ...updatedData };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);
            setForm(updatedUser);
            setIsEditing(false);
            Alert.alert("Sukses", "Profil berhasil diperbarui!");
        } catch (error) {
            console.error('Gagal menyimpan data user ke Firestore', error);
            Alert.alert("Error", "Gagal menyimpan perubahan profil.");
        }
    };

    if (!user) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Memuat data...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-white">
            <View className="bg-primaryNavy py-12 rounded-bl-[60px]">
                <View className="flex-row justify-between items-center px-3">
                    <ButtonBack colorIcon="white" />
                    <Octicons onPress={() => router.push("/user/profile/setting")} name="gear" size={24} color="white" />
                </View>
                <View className="flex justify-center items-center mt-4">
                    <View className="relative">
                        {/* Lingkaran Foto */}
                        <View className="w-28 h-28 rounded-full overflow-hidden border-2 border-white">
                            <Image
                                className="w-full h-full"
                                source={{
                                    uri: form.image || "https://via.placeholder.com/150/CCCCCC/FFFFFF?text=No+Image",
                                }}
                                resizeMode="cover"
                            />
                        </View>

                        {/* Tombol Kamera di Luar Border */}
                        {isEditing && (
                            <TouchableOpacity
                                onPress={handlePickImage}
                                className="absolute -bottom-0 right-2 bg-white p-2 rounded-full shadow z-10"
                            >
                                <FontAwesome5 name="camera" size={16} color="#1E2A38" />
                            </TouchableOpacity>
                        )}
                    </View>


                    <View className="mt-5">
                        <Text className="text-white text-xl font-semibold">{form.name}</Text>
                    </View>
                </View>
            </View>

            <View className="bg-primaryNavy">
                <View className="bg-white rounded-tr-[60px] p-4 -mt-0 min-h-[500px]">
                    <View className="mt-5 flex-row justify-between pr-2 items-center">
                        <Text className="text-lg font-medium text-gray-800">Informasi Pribadi</Text>
                        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                            <AntDesign name="edit" size={24} color="#FF840C" />
                        </TouchableOpacity>
                    </View>

                    <View className="w-full py-3 rounded-2xl">
                        <Item title="Nama" value={user.name} formValue={form.name} icon={<Ionicons name="person-circle-outline" size={24} color="gray" />} isEditing={isEditing} onChangeText={(text) => handleChange('name', text)} />
                        <Item title="NIK" value={user.nik} formValue={form.nik} icon={<AntDesign name="idcard" size={24} color="gray" />} isEditing={isEditing} onChangeText={(text) => handleChange('nik', text)} keyboardType="numeric" />
                        <Item title="Email" value={user.email} formValue={form.email} icon={<Fontisto name="email" size={24} color="gray" />} isEditing={isEditing} onChangeText={(text) => handleChange('email', text)} keyboardType="email-address" />
                        <Item title="Nomor Handphone" value={user.phone} formValue={form.phone} icon={<FontAwesome5 name="whatsapp" size={24} color="gray" />} isEditing={isEditing} onChangeText={(text) => handleChange('phone', text)} keyboardType="phone-pad" />
                        <Item title="Lokasi" value={user.location} formValue={form.location} icon={<Entypo name="location-pin" size={22} color="gray" />} isEditing={isEditing} onChangeText={(text) => handleChange('location', text)} />
                    </View>

                    {isEditing && (
                        <TouchableOpacity
                            onPress={handleSave}
                            className="mt-8 bg-primaryOrange py-3 rounded-xl items-center justify-center shadow-md"
                        >
                            <Text className="text-white text-lg font-bold">Simpan Perubahan</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

// Item component
const Item = ({
    title,
    value,
    formValue,
    icon,
    isEditing,
    onChangeText,
    keyboardType = 'default'
}: {
    title: string;
    value: string;
    formValue: string;
    icon: React.ReactNode;
    isEditing: boolean;
    onChangeText: (text: string) => void;
    keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}) => (
    <View className="mt-3">
        <Text className="text-gray-500 mb-1 text-sm">{title}</Text>
        <View className="2 bg-gray-100 rounded-xl ">
            <View className="flex-row justify-between px-4  items-center">
                {isEditing ? (
                    <TextInput
                        className="flex-1 text-gray-800 text-base"
                        value={formValue}
                        onChangeText={onChangeText}
                        keyboardType={keyboardType}
                        placeholder={`Masukkan ${title.toLowerCase()}`}
                        placeholderTextColor="gray"
                    />
                ) : (
                    <Text className="flex-1 text-gray-800 text-base py-3">{value || 'Tidak ada data'}</Text>
                )}
                {icon}
            </View>
        </View>
    </View>
);

import { db, storage } from '@/database/firebase';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';
type Props = {}

const addArticles = (props: Props) => {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        image: null,
        title: '',
        desc: '',
        writer: '',
        writer_date: '',

    });

    const handleChange = (key: keyof typeof form, value: string | number) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            handleChange('image', imageUri);
        }
    };
    const handleSubmit = async () => {
        // 🔹 Validasi semua field
        setLoading(true);
        if (
            !form.image ||
            !form.title.trim() ||
            !form.desc.trim()
        ) {
            Alert.alert("Error", "Semua field wajib diisi!");
            return;
        }

        try {
            // 🔹 Upload image ke Firebase Storage
            const response = await fetch(form.image);
            const blob = await response.blob();
            const filename = `promo/${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
            const storageRef = ref(storage, filename);

            await uploadBytes(storageRef, blob);
            const downloadURL = await getDownloadURL(storageRef);

            // 🔹 Simpan ke Firestore
            await addDoc(collection(db, "promo"), {
                ...form,
                image: downloadURL, // ganti uri dengan url dari storage
                createdAt: new Date(),
            });

            Alert.alert("Sukses", "Promo berhasil disimpan!");
            setForm({
                image: null,
                title: "",
                desc: "",
                writer: "",
                writer_date: "",
            });
            setLoading(false);
        } catch (error) {
            console.error("Error saving promo:", error);
            Alert.alert("Error", "Gagal menyimpan promo.");
            setLoading(false);
        }
    };
    return (
        <ScrollView className='flex-1 bg-white' >
            <View className='p-5 flex-row items-center mt-10 justify-between' >
                <MaterialIcons onPress={() => router.back()} name="arrow-back-ios" size={24} color="#205072" />
                <Text className='text-[#205072] text-lg font-medium' >Tambah Artikel</Text>
                <Text>{''}</Text>
            </View>
            <KeyboardAvoidingView className='p-5 ' >
                <Text className='mb-3 text-gray-600' >Foto Artikel</Text>
                <TouchableOpacity
                    onPress={handlePickImage}
                    className='w-full h-40 rounded-xl justify-center items-center border-2  border-gray-200 relative'
                    activeOpacity={1}
                >
                    {form.image ? (
                        <>
                            <Image
                                source={{ uri: form.image }}
                                className='w-full h-full rounded-xl'
                                resizeMode='cover'
                            />
                            <TouchableOpacity
                                onPress={() => handleChange('image', '')}
                                className='absolute top-2 right-2 bg-white p-1 rounded-full shadow'
                            >
                                <Ionicons name="close" size={20} color="black" />
                            </TouchableOpacity>
                        </>
                    ) : (
                        <FontAwesome name="image" size={24} color="gray" />
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Judul Artikel</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                />
            </View>
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Penulis</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.writer}
                    onChangeText={(text) => setForm({ ...form, writer: text })}
                />
            </View>
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Tanggal Penulisan</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.writer_date}
                    onChangeText={(text) => setForm({ ...form, writer_date: text })}
                />
            </View>
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Isi Artikel</Text>
                <TextInput
                    className='px-3 py-32 border-2 border-gray-200 rounded-xl'
                    value={form.desc}
                    onChangeText={(text) => setForm({ ...form, desc: text })}
                />
            </View>



            <View className='flex justify-center items-center p-5' >
                <TouchableOpacity onPress={handleSubmit} className='p-3 bg-[#FEDD3F] rounded-xl w-full' >
                    {loading ? <ActivityIndicator size="small" color="white" />
                        : <Text className='text-center text-[#205072] font-medium' >Simpan</Text>}

                </TouchableOpacity>
            </View>


        </ScrollView>
    )
}

export default addArticles
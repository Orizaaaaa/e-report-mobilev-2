import { postImage } from '@/database/cloudinary';
import { db } from '@/database/firebase';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

type Props = {}

const EditFacilities = (props: Props) => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        image: null,      // gambar fasilitas
        title: '',        // nama fasilitas
    });

    const handleChange = (key: keyof typeof form, value: string | null) => {
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

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const docRef = doc(db, 'facilities', id);
                const docSnap: any = await getDoc(docRef);
                if (docSnap.exists()) {
                    setForm(docSnap.data());
                }
            } catch (error) {
                console.error('Error fetching promo:', error);
            }
        };
        fetchPromo();
    }, []);


    const handleSubmit = async () => {
        setLoading(true);

        if (!form.image || !form.title.trim()) {
            Alert.alert("Error", "Semua field wajib diisi!");
            setLoading(false);
            return;
        }

        try {
            // Upload foto ke Cloudinary
            let imageUrl: any = form.image;

            // Deteksi apakah image adalah file (bukan string URL)
            if (typeof form.image !== 'string') {
                // Upload foto baru ke Cloudinary
                imageUrl = await postImage({ image: form.image });

                if (!imageUrl) {
                    Alert.alert("Error", "Upload gambar gagal. Coba lagi!");
                    setLoading(false);
                    return;
                }
            }

            // Simpan ke Firestore
            await updateDoc(doc(db, "facilities", id), {
                ...form,
                icon: imageUrl,
                createdAt: new Date(),
            });

            Alert.alert("Sukses", "Fasilitas berhasil ditambahkan!");
            setForm({
                image: null,
                title: '',
            });
            router.push('/(tabs)/admin/facilities'); // Sesuaikan dengan route yang benar
        } catch (error) {
            console.error("Error saving facility:", error);
            Alert.alert("Error", "Gagal menambahkan fasilitas.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className='flex-1 bg-white'>
            {/* Header */}
            <View className='p-5 flex-row items-center mt-10 justify-between'>
                <MaterialIcons onPress={() => router.back()} name="arrow-back-ios" size={24} color="#205072" />
                <Text className='text-[#205072] text-lg font-medium'>Edit Fasilitas</Text>
                <Text>{''}</Text>
            </View>

            {/* Upload Gambar */}
            <KeyboardAvoidingView className='p-5'>
                <Text className='mb-3 text-gray-600'>Gambar Fasilitas</Text>
                <TouchableOpacity
                    onPress={handlePickImage}
                    className='w-full h-40 rounded-xl justify-center items-center border-2 border-gray-200 relative'
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
                                onPress={() => handleChange('image', null)}
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

            {/* Input Nama Fasilitas */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Nama Fasilitas</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                    placeholder="Masukkan nama fasilitas"
                />
            </View>

            {/* Tombol Simpan */}
            <View className='flex justify-center items-center p-5'>
                <TouchableOpacity onPress={handleSubmit} className='p-3 bg-[#FEDD3F] rounded-xl w-full'>
                    {loading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text className='text-center text-[#205072] font-medium'>Simpan</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default EditFacilities;
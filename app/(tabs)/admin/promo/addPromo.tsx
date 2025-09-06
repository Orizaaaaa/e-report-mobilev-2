import { postImage } from '@/database/cloudinary';
import { db } from '@/database/firebase';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { addDoc, collection } from 'firebase/firestore';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native';
import { Image, View } from 'react-native-animatable';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { ActivityIndicator } from 'react-native-paper';

type Props = {}

const AddPromo = (props: Props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        image: null as string | null,
        title: '',
        start_periode: '',
        end_periode: '',
        real_price: 0,
        price_promo: 0,
        description: ''
    });

    const handleChange = (key: keyof typeof form, value: string | number | null) => {
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
        setLoading(true);

        // Validasi semua field
        if (
            !form.image ||
            !form.title.trim() ||
            !form.start_periode.trim() ||
            !form.end_periode.trim() ||
            !form.real_price ||
            !form.price_promo ||
            !form.description.trim()
        ) {
            Alert.alert("Error", "Semua field wajib diisi!");
            setLoading(false);
            return;
        }

        try {
            // Upload foto ke Cloudinary
            const imageUrl = await postImage({ image: form.image });

            if (!imageUrl) {
                Alert.alert("Error", "Upload gambar gagal. Coba lagi!");
                setLoading(false);
                return;
            }

            // Simpan ke Firestore
            await addDoc(collection(db, "promo"), {
                title: form.title,
                image: imageUrl,
                start_periode: form.start_periode,
                end_periode: form.end_periode,
                real_price: form.real_price,
                price_promo: form.price_promo,
                description: form.description,
                createdAt: new Date(),
            });

            Alert.alert("Sukses", "Promo berhasil disimpan!");
            setForm({
                image: null,
                title: "",
                start_periode: "",
                end_periode: "",
                real_price: 0,
                price_promo: 0,
                description: "",
            });
            router.back(); // Kembali ke halaman sebelumnya
        } catch (error) {
            console.error("Error saving promo:", error);
            Alert.alert("Error", "Gagal menyimpan promo.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Header */}
            <View className='p-5 flex-row items-center mt-10 justify-between'>
                <MaterialIcons onPress={() => router.back()} name="arrow-back-ios" size={24} color="#205072" />
                <Text className='text-[#205072] text-lg font-medium'>Tambah Promo</Text>
                <Text>{''}</Text>
            </View>

            {/* Upload Gambar Promo */}
            <KeyboardAvoidingView className='p-5'>
                <Text className='mb-3 text-gray-600'>Gambar Promo</Text>
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

            {/* Judul Promo */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Judul Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.title}
                    onChangeText={(text) => handleChange('title', text)}
                    placeholder="Masukkan judul promo"
                />
            </View>

            {/* Periode Mulai */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Periode Mulai</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.start_periode}
                    onChangeText={(text) => handleChange('start_periode', text)}
                    placeholder="Contoh: 27 Agustus 2025"
                />
            </View>

            {/* Periode Selesai */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Periode Selesai</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.end_periode}
                    onChangeText={(text) => handleChange('end_periode', text)}
                    placeholder="Contoh: 30 Agustus 2025"
                />
            </View>

            {/* Harga Asli */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Harga Asli</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    keyboardType="numeric"
                    value={form.real_price.toString()}
                    onChangeText={(text) => handleChange('real_price', Number(text))}
                    placeholder="Masukkan harga asli"
                />
            </View>

            {/* Harga Promo */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Harga Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    keyboardType="numeric"
                    value={form.price_promo.toString()}
                    onChangeText={(text) => handleChange('price_promo', Number(text))}
                    placeholder="Masukkan harga promo"
                />
            </View>

            {/* Deskripsi */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Deskripsi Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.description}
                    onChangeText={(text) => handleChange('description', text)}
                    placeholder="Masukkan deskripsi promo"
                    multiline
                    numberOfLines={4}
                />
            </View>

            {/* Tombol Simpan */}
            <View className='flex justify-center items-center p-5'>
                <TouchableOpacity
                    onPress={handleSubmit}
                    className='p-3 bg-[#FEDD3F] rounded-xl w-full'
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#205072" />
                    ) : (
                        <Text className='text-center text-[#205072] font-medium'>Simpan Promo</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default AddPromo;
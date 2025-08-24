import { db, storage } from '@/database/firebase'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { addDoc, collection } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native'
import { Image, View } from 'react-native-animatable'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'
type Props = {}

const add_promo = (props: Props) => {
    const { edit } = useLocalSearchParams<{ edit: string }>();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        image: null,
        title: '',
        start_periode: '',
        end_periode: '',
        real_price: 0,
        price_promo: 0,
        des: ''

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
            !form.start_periode.trim() ||
            !form.end_periode.trim() ||
            !form.real_price ||
            !form.price_promo ||
            !form.des.trim()
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
                start_periode: "",
                end_periode: "",
                real_price: 0,
                price_promo: 0,
                des: "",
            });
            setLoading(false);
        } catch (error) {
            console.error("Error saving promo:", error);
            Alert.alert("Error", "Gagal menyimpan promo.");
            setLoading(false);
        }
    };

    console.log(form);

    return (
        <ScrollView>
            <View className='p-5 flex-row items-center mt-10 justify-between' >
                <MaterialIcons onPress={() => router.back()} name="arrow-back-ios" size={24} color="#205072" />
                <Text className='text-[#205072] text-lg font-medium' >Edit Promo</Text>
                <Text>{''}</Text>
            </View>
            <KeyboardAvoidingView className='p-5 ' >
                <Text className='mb-3 text-gray-600' >Foto Promo</Text>
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
                <Text className='mb-1 text-gray-600'>Judul Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                />
            </View>

            {/* Start Periode */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Periode Mulai</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.start_periode}
                    onChangeText={(text) => setForm({ ...form, start_periode: text })}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            {/* End Periode */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Periode Selesai</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.end_periode}
                    onChangeText={(text) => setForm({ ...form, end_periode: text })}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            {/* Real Price */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Harga Asli</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    keyboardType="numeric"
                    value={form.real_price.toString()}
                    onChangeText={(text) => setForm({ ...form, real_price: Number(text) })}
                />
            </View>

            {/* Price Promo */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Harga Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    keyboardType="numeric"
                    value={form.price_promo.toString()}
                    onChangeText={(text) => setForm({ ...form, price_promo: Number(text) })}
                />
            </View>

            {/* Description */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Deskripsi</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.des}
                    onChangeText={(text) => setForm({ ...form, des: text })}
                    multiline
                    numberOfLines={4}
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

export default add_promo
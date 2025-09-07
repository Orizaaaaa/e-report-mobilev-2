import { postImage } from '@/database/cloudinary'
import { db } from '@/database/firebase'
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Text, TouchableOpacity } from 'react-native'
import { Image, View } from 'react-native-animatable'
import { ScrollView, TextInput } from 'react-native-gesture-handler'
import { ActivityIndicator } from 'react-native-paper'
type Props = {}

const add_promo = (props: Props) => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const promoId = id
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        image: null,
        title: '',
        start_periode: '',
        end_periode: '',
        real_price: 0,
        price_promo: 0,
        description: ''

    });

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const docRef = doc(db, 'promo', id);
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

    const handleEdit = async () => {
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

            // Update data di Firestore
            await updateDoc(doc(db, "promo", promoId), {
                title: form.title,
                image: imageUrl,
                start_periode: form.start_periode,
                end_periode: form.end_periode,
                real_price: form.real_price,
                price_promo: form.price_promo,
                description: form.description,
                updatedAt: new Date(),
            });

            Alert.alert("Sukses", "Promo berhasil diupdate!");
            router.back(); // Kembali ke halaman sebelumnya
        } catch (error) {
            console.error("Error updating promo:", error);
            Alert.alert("Error", "Gagal mengupdate promo.");
        } finally {
            setLoading(false);
        }
    };

    console.log(form);
    console.log('edit', id);


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
                    value={form.description}
                    onChangeText={(text) => setForm({ ...form, description: text })}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View className='flex justify-center items-center p-5' >
                <TouchableOpacity onPress={handleEdit} className='p-3 bg-[#FEDD3F] rounded-xl w-full' >
                    {loading ? <ActivityIndicator size="small" color="white" />
                        : <Text className='text-center text-[#205072] font-medium' >Simpan</Text>}

                </TouchableOpacity>
            </View>


        </ScrollView>
    )
}

export default add_promo
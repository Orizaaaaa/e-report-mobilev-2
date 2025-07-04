import { sendNotificationToRole, uploadOneImageToStorage } from '@/api/api'
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary'
import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import DescriptionInput from '@/components/elements/Input/DescriptionInput'
import { db } from '@/lib/firebase/firebase'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { addDoc, collection } from 'firebase/firestore'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import { Calendar } from 'react-native-calendars'

type Props = {}

const AddContest = (props: Props) => {
    const [form, setForm] = useState({
        image: '' as string, // URI dari gambar
        desc: '',
        audiens: 0,
        userAudiens: [],
        location: '',
        date: '',
    });

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["60%"], []);
    const [selected, setSelected] = useState('');

    // Fungsi handleChange untuk memperbarui state form
    const handleChange = (key: keyof typeof form, value: string | number) => {
        setForm(prev => ({ ...prev, [key]: value }));
    };

    // Fungsi untuk memilih gambar dengan expo-image-picker
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

    // Fungsi untuk memformat tanggal ke format dd-MM-yyyy
    const formatDate = (day: { day: number; month: number; year: number }) => {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${pad(day.day)}-${pad(day.month)}-${day.year}`;
    };

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);
    console.log(form);

    const router = useRouter();

    const handleCreateContest = async () => {
        if (!form.image || !form.desc || !form.date || !form.audiens) {
            alert('Mohon lengkapi semua data lomba');
            return;
        }

        try {
            const userStr = await AsyncStorage.getItem('user');
            const currentUser = userStr ? JSON.parse(userStr) : null;
            const uid = currentUser?.uid;

            if (!uid) {
                alert('User tidak ditemukan');
                return;
            }

            const downloadURL = await uploadOneImageToStorage(form.image, uid);

            await addDoc(collection(db, 'contest'), {
                image: downloadURL,
                desc: form.desc,
                date: form.date,
                audiens: form.audiens,
                userAudiens: form.userAudiens,
                location: form.location,
                createdAt: new Date(), // ✅ Gunakan Date bukan string
            });

            await addDoc(collection(db, 'notifications'), {
                title: 'Lomba baru telah dibuat',
                body: `Ada lomba baru telah dibuat, yaitu ${form.desc}`,
                toRole: 'user',
                typeNotif: 'contest',
                image: currentUser.image || 'image empety',
                fromUid: currentUser.uid,
                createdAt: new Date().toISOString(),
                read: false,
                userName: 'Admin'
            });

            await sendNotificationToRole('user', '📢 Lomba baru telah dibuat!');

            setForm({
                image: '',
                desc: '',
                audiens: 0,
                date: '',
                userAudiens: [],
                location: '',
            });

            alert('Lomba berhasil dibuat!');
            router.push('/admin/contest');
        } catch (error) {
            console.error('❌ Gagal membuat lomba:', error);
            alert('Terjadi kesalahan saat membuat lomba.');
        }
    };


    return (
        <SafeAreaView className='flex-1'>
            <ScrollView className='pt-16 px-3'>
                <View className='flex-row items-center justify-between'>
                    <ButtonBack />
                    <Text className='text-lg font-medium'>Buat Lomba Baru</Text>
                    <Text>{''}</Text>
                </View>

                {/* Upload Gambar */}
                <View className='mt-7'>
                    <Text className='text-gray-500 mb-2'>Masukan Gambar Lomba</Text>
                    <TouchableOpacity
                        onPress={handlePickImage}
                        className='w-full h-40 rounded-xl justify-center items-center border-2 border-dotted border-gray-400 relative'
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
                </View>


                <DescriptionInput
                    title='Masukan Deskripsi Lomba'
                    placeholderText='(Contoh) Lomba fotografi berhadiah...'
                    value={form.desc}
                    onChangeText={(text) => handleChange('desc', text)}
                />

                <View className='mt-7'>
                    <Text className='mb-2 text-gray-500'>Lokasi</Text>
                    <TextInput
                        className='border-2 border-gray-300 rounded-lg p-3 w-full'
                        value={form.location}
                        onChangeText={(text) => handleChange('location', text)}
                    />
                </View>

                <View className='flex-row justify-between w-full mt-7'>
                    <View className='w-[48%]'>
                        <Text className='mb-2 text-gray-500'>Jumlah Peserta</Text>
                        <TextInput
                            className='border-2 border-gray-300 rounded-lg p-3 w-full'
                            keyboardType="numeric"
                            value={form.audiens.toString()}
                            onChangeText={(text) => handleChange('audiens', parseInt(text) || 0)}
                        />
                    </View>
                    <View className='w-[48%]'>
                        <Text className='mb-2 text-gray-500'>Tanggal Mulai</Text>
                        <TouchableOpacity
                            onPress={openBottomSheet}
                            className='border-2 border-gray-300 rounded-lg p-3 w-full h-auto flex-row items-center gap-3'
                        >
                            <Ionicons name="time-outline" size={18} color="black" />
                            <Text>{form.date || 'Pilih tanggal'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View className='mt-7 flex-row'>
                    <ButtonPrimary
                        className='w-fit py-2 px-3 rounded-lg'
                        text='Buat Lomba'
                        onPress={handleCreateContest}
                    />
                </View>
            </ScrollView>

            {/* Kalender */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
            >
                <BottomSheetView className="p-4">
                    <Calendar
                        onDayPress={day => {
                            setSelected(day.dateString);
                            // Menggunakan helper formatDate untuk memformat tanggal
                            const formatted = formatDate({ day: day.day, month: day.month, year: day.year });
                            handleChange('date', formatted);
                            bottomSheetRef.current?.close();
                        }}
                        markedDates={{
                            [selected]: {
                                selected: true,
                                disableTouchEvent: true,
                                selectedColor: '#1E2A38'
                            }
                        }}
                        theme={{
                            selectedDayBackgroundColor: '#1E2A38',
                            todayTextColor: '#1E2A38',
                            arrowColor: '#1E2A38',
                        }}
                    />
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    );
};

export default AddContest;

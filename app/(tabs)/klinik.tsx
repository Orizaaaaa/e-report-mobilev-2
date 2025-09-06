import { MaterialCommunityIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const { height } = Dimensions.get('window');



type Top3Item = {
    label: string
    probability: string
}

type PredictionResult = {
    predicted_class: string
    confidence: string
    top_3_predictions: Top3Item[]
    probabilities: Record<string, string>
}


export default function Klinik() {


    // bottom sheet
    const handlePress = () => {
        // Navigasi ke halaman detail dengan ID
        router.push(`/report/21`);
    };

    const bottomSheetRef = useRef<BottomSheet>(null);

    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const snapPoints = useMemo(() => ['70%', '100%'], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    }

    // predict image
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [result, setResult] = useState<PredictionResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)

    const insets = useSafeAreaInsets()

    const pickImage = async (fromCamera = false) => {
        const perm = fromCamera
            ? await ImagePicker.requestCameraPermissionsAsync()
            : await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (!perm.granted) {
            alert(`Permission to access ${fromCamera ? 'camera' : 'gallery'} denied`)
            return
        }

        const pickerRes = fromCamera
            ? await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: false,
                aspect: [1, 1],
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: false,
                aspect: [1, 1],
            })

        if (!pickerRes.canceled && pickerRes.assets.length > 0) {
            setImage(pickerRes.assets[0])
            setResult(null)
        }
    }

    const uploadImage = async () => {
        if (!image) return
        setLoading(true)

        const formData = new FormData()
        formData.append('image', {
            uri: image.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        } as any)

        try {
            const res = await fetch('https://3b83-114-10-147-66.ngrok-free.app/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'multipart/form-data' },
                body: formData,
            })

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)

            const json: PredictionResult = await res.json()
            setResult(json)
            setModalVisible(true)
        } catch (e) {
            console.error(e)
            alert('Failed to get prediction')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (image) {
            openBottomSheet()
        }
    }, [image])

    const screenWidth = Dimensions.get('window').width;
    const boxWidth = (screenWidth - 60) / 2; // Adjust spacing as needed

    return (

        <SafeAreaView>
            <ScrollView>
                <View className="bg-white " style={{ minHeight: Dimensions.get('window').height }}>
                    <View className='relative bg-[#2AA8E1] h-60  mb-80'>
                        <View className='flex justify-center items-center pt-12 px-3'>
                            <View className='flex-row items-center w-full p-1'>
                                <View className='w-14 h-14 rounded-xl mx-2'>
                                    <Image
                                        className='w-full h-full rounded-full'
                                        source={require('../../assets/images/human.png')}
                                        resizeMode='cover'
                                    />
                                </View>

                                <View className="gap-3 flex-col" >
                                    <View className="flex-col gap-1">
                                        <Text className="text-lg font-semibold text-white">Hi, Gabriel Yonathan</Text>
                                        <Text className="text-sm font-extralight text-white">23 Tahun</Text>
                                    </View>
                                </View>
                            </View>

                            <View className='absolute top-28 rounded-2xl mt-5 overflow-hidden flex flex-row-reverse shadow-md shadow-black'>
                                <View className='bg-white'>

                                    <View className='w-full h-48'>
                                        <Image
                                            className='w-full h-full'
                                            source={require('../../assets/images/klinik.png')}
                                            resizeMode='cover'
                                        />
                                    </View>
                                    {/* Konten di bawah */}
                                    <View className='p-5'>
                                        <Text className='text-primaryNavy text-xl text-center px-20 font-semibold mb-2'>Klinik Harum Utama</Text>
                                        <View className='flex-row gap-1 mt-2 px-2'>
                                            <MaterialCommunityIcons
                                                name='map-marker'
                                                size={25}
                                                color='#2AA8E1'
                                            />
                                            <Text className='text-primaryNavy text-sm ml-2'>JL.Peneropongan Bintang No.1 Lembang</Text>
                                        </View>

                                        <View className='flex-row gap-1 mt-2 px-2'>
                                            <MaterialCommunityIcons
                                                name='phone'
                                                size={25}
                                                color='#2AA8E1'
                                            />
                                            <Text className='text-primaryNavy text-sm ml-2'>081111114070</Text>
                                        </View>

                                        <View className='flex-row gap-1 mt-2 px-2'>
                                            <MaterialCommunityIcons
                                                name='calendar'
                                                size={25}
                                                color='#2AA8E1'
                                            />
                                            <Text className='text-primaryNavy text-sm ml-2'>Senin - Sabtu</Text>
                                        </View>

                                        <View className='flex-row gap-1 mt-2 px-2'>
                                            <MaterialCommunityIcons
                                                name='clock-outline'
                                                size={25}
                                                color='#2AA8E1'
                                            />
                                            <Text className='text-primaryNavy text-sm ml-2'>07.00 - 18.00 WIB</Text>
                                        </View>



                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                    {/* koding nya di sini tod */}
                    <View className='mt-5'>
                        <View className="flex-row justify-center items-center">
                            <TouchableOpacity onPress={() => router.push('/dokter')}
                                className="m-2 rounded-xl bg-[#FEDD3F]"
                                style={{ width: boxWidth, height: 130 }}
                            >
                                <View className="p-5 mt-2 flex-col justify-center items-center">
                                    <Image
                                        className="mb-1"
                                        style={{ width: '100%', height: 50 }}
                                        source={require('../../assets/images/medical-assistance.png')}
                                        resizeMode="contain"
                                    />
                                    <Text className="text-center mt-2 text-xl font-bold text-[#205072]">Dokter</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.push('/fasilitas')}
                                className="m-2 rounded-xl bg-[#FEDD3F]"
                                style={{ width: boxWidth, height: 130 }}
                            >
                                <View className="p-5 mt-3 flex-col justify-center items-center">
                                    <Image
                                        className="mb-1"
                                        style={{ width: '100%', height: 50 }}
                                        source={require('../../assets/images/building.png')}
                                        resizeMode="contain"
                                    />
                                    <Text className="text-center mt-2 text-xl font-bold text-[#205072]">Fasilitas</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View className="flex-row justify-center items-center">
                            <TouchableOpacity onPress={() => router.push('/promo')}
                                className="m-2 rounded-xl bg-[#FEDD3F]"
                                style={{ width: boxWidth, height: 130 }}
                            >
                                <View className="p-5 mt-3 flex-col justify-center items-center">
                                    <Image
                                        className="mb-1"
                                        style={{ width: '100%', height: 50 }}
                                        source={require('../../assets/images/megaphone.png')}
                                        resizeMode="contain"
                                    />
                                    <Text className="text-center mt-2 text-xl font-bold text-[#205072]">Promo</Text>

                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => router.push('/testimoni')}
                                className="m-2 rounded-xl bg-[#FEDD3F]"
                                style={{ width: boxWidth, height: 130 }}
                            >
                                <View className="p-5 mt-3 flex-col justify-center items-center">
                                    <Image
                                        className="mb-1"
                                        style={{ width: '100%', height: 50 }}
                                        source={require('../../assets/images/chat.png')}
                                        resizeMode="contain"
                                    />
                                    <Text className="text-center mt-2 text-xl font-bold text-[#205072]">Testimoni</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


            </ScrollView >
        </SafeAreaView >
    );


}



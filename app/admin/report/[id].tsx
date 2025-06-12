import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import DetailReport from '@/components/fragments/DetailReport/DetailReport'
import { FontAwesome, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { SafeAreaView } from 'react-native-safe-area-context'
type Props = {}

const ReportDetailAdmin = (props: Props) => {

    const [form, setForm] = useState({
        status: '',
        image: '' as string, // URI dari gambar
        reason: '',
    });

    const imagesCaraosel = [
        require('../../../assets/images/demo.png'),
        require('../../../assets/images/study1.png'),
        require('../../../assets/images/demo.png'),
    ];

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["30%"], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
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



    const handleSelectStatus = (status: string) => {
        setForm(prev => ({ ...prev, status: status }));
    }

    console.log(form);


    const renderAdditionalField = () => {
        if (form.status === 'Selesai') {
            return (
                <View className="mt-4">
                    <Text className='text-gray-500 mb-2'>Masukan Bukti Penyelesaian</Text>
                    <TouchableOpacity
                        onPress={handlePickImage}
                        className='w-full h-48 rounded-xl justify-center items-center border-2 border-dotted border-gray-400 relative'
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
            );
        }
        if (form.status === 'Tidak valid') {
            return (
                <View className="mt-4">
                    <Text className="text-sm font-semibold mb-1">Alasan:</Text>
                    <TextInput
                        placeholder="Masukkan alasan kenapa tidak valid"
                        value={form.reason}
                        onChangeText={handleChange.bind(null, 'reason')}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </View>
            );
        }
        return null;
    }



    const statuses = ['Menunggu', 'Di proses', 'Selesai', 'Tidak valid'];

    return (
        <SafeAreaView className='flex-1 pt-5'>
            <ScrollView className='px-3'>
                <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full">
                    <ButtonBack colorIcon="#FF840C" />
                    <Octicons name="report" size={20} color="gray" />
                </View>
                <DetailReport imageCaraosel={imagesCaraosel} />

                <View className='flex-row mt-5' >
                    <TouchableOpacity className='flex-row items-center gap-2 mt-4 bg-primaryNavy py-2 px-4 rounded-full ' onPress={openBottomSheet}>
                        <MaterialIcons name="pending-actions" size={20} color="white" />
                        <Text className='text-white' >Tindak</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
            >
                <BottomSheetView className="p-4">
                    <Text className="text-lg font-semibold mb-4">Tindak Laporan</Text>

                    {statuses.map((status) => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => handleSelectStatus(status)}
                            className="flex-row items-center mb-3"
                        >
                            <View className={`w-6 h-6 rounded-full border-2 mr-2 ${form.status === status ? 'border-gray-400 bg-primaryNavy' : 'border-gray-400'}`} />
                            <Text className="text-base">{status}</Text>
                        </TouchableOpacity>
                    ))}

                    {renderAdditionalField()}

                    <TouchableOpacity className="mt-6 bg-primaryNavy rounded-full py-3 items-center">
                        <Text className="text-white font-semibold">Simpan Status</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    )
}

export default ReportDetailAdmin
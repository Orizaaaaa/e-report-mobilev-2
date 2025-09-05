import CardReportScroll from '@/components/fragments/CardReport/CardReportScroll';
import Promo from '@/components/fragments/IndicatorInfo/Promo';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState, } from "react";
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ActivityIndicator, Button, Card } from 'react-native-paper';
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


export default function Home() {


    // bottom sheet
    const handlePress = (id: number) => {
        // Navigasi ke halaman detail dengan ID
        router.push(`/artikel/${id}`);
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

    const styles = StyleSheet.create({
        scroll: {
            flex: 1,
            backgroundColor: '#E6F5F3',
        },
        container: {
            padding: 20,
            alignItems: 'center',
            paddingBottom: 60,
        },
        header: {
            marginBottom: 30,
            fontWeight: 'bold',
            color: '#007F7F',
        },
        btnGroup: {
            width: '100%',
            gap: 10,
            marginBottom: 20,
        },
        button: {
            backgroundColor: '#00A8A8',
            borderRadius: 8,
        },
        buttonLabel: {
            fontSize: 16,
            color: 'white',
        },
        imageCard: {
            width: '100%',
            borderRadius: 10,
            // overflow: 'hidden',
            marginBottom: 20,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
        },
        image: {
            height: 220,
        },
        modalContent: {
            backgroundColor: 'white',
            padding: 20,
            marginHorizontal: 20,
            borderRadius: 12,
            elevation: 10,
        },
        sectionTitle: {
            marginTop: 15,
            fontWeight: 'bold',
            fontSize: 16,
            color: '#007F7F',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#007F7F',
            marginBottom: 8,
        },
        modalText: {
            fontSize: 15,
            color: '#333',
            marginVertical: 2,
        },
    })

    return (

        <SafeAreaView>
            <ScrollView  >
                <View className="bg-white pb-10">
                    <View className='relative bg-[#2AA8E1] h-60  mb-32'>
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
                            {/* <View className='absolute bg-gray-500 p-10 top-5'>
              </View> */}

                            <View className=' h-52 absolute top-28 rounded-2xl mt-5 overflow-hidden flex flex-row-reverse shadow-md shadow-black'>
                                <View className='bg-white'>

                                    {/* Konten di bawah */}
                                    <View className='p-5'>
                                        <View className='flex-row justify-center items-center'>
                                            <View className='w-24 h-24 mr-6'>
                                                <Image
                                                    className='w-full h-full'
                                                    source={require('../../assets/images/tooth.png')}
                                                    resizeMode='cover'
                                                />
                                            </View>

                                            <View className='flex-col'>
                                                <Text className='text-primaryNavy text-xl font-semibold'>Yuk mulai deteksi</Text>
                                                <Text className='text-primaryNavy text-xl font-semibold'>gigimu sekarang!</Text>
                                            </View>
                                        </View>


                                        <Text onPress={() => (router.push("/predict"))} className='text-center mt-5 text-lg py-3 px-16 border border-[#F7CD00] text-black font-semibold rounded-2xl'>Deteksi Kesehatan Gigi</Text>

                                    </View>
                                </View>
                            </View>

                        </View>
                    </View>

                    <View className='flex-row justify-center items-center px-3 mb-2'>
                        <View className='w-48 h-36 mr-2 rounded-xl text-center bg-[#FDEFB2]'>
                            <View className='m-5 flex-col justify-center'>
                                <Text className='text-primaryNavy text-sm font-semibold'>Riwayat Pemeriksaan Terakhir</Text>
                                <Text className='text-primaryNavy text-xl font-semibold py-2'>25 Juni 2025</Text>
                                <Text className='text-slate-500 text-sm font-thin italic'>Gigi Berlubang</Text>
                            </View>
                        </View>

                        <View className='w-60 h-36 rounded-xl bg-[#FDEFB2]'>
                            <View className='mx-3 mt-3 flex-col justify-center'>
                                <View className='flex-row'>
                                    <Image
                                        className='w-5 h-6 mr-2 mb-1'
                                        source={require('../../assets/images/gigi_biru.png')}
                                        resizeMode='contain'
                                    />
                                    <Text className='text-primaryNavy mb-2 text-md font-semibold'>Tips Hari Ini</Text>
                                </View>
                                <Text className='text-primaryNavy mb-1 text-sm font-bold'>Sikat Gigi Minimal 2x Sehari</Text>
                                <Text className='text-slate-500 text-wrap text-sm font-thin italic'>Menyikat gigi pagi dan malam membantu mencegah plak dan gigi berlubang.</Text>
                            </View>
                        </View>
                    </View>


                    <View style={{ overflow: 'visible' }}>
                        <Promo handlePress={() => handlePress(20)} />
                    </View>


                    <View className='px-5 mb-1 mt-2'>
                        <View className='flex-row justify-between items-center px-1 mb-2'>
                            <Text className='text-black font-semibold'>Artikel Kesehatan GIgi</Text>
                            <TouchableOpacity
                            // onPress={handlePress}
                            >
                                <Text className='text-primaryNavy font-semibold'>Lihat Semua</Text>
                            </TouchableOpacity>

                        </View>


                        <CardReportScroll image={require('../../assets/images/artikle3.avif')} handlepres={() => handlePress(1)} title='Cara Menyikat Gigi Yang Baik dan Benar Untuk Seluruh Keluarga' description='Kita mungkin sudah menyikat gigi secara teratur, tapi apakah kita sudah melakukannya dengan benar? Simak cara menyikat gigi dengan benar, untuk Anda dan keluarga Anda' />
                        <CardReportScroll image={require('../../assets/images/artikle1.jpeg')} handlepres={() => handlePress(2)} title='Apakah ibu hamil perlu rutin periksa gigi?' description='Di masa kehamilan , bukan hanya fisik dan mental yang harus diperhatikan, namun  kesehatan gigi dan mulut juga harus di perhatikan. Karena penyakit pada gigi dan mulut, seperti gigi berlubang dan radang gusi sering diderita oleh ibu hamil.' />
                        <CardReportScroll image={require('../../assets/images/artikle2.jpg')} handlepres={() => handlePress(3)} title='Kapan Waktu yang Tepat Bawa Anak ke Dokter Gigi?' description='Kesehatan gigi dan mulut anak merupakan aspek penting dalam pertumbuhan dan perkembangan mereka. Salah satu pertanyaan yang sering muncul di benak orangtua adalah kapan waktu yang tepat untuk membawa anak ke dokter gigi.' />
                    </View>
                </View>


                <BottomSheet
                    index={-1}
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose
                    onChange={handleSheetChanges}
                >
                    <BottomSheetView >

                        {image && (
                            <Card style={styles.imageCard}>
                                <Card.Cover source={{ uri: image.uri }} style={styles.image} />
                                <Card.Actions>
                                    <Button
                                        mode="contained-tonal"
                                        onPress={uploadImage}
                                        disabled={loading}
                                        labelStyle={{ fontSize: 16 }}
                                    >
                                        {loading ? 'Predicting...' : '🔍 Predict'}
                                    </Button>
                                    {loading && <ActivityIndicator style={{ marginLeft: 10 }} />}
                                </Card.Actions>
                            </Card>
                        )}

                        {result && (
                            <View>
                                <Text style={styles.modalTitle}>
                                    Predicted: {result.predicted_class}
                                </Text>
                                <Text style={styles.modalText}>
                                    Confidence: {result.confidence}
                                </Text>

                                <Text style={styles.sectionTitle}>Top 3 Predictions:</Text>
                                {result.top_3_predictions.map((item, i) => (
                                    <Text key={i} style={styles.modalText}>
                                        {i + 1}. {item.label} - {item.probability}
                                    </Text>
                                ))}

                                <Text style={styles.sectionTitle}>All Probabilities:</Text>
                                {Object.entries(result.probabilities).map(([label, prob]) => (
                                    <Text key={label} style={styles.modalText}>
                                        {label}: {prob}
                                    </Text>
                                ))}
                            </View>
                        )}
                    </BottomSheetView>
                </BottomSheet>
            </ScrollView >


        </SafeAreaView >
    );


}



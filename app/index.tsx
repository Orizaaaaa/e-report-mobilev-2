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


export default function Index() {


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
      <ScrollView className='pt-12 px-3 bg-white' contentContainerStyle={{ paddingBottom: 100 }} >
        <View className="mb-40">

          <View className='flex-row items-center w-full justify-between p-1    ' >

            <View className="gap-3 flex-col" >
              <View className="flex-col gap-1">
                <Text className="text-xl font-semibold text-secondaryBlue">Hi, Gabriel Yonathan</Text>
                <Text className="text-sm text-secondaryBlue/50">Pamulang, Benda Baru, Tangerang Selatan </Text>
              </View>
            </View>

            <View className='w-14 h-14  rounded-xl   '>
              <Image
                className='w-full h-full rounded-full'
                source={require('../assets/images/human.png')}
                resizeMode='cover'
              />
            </View>

          </View>


          <View className='w-50 h-60 rounded-3xl mt-5 overflow-hidden relative flex flex-row-reverse'>
            <View className='absolute inset-0 bg-primaryBlue/20' >

              {/* Patern */}

              {/* 
            <View className="absolute -top-5 -right-35 w-52 h-52 bg-primaryBlue/20 rounded-full" />
            <View className="absolute -bottom-10 -left-10 w-40 h-40 bg-primaryBlue/20 rounded-full" />
            <View className="absolute top-10 right-20 w-32 h-32 bg-primaryBlue/60 rounded-full" /> */}

              {/* Gambar
            <Image
              className='w-52 h-56 mr-15'
              source={require('../assets/images/doctor.png')}
              resizeMode='cover'
            /> */}

              {/* Overlay hitam */}

              {/* Konten di bawah */}
              <View className=' bottom-0 top-0 left-0 right-0 p-5'>
                <Text className='text-secondaryBlue text-lg font-bold'>Deteksi <Text className='text-secondaryBlue' >Penyakit Gigi</Text> </Text>
                <Text className='text-secondaryBlue text-xs'>Fitur AI untuk Analisis</Text>
                <Text className='text-secondaryBlue text-xs'>Penyakit Gigi</Text>

                <View className='flex-row top-5 justify-between mt-3'>
                  <View className='flex-1 top-12 left-0 right-0'>
                    <Text onPress={() => (router.push("/predict"))} className='text-center text-sm py-5 px-20 bg-primaryBlue text-white rounded-2xl'>Cek Sekarang </Text>
                  </View>

                  {/* <View className="flex-1 top-12 left-0 right-0 items-center">
                    <LinearGradient
                      colors={['#00A8A8', '#007F7F']} // Atur sesuai warna gradient yang Anda mau
                      start={[0, 0]}
                      end={[1, 0]}
                      style={{
                        borderRadius: 20,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => router.push("/predict")}
                        style={{
                          paddingVertical: 14,
                          paddingHorizontal: 40,
                          borderRadius: 20,
                          alignItems: 'center',
                        }}
                      >
                        <Text className="text-white text-sm text-center">Cek Sekarang</Text>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                   */}
                </View>
              </View>
            </View>

          </View>

          {/* <View className='flex-row justify-between items-center mt-7 px-1 mb-5'>
            <Text className='text-primaryNavy font-bold'>Artikel Kesehatan GIgi</Text>
          </View> */}


          <View style={{ overflow: 'visible' }}>
            <Promo handlePress={handlePress} />
          </View>





          {/* <IndicatorInfo finised='177' onProgress='44' total='221' /> */}


          {/* laporan */}
          <View>
            {/* <View className='flex-row justify-between items-center mt-7 px-1'>
            <Text className='text-primaryNavy font-bold'>Artikel Kesehatan GIgi</Text>
            <TouchableOpacity
              onPress={handlePress}
            >
              <Text className='text-gray-400'>Lihat Semua</Text>
            </TouchableOpacity>

          </View>

          <ScrollView className='mt-5 overflow-x-hidden' showsHorizontalScrollIndicator={false} horizontal={true} >
            <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
            <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
            <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
          </ScrollView> */}


            {/* <View className='flex-row justify-between items-center mt-7 px-1'>
              <TouchableOpacity className='bg-primaryBlue  p-4 rounded-3xl' onPress={() => pickImage(true)}>
                <Text className='text-tertiaryBlue'>prediksi gambar dari kamera</Text>
              </TouchableOpacity>

              <TouchableOpacity className='bg-primaryBlue  p-4 rounded-lg' onPress={() => pickImage(false)}  >
                <Text>prediksi dari galeri</Text>
              </TouchableOpacity>
            </View> */}

            <View className='flex-row justify-between items-center mt-2 px-1'>
              <Text className='text-primaryNavy font-bold'>Artikel Kesehatan GIgi</Text>
              <TouchableOpacity
                onPress={handlePress}
              >
                <Text className='text-primaryBlue/50 font-bold'>Lihat Semua</Text>
              </TouchableOpacity>

            </View>

            <CardReportScroll image={require('../assets/images/demo.png')} handlepres={handlePress} />
            <CardReportScroll image={require('../assets/images/demo.png')} handlepres={handlePress} />
            <CardReportScroll image={require('../assets/images/demo.png')} handlepres={handlePress} />

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
      {/* <View style={{ position: 'absolute', bottom: insets.bottom + 10, left: 0, right: 0, paddingHorizontal: 16 }}>
        <FAB
          icon="camera"
          label="Ambil Foto"
          onPress={() => pickImage(true)}
          style={{ backgroundColor: '#00A8A8' }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >

      </View> */}

    </SafeAreaView>
  );


}



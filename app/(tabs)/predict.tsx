import { MaterialCommunityIcons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {
    ActivityIndicator,
    Button,
    Card,
    Modal,
    PaperProvider,
    Portal
} from 'react-native-paper'
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context'

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

const AppContent = () => {
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
                allowsEditing: true,
                aspect: [1, 1],
            })
            : await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                allowsEditing: true,
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
        // https://saving-lemming-loyal.ngrok-free.app/predict
        try {
            // ke saruaken ip server ieu jeng nu di run di ml mnh  (---ORIZA)
            // const res = await fetch('http://192.168.9.85:5000/predict', {
            //     method: 'POST',
            //     body: formData, // jangan tambahkan headers
            // })



            const res = await fetch('https://saving-lemming-loyal.ngrok-free.app/predict/', {
                method: 'POST',
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


    return (
        <View>
            <ScrollView className='bg-white h-full'>
                <View className='flex-col px-6 mt-14 mb-6 flex-1'>
                    <Text className='font-bold text-3xl text-primaryNavy'>Deteksi</Text>
                    <Text className='font-bold text-3xl text-primaryNavy'>Kesehatan Gigi</Text>
                    <Text className='text-primaryNavy text-xl mt-2'>Mari Cek Kondisi Gigimu!</Text>
                </View>
                {/* Modified Button Group */}

                <View className='flex-col gap-6 items-center justify-center px-6'>
                    <TouchableOpacity onPress={() => pickImage(true)} className='h-72 bg-white rounded-2xl flex-col justify-center items-center shadow-lg w-full border border-[#FEDD3F]'>
                        <MaterialCommunityIcons
                            name='camera'
                            size={65}
                            color='#FEDD3F'
                        />
                        <Text className='text-primaryNavy font-semibold text-xl text-center'>Ambil Foto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => pickImage(false)} className='h-72 bg-white rounded-2xl  flex-col justify-center items-center shadow-lg w-full border border-[#FEDD3F]'>
                        <MaterialCommunityIcons
                            name='image'
                            size={65}
                            color='#FEDD3F'
                        />
                        <Text className='text-primaryNavy font-semibold text-xl'>Pilih dari Galeri</Text>
                    </TouchableOpacity>
                </View>



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

                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modalWrapper}
                    >
                        <Animatable.View animation="zoomIn" duration={400}>
                            {result && (
                                <View style={styles.modalContent}>
                                    <Text className='text-center' style={styles.modalTitle}>
                                        {result.predicted_class}
                                    </Text>
                                    <Text className='text-center' style={styles.modalText}>
                                        {result.confidence}
                                    </Text>

                                    {/* <Text style={styles.sectionTitle}>Top 3 Prediksi:</Text>
                                    {result.top_3_predictions?.map((item, idx) => (
                                        <Text key={idx} style={styles.modalText}>
                                            {idx + 1}. {item.label} - {item.probability}
                                        </Text>
                                    ))} */}

                                    <Button
                                        mode="contained"
                                        style={{ marginTop: 20 }}
                                        labelStyle={{ fontSize: 16 }}
                                        onPress={() => setModalVisible(false)}
                                    >
                                        Tutup
                                    </Button>
                                </View>
                            )}
                        </Animatable.View>
                    </Modal>
                </Portal>

            </ScrollView>
        </View>
    )
}

const Index = () => {
    return (
        <SafeAreaProvider>
            <PaperProvider>
                <AppContent />
                <StatusBar style="dark" translucent={false} backgroundColor="#E6F5F3" />
            </PaperProvider>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({

    btnContainer: {
        flex: 1,
        width: '100%',
        paddingVertical: 20, // jarak atas bawah container tombol
    },
    btnGroup: {
        flex: 1,
        justifyContent: 'space-between',
        gap: 20, // jarak antar tombol (jika gap tidak support, gunakan marginVertical di tombol)
        paddingHorizontal: 20,
    },
    flexButton: {
        flex: 1,
        justifyContent: 'center',
        borderRadius: 12, // gunakan borderRadius
        overflow: 'hidden', // pastikan radius berlaku
        marginVertical: 10, // jika `gap` tidak berlaku
    },



    buttonContent: {
        flex: 1,
        height: '100%',
    },

    scroll: {
        flex: 1,
        backgroundColor: '#E6F5F3',
    },
    container: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 60,
        flexGrow: 1,
    },
    header: {
        marginBottom: 30,
        fontWeight: 'bold',
        color: '#007F7F',
    },
    // New styles for full-height balanced buttons

    button: {
        backgroundColor: '#00A8A8',
        borderRadius: 8,
    },
    fullWidthButton: {
        width: '100%',
        paddingVertical: 12,
    },

    buttonLabel: {
        fontSize: 16,
        color: 'white',
    },
    imageCard: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
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
    modalWrapper: {
        margin: 20,
        justifyContent: 'center',
    },

})

export default Index
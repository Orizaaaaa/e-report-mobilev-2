import { postImage } from '@/database/cloudinary';
import { db } from '@/database/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {
    Button,
    Modal,
    PaperProvider,
    Portal
} from 'react-native-paper';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

type PredictionResult = {
    predicted_class: string
    confidence: string
    description: string
    guest_action: string[]
}

const AppContent = () => {
    const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null)
    const [result, setResult] = useState<PredictionResult | null>(null)
    const [loading, setLoading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [saving, setSaving] = useState(false)

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

    const savePredictionToFirestore = async (predictionData: PredictionResult, imageUri: string) => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                Alert.alert("Error", "Anda harus login untuk menyimpan hasil prediksi");
                return null;
            }

            setSaving(true)
            const imageUrl = await postImage({ image: imageUri });

            if (!imageUrl) {
                Alert.alert("Error", "Upload gambar gagal. Coba lagi!");
                return null;
            }

            const docRef = await addDoc(collection(db, 'predictions'), {
                userId: user.uid,
                predictedClass: predictionData.predicted_class,
                confidence: predictionData.confidence,
                description: predictionData.description,
                guestAction: predictionData.guest_action,
                imageUrl: imageUrl,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            console.log("Prediction saved with ID: ", docRef.id);
            return docRef.id;

        } catch (error) {
            console.error("Error saving prediction: ", error);
            Alert.alert("Error", "Gagal menyimpan hasil prediksi");
            return null;
        } finally {
            setSaving(false)
        }
    }

    // Di halaman upload/scan
    const uploadImage = async () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', {
            uri: image.uri,
            name: 'photo.jpg',
            type: 'image/jpeg',
        } as any);

        try {
            const res = await fetch('https://saving-lemming-loyal.ngrok-free.app/predict/', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

            const json: PredictionResult = await res.json();
            setResult(json);

            // Simpan ke Firestore dan dapatkan ID dokumen
            const predictionId = await savePredictionToFirestore(json, image.uri);

            if (predictionId) {
                // Navigasi ke halaman detail dengan ID prediksi saja
                router.push({
                    pathname: "/detail_predict",
                    params: {
                        predictionId: predictionId // Hanya kirim ID, data lain diambil dari Firestore
                    }
                });
            } else {
                setModalVisible(true);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to get prediction');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <ScrollView className='bg-white h-full'>
                <View className='flex-col px-6 mt-14 mb-6 flex-1'>
                    <Text className='font-bold text-3xl text-primaryNavy'>Deteksi</Text>
                    <Text className='font-bold text-3xl text-primaryNavy'>Kesehatan Gigi</Text>
                    <Text className='text-primaryNavy text-xl mt-2'>Mari Cek Kondisi Gigimu!</Text>
                </View>

                <View className='flex-col gap-6 items-center justify-center px-6'>
                    {image ? (
                        // Tampilkan image preview di tombol galeri
                        <TouchableOpacity
                            onPress={() => pickImage(false)}
                            className='h-72 bg-white rounded-2xl flex-col justify-center items-center shadow-lg w-full border border-[#FEDD3F]'
                        >
                            <View style={styles.imagePreviewContainer}>
                                <Animatable.Image
                                    animation="fadeIn"
                                    duration={500}
                                    source={{ uri: image.uri }}
                                    style={styles.imagePreview}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlay}>
                                    <MaterialCommunityIcons
                                        name='image-edit'
                                        size={40}
                                        color='white'
                                    />
                                    <Text className='text-white font-semibold text-lg mt-2'>Ganti Gambar</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        // Tampilkan tombol biasa jika belum ada gambar
                        <>
                            <TouchableOpacity
                                onPress={() => pickImage(true)}
                                className='h-72 bg-white rounded-2xl flex-col justify-center items-center shadow-lg w-full border border-[#FEDD3F]'
                            >
                                <MaterialCommunityIcons
                                    name='camera'
                                    size={65}
                                    color='#FEDD3F'
                                />
                                <Text className='text-primaryNavy font-semibold text-xl text-center'>Ambil Foto</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => pickImage(false)}
                                className='h-72 bg-white rounded-2xl flex-col justify-center items-center shadow-lg w-full border border-[#FEDD3F]'
                            >
                                <MaterialCommunityIcons
                                    name='image'
                                    size={65}
                                    color='#FEDD3F'
                                />
                                <Text className='text-primaryNavy font-semibold text-xl'>Pilih dari Galeri</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                {image && (
                    <View className='px-6 mt-4'>
                        <Button
                            mode="contained"
                            onPress={uploadImage}
                            disabled={loading}
                            loading={loading}
                            style={styles.predictButton}
                            labelStyle={styles.predictButtonLabel}
                        >
                            {loading ? 'Menganalisis...' : 'Deteksi Sekarang'}
                        </Button>
                    </View>
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
                                        Confidence: {result.confidence}
                                    </Text>

                                    <Text style={styles.sectionTitle}>Deskripsi:</Text>
                                    <Text style={styles.modalText}>
                                        {result.description}
                                    </Text>

                                    <Text style={styles.sectionTitle}>Saran Tindakan:</Text>
                                    {result.guest_action.map((action, idx) => (
                                        <Text key={idx} style={styles.modalText}>
                                            • {action}
                                        </Text>
                                    ))}

                                    <View style={styles.modalButtons}>
                                        <Button
                                            mode="outlined"
                                            style={{ marginRight: 10 }}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            Tutup
                                        </Button>
                                        <Button
                                            mode="contained"
                                            onPress={() => {
                                                setModalVisible(false);
                                                router.push({
                                                    pathname: "/detail_predict",
                                                    params: {
                                                        predictedClass: result.predicted_class,
                                                        confidence: result.confidence,
                                                        description: result.description,
                                                        guestAction: JSON.stringify(result.guest_action),
                                                        imageUri: image?.uri || ''
                                                    }
                                                });
                                            }}
                                        >
                                            Lihat Detail
                                        </Button>
                                    </View>
                                </View>
                            )}
                        </Animatable.View>
                    </Modal>
                </Portal>

                <View className='mb-10 mt-2 px-6 flex-row gap-3 justify-center items-center' style={styles.btnContainer}>
                    <TouchableOpacity
                        onPress={() => (router.push("/history_predict"))}
                        className="w-full items-center bg-[#2AA8E1] p-4 rounded-2xl shadow"
                    >
                        <Text className="text-lg font-semibold text-white">Lihat Riwayat Deteksi</Text>
                    </TouchableOpacity>
                </View>

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
        paddingVertical: 20,
    },
    imagePreviewContainer: {
        width: '100%',
        height: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    predictButton: {
        backgroundColor: '#FEDD3F',
        borderRadius: 12,
        paddingVertical: 8,
    },
    predictButtonLabel: {
        fontSize: 16,
        fontWeight: 'heavy',
        color: '#205072',
    },
    modalWrapper: {
        margin: 20,
        justifyContent: 'center',
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
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 20,
    },
})

export default Index
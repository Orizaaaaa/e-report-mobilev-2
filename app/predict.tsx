import * as ImagePicker from 'expo-image-picker'
import { StatusBar } from 'expo-status-bar'
import React, { useState } from 'react'
import {
    ScrollView,
    StyleSheet,
    View
} from 'react-native'
import * as Animatable from 'react-native-animatable'
import {
    ActivityIndicator,
    Button,
    Card,
    Modal,
    PaperProvider,
    Portal,
    Text
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

        try {
            // ke saruaken ip server ieu jeng nu di run di ml mnh  (---ORIZA)
            const res = await fetch('http://192.168.9.85:5000/predict', {
                method: 'POST',
                body: formData, // jangan tambahkan headers
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
        <View style={[styles.scroll, { paddingTop: insets.top }]}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text variant="headlineMedium" style={styles.header}>Gigi Analyzer</Text>

                {/* Modified Button Group */}
                <View style={styles.btnContainer}>
                    <View style={styles.btnGroup}>
                        <Button
                            icon="camera"
                            mode="contained"
                            onPress={() => pickImage(true)}
                            style={[styles.button, styles.fullWidthButton]}
                            labelStyle={styles.buttonLabel}
                            contentStyle={styles.buttonContent}
                        >
                            Take Photo
                        </Button>
                        <Button
                            icon="image"
                            mode="contained"
                            onPress={() => pickImage(false)}
                            style={[styles.button, styles.fullWidthButton]}
                            labelStyle={styles.buttonLabel}
                            contentStyle={styles.buttonContent}
                        >
                            Pick from Gallery
                        </Button>
                    </View>
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
                    <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.modalContent}>
                        <Animatable.View animation="zoomIn" duration={400}>
                            {result && (
                                <View>
                                    <Text variant="titleLarge" style={styles.modalTitle}>
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
                            <Button
                                mode="contained"
                                style={{ marginTop: 20 }}
                                labelStyle={{ fontSize: 16 }}
                                onPress={() => setModalVisible(false)}
                            >
                                Close
                            </Button>
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
    btnContainer: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        maxHeight: 300, // Membatasi tinggi maksimum
    },
    btnGroup: {
        width: '100%',
        gap: 20,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#00A8A8',
        borderRadius: 8,
    },
    fullWidthButton: {
        width: '100%',
        paddingVertical: 12,
    },
    buttonContent: {
        height: 48, // Memberikan tinggi yang konsisten untuk button
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
})

export default Index
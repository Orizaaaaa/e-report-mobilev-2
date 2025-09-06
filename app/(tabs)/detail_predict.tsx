import { db } from '@/database/firebase';
import { router, useLocalSearchParams } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid';

const DetailPredict = () => {
    const params = useLocalSearchParams();
    const predictionId = params.predictionId as string;

    const [predictionData, setPredictionData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPredictionData = async () => {
            if (!predictionId) {
                setError('ID prediksi tidak valid');
                setLoading(false);
                return;
            }

            try {
                const docRef = doc(db, 'predictions', predictionId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPredictionData(docSnap.data());
                } else {
                    setError('Data prediksi tidak ditemukan');
                }
            } catch (error) {
                console.error('Error fetching prediction data:', error);
                setError('Gagal memuat data prediksi');
            } finally {
                setLoading(false);
            }
        };

        fetchPredictionData();
    }, [predictionId]);

    // Tampilkan loading indicator jika data masih diambil
    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#2AA8E1" />
                <Text className="text-primaryNavy mt-4">Memuat hasil prediksi...</Text>
            </View>
        );
    }

    // Tampilkan error message jika terjadi error
    if (error || !predictionData) {
        return (
            <View className="flex-1 bg-white justify-center items-center px-6">
                <ExclamationCircleIcon size={48} color="#FF3B30" />
                <Text className="text-primaryNavy mt-4 text-center text-lg font-semibold">
                    {error || 'Data prediksi tidak tersedia'}
                </Text>
                <TouchableOpacity
                    onPress={() => router.push("/predict")}
                    className="mt-6 bg-[#2AA8E1] py-3 px-6 rounded-2xl"
                >
                    <Text className="text-white font-semibold">Kembali ke Deteksi</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Ekstrak data setelah dipastikan predictionData tidak null
    const predictedClass = predictionData.predictedClass;
    const confidence = predictionData.confidence;
    const description = predictionData.description;
    const guestAction = predictionData.guestAction;
    const imageUrl = predictionData.imageUrl;

    // Tentukan status berdasarkan predictedClass
    const isHealthy = predictedClass === "Gigi Sehat";
    const statusColor = isHealthy ? "green" : "orange";
    const statusText = isHealthy ? "Sehat" : "Perlu Perhatian";

    console.log('imageUrl:', imageUrl);

    return (
        <View className="flex-1 bg-white">
            <ScrollView className="bg-white h-full">
                {/* Header */}
                <View className="flex-col px-6 mt-14 mb-6">
                    <Text className="font-bold text-3xl text-primaryNavy">Hasil Deteksi</Text>
                    <Text className="font-bold text-3xl text-primaryNavy">Gigi Anda</Text>
                </View>

                {/* Gambar */}
                <View className="flex justify-center items-center px-6">
                    <Image
                        source={{ uri: imageUrl }}
                        className="w-72 h-44 rounded-2xl"
                        resizeMode="cover"
                    />
                </View>

                {/* Status */}
                <View className="items-center justify-center mt-4">
                    <View className={`flex-row ${isHealthy ? 'bg-green-400/20' : 'bg-orange-400/20'} w-48 mx-6 py-2 px-4 rounded-full items-center`}>
                        {isHealthy ? (
                            <CheckCircleIcon size={24} color="green" />
                        ) : (
                            <ExclamationCircleIcon size={24} color="orange" />
                        )}
                        <Text className={`ml-2 ${isHealthy ? 'text-green-600' : 'text-orange-600'} font-semibold text-lg`}>
                            {statusText}
                        </Text>
                    </View>
                </View>

                {/* Confidence */}
                <View className="items-center justify-center mt-2">
                    <Text className="text-primaryNavy/70 text-sm">
                        Tingkat Kepercayaan: {(confidence * 100).toFixed(2)}%
                    </Text>
                </View>

                {/* Deskripsi */}
                <View className="px-6 mt-6">
                    <Text className="font-semibold text-base text-primaryNavy mb-2">
                        {predictedClass}
                    </Text>
                    <Text className="mt-2 text-primaryNavy/70 text-justify leading-relaxed">
                        {description}
                    </Text>
                </View>

                {/* Saran Tindakan */}
                <View className="px-6 mt-6">
                    <Text className="font-semibold text-base text-primaryNavy mb-2">
                        Saran Tindakan
                    </Text>
                    <View className="space-y-2">
                        {guestAction.map((action: any, index: number) => (
                            <Text key={index} className="text-primaryNavy/70">
                                • {action}
                            </Text>
                        ))}
                    </View>
                </View>

                {/* Tombol */}
                <View className="mb-10 mt-10 px-6 flex-row gap-3 justify-center items-center">
                    <TouchableOpacity
                        onPress={() => router.push("/predict")}
                        className="flex-1 items-center bg-[#FEDD3F] p-4 rounded-2xl shadow"
                    >
                        <Text className="text-lg font-semibold text-primaryNavy">Deteksi Ulang</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/home")}
                        className="flex-1 items-center bg-[#2AA8E1] p-4 rounded-2xl shadow"
                    >
                        <Text className="text-lg font-semibold text-white">Selesai</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default DetailPredict;
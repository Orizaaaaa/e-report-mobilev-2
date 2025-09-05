import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircleIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid';

const DetailPredict = () => {
    const params = useLocalSearchParams();

    // Extract data dari params
    const predictionId = params.predictionId as string;
    const predictedClass = params.predictedClass as string;
    const confidence = params.confidence as string;
    const description = params.description as string;
    const guestAction = JSON.parse(params.guestAction as string) as string[];
    const imageUri = params.imageUrl as string;

    // Tentukan status berdasarkan predictedClass
    const isHealthy = predictedClass === "Gigi Sehat";
    const statusColor = isHealthy ? "green" : "orange";
    const statusText = isHealthy ? "Sehat" : "Perlu Perhatian";

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
                        source={{ uri: imageUri }}
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
                        Tingkat Kepercayaan: {confidence}
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
                        {guestAction.map((action, index) => (
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
                        onPress={() => router.push("/history_predict")}
                        className="flex-1 items-center bg-primaryBlue p-4 rounded-2xl shadow"
                    >
                        <Text className="text-lg font-semibold text-white">Selesai</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

export default DetailPredict;
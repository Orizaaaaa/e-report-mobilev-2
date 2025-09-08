import { db } from '@/database/firebase';
import { movePage } from '@/utils/helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

;

const Dokter = () => {
    const [doctors, setDoctors] = useState([] as any);
    const router = useRouter();
    const fetchDoctors = async () => {
        try {
            const snapshot = await getDocs(collection(db, "doctors"));
            const doctorsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDoctors(doctorsData);
        } catch (err) {
            console.error("❌ Gagal mengambil data dokter:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDoctors();
            return () => { };
        }, [])
    );



    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => movePage(`/dokter/${item.id}`)}
            className="flex-row bg-white h-44 mx-5 mb-3 rounded-2xl shadow-lg"
        >
            <View className="h-full w-36">
                <Image
                    className="w-32 rounded-2xl h-full"
                    source={{ uri: item.icon }}
                    resizeMode="cover"
                />
            </View>
            <View className="flex-col gap-2 m-3 flex-1">
                <View className="flex-col">
                    <Text className="text-md font-semibold text-wrap text-primaryNavy">
                        {item.title}
                    </Text>
                    <Text className="text-md text-primaryNavy">{item.description}</Text>
                </View>

                <View className="flex-row items-center bg-[#FEDD3F] rounded-full px-3 py-2 w-40">
                    <MaterialCommunityIcons
                        name="calendar"
                        size={18}
                        color="#205072"
                    />
                    <Text
                        className="text-sm text-gray-600 ml-2"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ width: 120 }}
                    >
                        {item.hari || 'Hari: Selasa & Jumat'}
                    </Text>
                </View>

                <View className="flex-row items-center bg-[#FEDD3F] rounded-full px-3 py-2 w-40">
                    <MaterialCommunityIcons
                        name="clock-outline"
                        size={18}
                        color="#205072"
                    />
                    <Text
                        className="text-sm text-gray-600 ml-2"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={{ width: 120 }}
                    >
                        {item.jam || 'Jam: 14.00 - 16.00'}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>

    );

    return (
        <View className="pt-14  bg-white ">
            <Text className="text-3xl text-center font-medium text-[#205072] ">Dokter</Text>



            <FlatList
                className="mt-8 mb-10"
                data={doctors}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Dokter;

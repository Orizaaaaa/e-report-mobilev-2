import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TextInput, TouchableOpacity, View } from 'react-native';

const dentalServices = [
    {
        id: '1',
        title: 'Pelayanan Tindakan Gigi',
        description: 'Pemeriksaan rutin untuk mendeteksi masalah sejak dini',
        icon: require('../../assets/images/tooth2.png'),
    },
    {
        id: '2',
        title: 'Konsultasi Pemeriksaan Gigi',
        description: 'Menghilangkan plak dan karang untuk kesehatan mulut',
        icon: require('../../assets/images/tooth1.png'),
    },
    {
        id: '3',
        title: 'Pembersihan Karang Gigi (Scaling)',
        description: 'Perawatan gigi berlubang menggunakan bahan tambal',
        icon: require('../../assets/images/tooth5.png'),
    },
    {
        id: '4',
        title: 'Pencabutan Gigi (Ekstraksi)',
        description: 'Pengangkatan gigi yang rusak atau tumbuh tidak normal',
        icon: require('../../assets/images/tooth6.png'),
    },
    {
        id: '5',
        title: 'Penambalan Gigi',
        description: 'Perataan gigi menggunakan kawat gigi',
        icon: require('../../assets/images/tooth3.png'),
    },
    {
        id: '6',
        title: 'Orthodonti (Behel)',
        description: 'Perataan gigi menggunakan kawat gigi',
        icon: require('../../assets/images/tooth4.png'),
    },
];

const Articles = () => {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof dentalServices[0] }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row items-center bg-[#FEDD3F] p-3 mb-3 rounded-2xl shadow"
        >
            <View className="mr-4">
                {/* <FontAwesome6 name={item.icon as any} size={28} color="#20BEC6" /> */}
                <Image
                    className='w-9 h-9 mx-2 mb-1'
                    source={item.icon as any}
                    resizeMode='contain'
                />
            </View>
            <View className="flex-1">
                <Text className="text-lg font-semibold text-black">{item.title}</Text>
                {/* <Text className="text-sm text-gray-600">{item.description}</Text> */}
            </View>
        </TouchableOpacity>
    );

    return (
        <View className="pt-14 px-5 bg-white flex-1">
            <View className="flex-col">
                <Text className="text-3xl font-medium text-[#205072]">Pilih Layanan Gigi</Text>
                <Text className="text-3xl font-medium text-[#205072]">Sesuai Kebutuhanmu</Text>
            </View>

            <View className="mt-3 py-2">
                <View className="flex-row items-center border border-[#2AA8E1] rounded-2xl px-3 py-2 bg-white">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        className="flex-1 pl-2 py-2"
                        placeholder="Cari layanan..."
                        placeholderTextColor="gray"
                    />
                </View>
            </View>

            <FlatList
                className="mt-3"
                data={dentalServices}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Articles;

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';

const dentalServices = [
    {
        id: '1',
        title: 'Drg. Nur Eka P',
        description: 'Dokter Gigi',
        icon: require('../../assets/images/doctor1.jpeg'),
        jam: '14.00 - 18.00',
        hari: 'Selasa & Jumat',
    },
    {
        id: '2',
        title: 'Drg. Sarah N. A. Widodo',
        description: 'Dokter Gigi',
        icon: require('../../assets/images/doctor2.jpeg'),
        jam: '14.00 - 18.00',
        hari: 'Rabu & Kamis',
    },
    {
        id: '3',
        title: 'Drg. Anten, SP.KGA',
        description: 'Dokter Spesialis Gigi Anak',
        icon: require('../../assets/images/doctor3.jpeg'),
        jam: '13.00 - 16.00',
        hari: 'Selasa & Jumat',
    },
    {
        id: '4',
        title: 'Drg. Three Rejeki N, SP.KGA',
        description: 'Dokter Spesialis Gigi Anak',
        icon: require('../../assets/images/doctor4.jpeg'),
        jam: '09.00 - 16.00',
        hari: 'Sabtu',
    },
    {
        id: '5',
        title: 'Dr. Erick Satria, SP.B',
        description: 'Dokter Spesialis Bedah',
        icon: require('../../assets/images/doctor5.jpeg'),
        jam: '16.00 - 18.00',
        hari: 'Sabtu',
    },
    {
        id: '6',
        title: 'Dr. Devi M Susanto',
        description: 'Dokter Umum',
        icon: require('../../assets/images/doctor6.jpeg'),
        jam: '16.00 - 18.00',
        hari: 'Senin & Sabtu',
    },
    {
        id: '7',
        title: 'Drg. Helmi Budimansyah ',
        description: 'Dokter Gigi',
        icon: require('../../assets/images/doctor7.jpeg'),
        jam: '16.00 - 20.00',
        hari: 'Senin',
    },
];

const Dokter = () => {
    const router = useRouter();

    const renderItem = ({ item }: { item: typeof dentalServices[0] }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            className="flex-row bg-white h-44 mx-5 mb-3 rounded-2xl shadow-lg"
        >
            <View className="h-full w-36">
                <Image
                    className="w-32 rounded-2xl h-full"
                    source={item.icon as any}
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
                data={dentalServices}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default Dokter;

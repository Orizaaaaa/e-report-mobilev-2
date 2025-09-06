import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const testimoniData = [
    {
        id: 1,
        name: 'Budi Santoso',
        message: 'Pelayanan sangat ramah dan cepat, saya merasa nyaman berobat di sini.',
        // image: require('../../assets/images/user1.jpg'),
    },
    {
        id: 2,
        name: 'Siti Aminah',
        message: 'Dokter gigi anaknya sangat sabar, anak saya jadi tidak takut lagi ke dokter.',
        // image: require('../../assets/images/user2.jpg'),
    },
    {
        id: 3,
        name: 'Andi Wijaya',
        message: 'Fasilitas modern dan bersih, membuat saya lebih percaya.',
        // image: require('../../assets/images/user3.jpg'),
    },
];

const TestimoniPage = () => {
    return (
        <View className="flex-1 bg-white">
            <ScrollView className="bg-white h-full">
                {/* Header */}
                <View className="flex-col px-6 mt-14 mb-6 items-center">
                    <Text className="font-bold text-3xl text-primaryNavy">Testimoni</Text>
                </View>

                {/* List Testimoni */}
                <View className="px-4 space-y-4">
                    {testimoniData.map((item) => (
                        <View
                            key={item.id}
                            className="flex-row bg-white shadow-md rounded-xl p-4 items-center mt-3"
                        >
                            {/* <Image
                                source={item.image}
                                className="w-14 h-14 rounded-full mr-4"
                                resizeMode="cover"
                            /> */}
                            <View className="flex-1">
                                <Text className="font-semibold text-gray-900">{item.name}</Text>
                                <Text className="text-gray-600 text-sm mt-1">{item.message}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default TestimoniPage;

import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import { EvilIcons, Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type Props = {}

const Contest = (props: Props) => {
    const [searchText, setSearchText] = useState('');
    const totalPeserta = 1000;
    const pesertaSaatIni = 700;
    const progress = Math.min(pesertaSaatIni / totalPeserta, 1);

    const handlePress = () => {
        console.log('Tombol custom ditekan!');
    };

    return (
        <View className="flex-1 bg-white">
            {/* Bagian Atas */}
            <View className="pb-14 pt-12 px-3 relative overflow-hidden">
                <View className="absolute inset-0 bg-primaryNavy opacity-100 z-0" />

                <View className="relative z-10 mt-5 flex-row items-center gap-2 bg-white rounded-full px-2">
                    <View className="flex-1 h-14 px-2 rounded-lg flex-row items-center gap-2">
                        <Feather name="search" size={24} color="#FF840C" />
                        <TextInput
                            className="flex-1 text-gray-800"
                            placeholder="Cari..."
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>

                    <View className="flex-row justify-end">
                        <View className="p-3 border-white rounded-xl">
                            <MaterialIcons name="notifications-none" size={25} color="#FF840C" />
                        </View>
                    </View>
                    <View className="w-14 border-white h-14 justify-center items-center rounded-lg">
                        <Feather name="menu" size={24} color="#FF840C" />
                    </View>
                </View>

                <View className="relative z-10 flex justify-center items-center mt-4">
                    <MaterialCommunityIcons name="trophy-award" size={70} color="#FF840C" />
                    <Text className="text-3xl text-white">700</Text>
                    <Text className="text-slate-200">Lomba Tersedia</Text>

                </View>
            </View>

            {/* Scrollable Content */}
            <View className="flex-1 rounded-tr-[37px] -mt-9 bg-white overflow-hidden pb-12">
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="w-full space-y-5 mb-10">
                        {/* Gambar */}
                        <View className="h-32">
                            <Image
                                className="w-full h-full rounded-t-3xl"
                                source={require('../assets/images/study1.png')}
                                resizeMode="cover"
                            />
                            <View className="absolute bottom-2 right-3">
                                <View className="flex-row justify-center items-center bg-slate-50 py-1 px-2 rounded-xl">
                                    <EvilIcons name="location" size={15} color="black" />
                                    <Text className="text-sm font-light">Kopo, Margahayu</Text>
                                </View>
                            </View>
                        </View>

                        {/* Konten Dengan Shadow */}
                        <View className="bg-white rounded-b-3xl px-3 pt-3 pb-5 shadow-md shadow-black/30">
                            <Text className="text-lg font-semibold">Lomba Mancing</Text>
                            <Text className="text-sm font-light">lomba mancing berhadiah motor</Text>
                            <View className="w-full mt-4">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-sm text-gray-800">
                                        Peserta: {pesertaSaatIni} / {totalPeserta}
                                    </Text>
                                    <Text className="text-sm text-gray-800">
                                        {Math.round(progress * 100)}%
                                    </Text>
                                </View>

                                <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
                                    <View
                                        className="h-full bg-primaryOrange"
                                        style={{ width: `${progress * 100}%` }}
                                    />
                                </View>

                                <ButtonPrimary
                                    className="mt-4 py-2 rounded-xl"
                                    text="Ikuti lomba"
                                    onPress={handlePress}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </View>
    );
}

export default Contest;

import CardContest from '@/components/fragments/CardContest/CardContest';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

type Props = {}

const Contest = (props: Props) => {
    const [searchText, setSearchText] = useState('');
    const totalPeserta = 1000;
    const pesertaSaatIni = 700;
    const progress = Math.min(pesertaSaatIni / totalPeserta, 1);


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
                    <CardContest textButton='Hapus lomba' title='Lomba Mancing' desc='Lomba ini berhadiah motor' location='Bandung, Jawa Barat' />
                </ScrollView>
            </View>
        </View>
    );
}

export default Contest;

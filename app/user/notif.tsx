import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

type Props = {}

const NotifUser = (props: Props) => {
    const route = useRoute()
    const params = route.params as { tab?: 'laporan' | 'lomba' }

    const [activeTab, setActiveTab] = useState<'laporan' | 'lomba'>('laporan')

    // Cek parameter saat pertama kali render
    useEffect(() => {
        if (params?.tab === 'lomba' || params?.tab === 'laporan') {
            setActiveTab(params.tab)
        }
    }, [params])




    return (
        <SafeAreaView className="pt-12 px-5">
            <View className='flex-row justify-between items-center' >
                <ButtonBack />
                <Text className='text-xl font-medium' >Notifikasi</Text>
                <Text>{''}</Text>
            </View>
            {/* Tab Selector */}
            <View className="flex-row justify-between bg-slate-200 my-7 px-3 py-5 rounded-2xl">

                {/* Laporan Tab */}
                <TouchableOpacity
                    onPress={() => setActiveTab('laporan')}
                    className={`py-3 px-7 rounded-full flex-row items-center gap-2 ${activeTab === 'laporan' ? 'bg-primaryNavy' : 'bg-slate-300'
                        }`}
                >
                    <Text className={`text-center ${activeTab === 'laporan' ? 'text-white' : 'text-black'}`}>
                        Laporan
                    </Text>
                    <MaterialCommunityIcons
                        name="clipboard-text-clock-outline"
                        size={18}
                        color={activeTab === 'laporan' ? 'white' : 'black'}
                    />
                </TouchableOpacity>

                {/* Lomba Tab */}
                <TouchableOpacity
                    onPress={() => setActiveTab('lomba')}
                    className={`py-3 px-7 rounded-full flex-row items-center gap-2 ${activeTab === 'lomba' ? 'bg-primaryNavy' : 'bg-slate-300'
                        }`}
                >
                    <Text className={`text-center ${activeTab === 'lomba' ? 'text-white' : 'text-black'}`}>
                        Lomba
                    </Text>
                    <Ionicons
                        name="medal-outline"
                        size={18}
                        color={activeTab === 'lomba' ? 'white' : 'black'}
                    />
                </TouchableOpacity>
            </View>

            {/* Konten Scroll */}
            <ScrollView>
                {activeTab === 'laporan' ? (
                    // Konten Laporan
                    <View className="flex-row gap-3 mb-5">
                        <View className="w-20 h-20 rounded-xl">
                            <Image
                                className="w-full h-full rounded-full"
                                source={require('../../assets/images/human.png')}
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 mt-1">
                            <Text className="text-sm text-wrap">Oriza Sativa</Text>
                            <Text className="text-xs text-wrap">
                                Telah membuat laporan prioritas Lorem ipsum dolor sit amet consectetur adipisicing elit...
                            </Text>
                            <Text className="text-xs text-slate-400">21 Januari 2023</Text>
                        </View>
                    </View>
                ) : (
                    // Konten Lomba
                    <View className="flex-row gap-3 mb-5">
                        <View className="w-20 h-20 rounded-xl">
                            <Image
                                className="w-full h-full rounded-full"
                                source={require('../../assets/images/human.png')}
                                resizeMode="cover"
                            />
                        </View>
                        <View className="flex-1 mt-1">
                            <Text className="text-sm text-wrap">Oriza Sativa</Text>
                            <Text className="text-xs text-wrap">
                                Telah mengikuti lomba desain aplikasi nasional dan berhasil daftar
                            </Text>
                            <Text className="text-xs text-slate-400">5 Maret 2023</Text>
                        </View>
                    </View>
                )}
            </ScrollView>


        </SafeAreaView>
    )
}

export default NotifUser

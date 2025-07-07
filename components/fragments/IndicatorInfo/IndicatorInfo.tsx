import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'

type Props = {
    finised: string,
    onProgress: string
    total: string
}

const IndicatorInfo = ({ finised, onProgress, total }: Props) => {
    return (
        <View className="w-full rounded-3xl mt-5">
            <View className="flex-row gap-3 w-full h-40">
                {/* Kiri */}
                <View className="flex-1 bg-primaryNavy rounded-2xl p-5 justify-between overflow-hidden relative">
                    {/* Dekorasi Lingkaran */}
                    <View className="absolute -top-5 -left-5 w-32 h-32 bg-white/10 rounded-full" />
                    <View className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                    <View className="absolute top-10 right-5 w-16 h-16 bg-white/10 rounded-full" />

                    {/* Konten Utama */}
                    <View className="bg-white/30 rounded-md self-start p-2">
                        <FontAwesome name="file-text-o" size={24} color="white" />
                    </View>
                    <Text className="text-3xl font-semibold text-white">{total}</Text>
                    <Text className="text-sm text-white">aduan yang masuk</Text>
                </View>


                {/* Kanan */}
                <View className="flex-1 h-full justify-between">
                    {/* Box: Aduan diproses */}
                    <View className="h-[47%] bg-primaryNavy rounded-2xl p-3 justify-between relative overflow-hidden">
                        {/* Dekorasi Bulat */}
                        <View className="absolute -top-6 -left-6 w-28 h-28 bg-white/10 rounded-full" />
                        <View className="absolute top-12 -right-10 w-24 h-24 bg-white/5 rounded-full" />

                        {/* Konten */}
                        <View className="flex-row items-center gap-2 z-10">
                            <View className="bg-white/30 rounded-md self-start p-1">
                                <MaterialIcons name="sync-problem" size={20} color="white" />
                            </View>
                            <Text className="text-xl text-white"> {onProgress}</Text>
                        </View>
                        <Text className="text-sm text-white z-10">aduan yang di proses</Text>
                    </View>

                    {/* Box: Aduan selesai */}
                    <View className="h-[47%] bg-primaryNavy rounded-2xl p-3 justify-between mt-0 relative overflow-hidden">
                        {/* Dekorasi Bulat */}
                        <View className="absolute -top-8 right-0 w-28 h-28 bg-white/10 rounded-full" />
                        <View className="absolute -bottom-6 -left-10 w-24 h-24 bg-white/5 rounded-full" />
                        <View className="absolute top-8 left-16 w-16 h-16 bg-white/10 rounded-full" />

                        {/* Konten */}
                        <View className="flex-row items-center gap-2 z-10">
                            <View className="bg-white/30 self-start p-1 rounded-md">
                                <FontAwesome name="flag-checkered" size={20} color="white" />
                            </View>
                            <Text className="text-xl text-white">{finised}</Text>
                        </View>
                        <Text className="text-sm text-white z-10">aduan yang selesai</Text>
                    </View>
                </View>

            </View>
        </View>
    )
}

export default IndicatorInfo
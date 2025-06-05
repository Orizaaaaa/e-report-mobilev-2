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
                    <Text className="text-3xl font-semibold text-white">177</Text>
                    <Text className="text-sm text-white">aduan yang masuk</Text>
                </View>


                {/* Kanan */}
                <View className="flex-1 h-full justify-between ">
                    <View className="h-[47%] border-2 border-primaryNavy rounded-2xl p-2 justify-between">
                        <View className="flex-row items-center gap-2">
                            <View className="bg-primaryNavy rounded-md self-start p-1">
                                <MaterialIcons name="sync-problem" size={20} color="white" />
                            </View>
                            <Text className=" text-xl ">44</Text>
                        </View>
                        <Text className="text-sm ">aduan yang di proses</Text>
                    </View>

                    <View className="h-[47%] border-2 border-primaryNavy rounded-2xl p-2 justify-between mt-0">
                        <View className="flex-row items-center gap-2">
                            <View className="bg-primaryNavy self-start p-1 rounded-md">
                                <FontAwesome name="flag-checkered" size={20} color="white" />
                            </View>
                            <Text className="text-xl  ">44</Text>
                        </View>
                        <Text className="text-sm ">aduan yang selesai</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default IndicatorInfo
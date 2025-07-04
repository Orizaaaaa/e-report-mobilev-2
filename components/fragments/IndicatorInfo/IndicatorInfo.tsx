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
                <View className="flex-1 bg-green-900 rounded-2xl p-5 justify-between overflow-hidden relative">
                    {/* Dekorasi Lingkaran */}
                    <View className="absolute -top-5 -left-5 w-32 h-32 bg-white/10 rounded-full" />
                    <View className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
                    <View className="absolute top-10 right-5 w-16 h-16 bg-white/10 rounded-full" />

                    {/* Konten Utama */}
                    <View className="flex-row items-center justify-between mt-5">
                        <Text className="text-3xl font-semibold text-white">177</Text>
                        {/* <FontAwesome name="file-text-o" size={24} color="white" /> */}
                    </View>
                    <Text className="text-lg text-white mb-5">Total Artikel</Text>
                </View>



                {/* Kanan */}
                <View className="flex-1 h-full justify-between ">
                    <View className="h-[47%] bg-green-900 rounded-2xl p-3 justify-between">
                        <View className="absolute -top-5 -left-5 w-32 h-32 bg-white/10 rounded-full" />

                        <Text className="mt-0 text-lg text-white">Tips Perawatan</Text>
                        <Text className="mt-0 text-lg text-white">Gigi</Text>
                    </View>

                    <View className="h-[47%] bg-green-900 rounded-2xl p-3 justify-between">
                        <View className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />

                        <Text className="mt-0 text-lg text-white">Daftar Penyakit</Text>
                        <Text className="mt-0 text-lg text-white">Gigi</Text>
                    </View>

                </View>
            </View>
        </View>
    )
}

export default IndicatorInfo
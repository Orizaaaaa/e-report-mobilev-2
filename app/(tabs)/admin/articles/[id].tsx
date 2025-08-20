import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import { ScrollView, Text } from 'react-native-gesture-handler'

type Props = {}

const DetailArticle = (props: Props) => {
    return (
        <ScrollView >
            <View className='mt-16 px-4 flex-1'  >
                <MaterialIcons name="arrow-back-ios-new" size={24} color="black" />
                <View className="bg-gray-600 py-16 rounded-xl mt-3" >

                </View>
                <Text className='mt-5 text-[#205072]' >Cara Menyikat Gigi Yang Baik dan Benar Untuk Seluruh Keluarga</Text>

                <View className='mt-4 flex-row items-center gap-4'>
                    <Ionicons name="person" size={30} color="#16a34a" />
                    <View>
                        <Text className='text-sm font-light' >Dr Kemem</Text>
                        <Text className='text-sm font-light' >Dr Sepesialis gigi umum</Text>
                    </View>

                </View>

                <View className='mt-5' >
                    <Text className='text-sm font-light' >Oleh diidng</Text>
                    <Text className='text-sm font-light' >Di publikasi 10 agustus 2021</Text>
                </View>

                <Text className='mt-6 text-sm font-light text-[#205072]' >Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Beatae consequatur enim maiores architecto totam natus
                    libero a? Ex dolore a eveniet modi saepe debitis magnam, rerum id velit! Veniam, nemo.</Text>

                <View className="flex-row mt-5 gap-3">
                    <TouchableOpacity className="flex-1 bg-green-700 px-6 py-3 rounded-lg items-center">
                        <Text className="text-white font-medium">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity className="flex-1 bg-red-700 px-6 py-3 rounded-lg items-center">
                        <Text className="text-white font-medium">Hapus</Text>
                    </TouchableOpacity>
                </View>




            </View>

        </ScrollView>
    )
}

export default DetailArticle
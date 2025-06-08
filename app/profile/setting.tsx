import { AntDesign, Feather, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Props = {}

const setting = (props: Props) => {
    return (
        <View className='py-12 px-3'>
            <View className='flex-row items-center gap-6'>
                <AntDesign name="arrowleft" size={24} color="black" />
                <Text className='font-medium text-lg'>Pengaturan dan aktifitas</Text>
            </View>

            <View className="mt-10 px-4">


                <TouchableOpacity className="flex-row justify-between items-center bg-white px-4 py-3 mb-4 rounded-xl shadow-md">
                    <Text className="text-base text-gray-800">Ganti Password</Text>
                    <MaterialIcons name="password" size={24} color="black" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row justify-between items-center bg-white px-4 py-3 mb-4 rounded-xl shadow-md">
                    <Text className="text-base text-gray-800">Hapus akun</Text>
                    <Feather name="trash-2" size={24} color="red" />
                </TouchableOpacity>

                <TouchableOpacity className="flex-row justify-between items-center bg-white px-4 py-3 mb-4 rounded-xl shadow-md">
                    <Text className="text-base text-gray-800">Logout</Text>
                    <MaterialIcons name="logout" size={24} color="black" />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default setting
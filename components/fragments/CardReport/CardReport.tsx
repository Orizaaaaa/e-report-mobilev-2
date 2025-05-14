import { Entypo } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    image: any
    handlepres: any
}

const CardReport = ({ image, handlepres }: Props) => {
    return (
        <View className={`rounded-2xl flex-1 mr-5 w-72`}>
            <Image
                className=' rounded-tl-3xl  rounded-br-3xl w-full h-40'
                source={image}
                resizeMode='cover'
            />

            <View className='py-3 flex-1' >
                <Text className={` text-lg text font-semibold`}>Demo Mahasiswa</Text>
                <Text className={`  text-primary text-base `}>beberapa mahasiswa berdemo tent...</Text>
                <View className='flex-row items-center gap-2 mt-3' >
                    <Entypo name="location-pin" size={15} color="red" />
                    <Text className='text-sm text-gray-500' >Bandung, pasir kaliki</Text>
                </View>
                <View className='flex-row items-center gap-2 mt-2' >
                    <Entypo name="time-slot" size={15} color="black" />
                    <Text className='text-sm text-gray-500' >29 Maret 2023</Text>
                </View>

            </View>

            <TouchableOpacity
                onPress={handlepres}
                className=' p-2 rounded-lg  bg-primary '
            >
                <Text className={`text-base text-center  text-white `}>Selengkapnya</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CardReport
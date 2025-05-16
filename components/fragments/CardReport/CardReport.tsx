import ButtonPrimary from '@/components/elements/Button/ButtonPrimary'
import { Entypo } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, View } from 'react-native'

type Props = {
    image: any
    handlepres: any
}

const CardReport = ({ image, handlepres }: Props) => {
    return (
        <View className={`rounded-2xl flex-1 mr-5 w-64  `}>
            <Image
                className=' rounded-tl-3xl  rounded-br-3xl w-full h-36'
                source={image}
                resizeMode='cover'
            />

            <View className='py-3 ' >
                <Text className={` text-lg text font-semibold`}>Demo Mahasiswa</Text>
                <Text className={`  text-primary text-base `}>beberapa mahasiswa berdemo...</Text>
                <View className='flex-row items-center gap-2 mt-3' >
                    <Entypo name="location-pin" size={15} color="red" />
                    <Text className='text-sm text-gray-500' >Bandung, pasir kaliki</Text>
                </View>
                {/* <View className='flex-row items-center gap-2 mt-2' >
                    <Entypo name="time-slot" size={15} color="black" />
                    <Text className='text-sm text-gray-500' >29 Maret 2023</Text>
                </View> */}

            </View>


            <ButtonPrimary className='p-2 rounded-lg' text='Selengkapnya' onPress={() => { }} ></ButtonPrimary>
        </View>
    )
}

export default CardReport
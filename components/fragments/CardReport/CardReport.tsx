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
                {/* <Text className={`  text-base font-medium text-primaryOrange`}>Demo Mahasiswa</Text> */}
                <Text className={`  text-sm  `}>Beberapa mahasiswa berdemo...</Text>
                <View className='flex-row items-center gap-1 mt-1' >
                    <Entypo name="location-pin" size={10} color="red" />
                    <Text className='text-sm font-light text-gray-500' >Bandung, pasir kaliki</Text>
                </View>
            </View>


            <ButtonPrimary className='p-2 rounded-full' text='Selengkapnya' onPress={handlepres} ></ButtonPrimary>
        </View>
    )
}

export default CardReport
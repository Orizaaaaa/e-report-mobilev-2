import { Octicons } from '@expo/vector-icons'
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

            <View className='py-3 w-full' >
                <Text className='font-light'>Beberapa mahasiswa berdem...</Text>

                <View className='mt-3 flex-row justify-between items-center'>
                    <View className='w-24'>
                        <Text className={`  text-sm border-2 border-primaryNavy text-primborder-primaryNavy p-1 rounded-xl text-center  `}>REGULAR</Text>
                    </View>
                    <Octicons name="report" size={24} color="gray" />
                </View>
            </View>
        </View>
    )
}

export default CardReport
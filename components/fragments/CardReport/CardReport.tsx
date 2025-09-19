import { truncateText } from '@/utils/helper'
import { Octicons } from '@expo/vector-icons'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    image: any
    handlepres: any
    heightImage?: string
    desc: string
}

const CardReport = ({ image, handlepres, heightImage = 'h-36', desc }: Props) => {
    return (
        <TouchableOpacity onPress={handlepres}>
            <View className={`rounded-2xl flex-1 mr-5 w-64  `}>
                <Image
                    className={`rounded-tl-3xl  rounded-br-3xl w-full ${heightImage} `}
                    source={image}
                    resizeMode='cover'
                />

                <View className='py-3 w-full' >
                    <Text className='font-light'>{truncateText(desc, 28)}</Text>

                    <View className='mt-3 flex-row justify-between items-center'>
                        <View className='w-24'>
                            <Text className={`  text-sm border-2 border-primaryOrange text-primaryOrange  rounded-xl text-center  `}>PRIORITAS</Text>
                        </View>
                        <Octicons name="report" size={20} color="gray" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>

    )
}

export default CardReport
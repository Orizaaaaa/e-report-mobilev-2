import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    image: any
    handlepres?: any
    title: string
    description: string
}

const CardReportScroll = ({ image, handlepres, title, description }: Props) => {
    return (
        <TouchableOpacity onPress={handlepres}>
            <View className={`rounded-3xl flex-1 bg-white  w-auto shadow-md shadow-black p-4 mt-4`}>
                <Image
                    className=' rounded-lg w-full h-36 mt-2'
                    source={image}
                    resizeMode='cover'
                />

                <View className='py-3 w-auto' >
                    <Text className='font-light'>{title}</Text>

                    <View className='mt-3 flex-row justify-between items-center'>
                        <Text className='font-light text-sm text-gray-500'
                            numberOfLines={2}
                            ellipsizeMode="tail" >{description}</Text>

                    </View>

                </View>
            </View>
        </TouchableOpacity>

    )
}

export default CardReportScroll
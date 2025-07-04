import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

type Props = {
    image: any
    handlepres: any
}

const CardReportScroll = ({ image, handlepres }: Props) => {
    return (
        <TouchableOpacity onPress={handlepres}>
            <View className={`rounded-3xl flex-1 bg-white  w-auto shadow-xl shadow-black/50 p-4 mt-4`}>
                <Image
                    className=' rounded-lg w-full h-36 mt-2'
                    source={image}
                    resizeMode='cover'
                />

                <View className='py-3 w-auto' >
                    <Text className='font-light'>Tips Kesehatan Gigi Untuk Perokok</Text>

                    <View className='mt-3 flex-row justify-between items-center'>
                        <Text className='font-light text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio animi quaerat. Laborum magni dolor dignissimos adipisci facere, at modi praesentium tempore....</Text>

                    </View>

                </View>
            </View>
        </TouchableOpacity>

    )
}

export default CardReportScroll
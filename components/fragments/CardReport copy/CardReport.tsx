import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type Props = {
    image: any
    handlepres: any
}

const CardReport = ({ image, handlepres }: Props) => {
    return (
        <TouchableOpacity onPress={handlepres}>
            <View className={`rounded-2xl flex-1 mt-5 w-auto shadow-lg rounded-tl-3xl bg- rounded-br-3xl p-7`}>
                {/* <Image
                    className=' rounded-lg w-full h-36'
                    source={image}
                    resizeMode='cover'
                /> */}

                <View className='py-3 w-full' >
                    <Text className='font-light'>Tips Kesehatan Gigi Untuk Perokok</Text>

                    <View className='mt-3 flex-row justify-between items-center'>
                        <Text className='font-light text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio animi quaerat. Laborum magni dolor dignissimos adipisci facere, at modi praesentium tempore....</Text>

                        {/* <View className='w-24'>
                            <Text className={`  text-sm border-2 border-primaryOrange text-primaryOrange  rounded-xl text-center  `}>PRIORITAS</Text>
                        </View> */}
                        {/* <Octicons name="report" size={20} color="gray" /> */}
                    </View>

                </View>
            </View>
        </TouchableOpacity>

    )
}

export default CardReport
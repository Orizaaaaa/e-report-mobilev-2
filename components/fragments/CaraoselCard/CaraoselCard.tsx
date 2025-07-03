import { MaterialIcons, Octicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Dimensions, Image, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

type Props = {
    imageCaraosel: any
    typeReport: string
    status: string
    desc: string

}

const CaraoselCard = ({ imageCaraosel, typeReport, status, desc }: Props) => {
    const { width } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <View className={`rounded-2xl flex-1  w-full `}>
            <View style={{ position: 'relative', width: width - 29, height: 125 }}>
                <Carousel
                    loop
                    width={width - 29}
                    height={125}
                    data={imageCaraosel}
                    scrollAnimationDuration={100}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }: any) => (
                        <View>
                            <Image
                                source={{ uri: item }}
                                style={{
                                    width: '100%',
                                    height: 125,
                                    borderTopLeftRadius: 24,
                                    borderBottomRightRadius: 24,
                                }}
                                className='relative'
                                resizeMode="cover"
                            />
                            <View className='flex-row justify-between items-center absolute top-3 right-3 bg-slate-200 px-3 py-1 rounded-lg gap-2 '>
                                <MaterialIcons className='' name="pending-actions" size={18} color="black" />
                                <Text className='text-sm'>{status}</Text>
                            </View>

                        </View>

                    )}

                />

                {/* Pagination bullet, posisi absolute di dalam gambar */}
                <View
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {imageCaraosel.map((_: any, index: any) => (
                        <View
                            key={index}
                            style={{
                                width: index === activeIndex ? 16 : 8,
                                height: 8,
                                borderRadius: 4,
                                marginHorizontal: 4,
                                backgroundColor: index === activeIndex ? '#FB923C' : '#D1D5DB',
                                // shadow agar bullet terlihat lebih jelas di atas gambar
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.3,
                                shadowRadius: 1,
                                elevation: 2,
                            }}
                        />
                    ))}
                </View>
            </View>

            <View className='py-3 w-full' >
                <Text className='font-light'>{desc}</Text>

                <View className='mt-3 flex-row justify-between items-center'>
                    <View className='w-24'>
                        <Text className={`  text-sm border-2 ${typeReport === 'PRIORITAS' ? 'border-primaryOrange text-primaryOrange' : 'border-primaryNavy text-primaryNavy'}  p-1 rounded-xl text-center  `}>{typeReport}</Text>
                    </View>
                    <Octicons name="report" size={24} color="gray" />
                </View>
            </View>


            {/* <ButtonPrimary className='p-2 rounded-lg' text='Selengkapnya' onPress={handlePress} ></ButtonPrimary> */}
        </View>
    )
}

export default CaraoselCard
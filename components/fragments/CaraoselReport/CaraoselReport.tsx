import React from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

type Props = {
    backgroundCard: string
    dataCaraosel: {
        id: string;
        title: string;
        desc: string;
        image: any;
    }[];
    colorButton: string,
    color: string,
    bgButton: string,
    textTitle: string

}

const { height } = Dimensions.get('window');
const width = Dimensions.get("window").width;

const CaraoselReport = ({ backgroundCard, dataCaraosel, bgButton, color, colorButton, textTitle }: Props) => {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const handlePress = () => {
        console.log('Tombol custom ditekan!');
    };
    return (
        <>
            <View className='flex-row justify-between items-center mb-3 mt-5'>
                <Text>{textTitle}</Text>
                <TouchableOpacity
                    onPress={handlePress}
                >
                    <Text className='text-blueCustom'>Lihat Semua</Text>
                </TouchableOpacity>

            </View>


            <View style={{ flex: 1 }}>
                <Carousel
                    ref={ref}
                    width={width * 0.9}
                    height={(width * 0.8) / 1.5}
                    data={dataCaraosel}
                    onProgressChange={progress}
                    style={{
                        width: width,
                        alignSelf: 'flex-start', // penting untuk menempel ke kiri
                    }}
                    mode="parallax"
                    modeConfig={{
                        parallaxScrollingScale: 1,
                        parallaxScrollingOffset: 0,
                        parallaxAdjacentItemScale: 1,
                    }}
                    pagingEnabled={false}
                    loop={false}
                    snapEnabled={false}
                    renderItem={({ item, index }) => (
                        <View
                            key={index}
                            style={{
                                flex: 1,
                                marginRight: 10,
                                justifyContent: 'center',

                            }}
                        >
                            <View className={`w-full p-3 ${backgroundCard} rounded-2xl `}>
                                <View className='flex-row gap-3 space-x-3'>
                                    <Image
                                        className='w-2/5 aspect-square rounded-2xl'
                                        source={item.image}
                                        resizeMode='cover'
                                    />

                                    <View className='flex-1'>
                                        <Text className={` ${color} text-base`}>{item.title}</Text>
                                        <Text className={` ${color} text-primary text-base mt-2`}>{item.desc}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity
                                    onPress={handlePress}
                                    className={`${bgButton} p-2 rounded-lg mt-3`}
                                >
                                    <Text className={`text-sm text-center ${colorButton}`}>Selengkapnya</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    )}
                />

            </View>
        </>
    )
}

export default CaraoselReport
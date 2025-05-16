import { Entypo } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

type Props = {
    dataCaraosel: {
        id: string;
        title: string;
        desc: string;
        image: any;
    }[];
    textTitle: string,
    margin: string

}

const { height } = Dimensions.get('window');
const width = Dimensions.get("window").width;

const CaraoselReport = ({ dataCaraosel, textTitle, margin }: Props) => {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);
    const handlePress = () => {
        console.log('Tombol custom ditekan!');
    };
    return (
        <>
            <View className={`flex-row justify-between items-center ${margin}`}>
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
                    height={300}
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
                            <View className={`rounded-2xl flex-1`}>
                                <Image
                                    className=' rounded-tl-3xl  rounded-br-3xl w-full h-40'
                                    source={item.image}
                                    resizeMode='cover'
                                />

                                <View className='py-3 flex-1' >
                                    <Text className={` text-lg text font-semibold`}>Demo Mahasiswa</Text>
                                    <Text className={` text-base `}>beberapa mahasiswa berdemo tentang hak asasin... </Text>
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
                                    onPress={handlePress}
                                    className=' p-2 rounded-lg  bg-primaryOrange '
                                >
                                    <Text className={`text-base text-center  text-white `}>Selengkapnya</Text>
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
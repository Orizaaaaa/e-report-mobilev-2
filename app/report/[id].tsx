import ButtonBack from '@/components/elements/buttonBack/ButtonBack';
import { Octicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, ScrollView, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

export default function ReportDetail() {
    const { width } = Dimensions.get('window');
    const { id } = useLocalSearchParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const imagesCaraosel = [
        require('../../assets/images/demo.png'),
        require('../../assets/images/study1.png'),
        require('../../assets/images/demo.png'),
    ];
    return (
        <ScrollView className='pt-16 px-3'>
            <View className="flex-row justify-between items-center px-3 bg-slate-200 p-3 rounded-full">
                <ButtonBack colorIcon="#FF840C" />
                <Octicons name="gear" size={24} color="#FF840C" />
            </View>

            <View className='my-7' style={{ position: 'relative', width: width - 29, height: 190 }}>
                <Carousel
                    loop
                    width={width - 23}
                    height={200}
                    data={imagesCaraosel}
                    scrollAnimationDuration={100}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }) => (
                        <Image
                            source={item}
                            style={{
                                width: '100%',
                                height: 200,
                                borderRadius: 20
                            }}
                            resizeMode="cover"
                        />
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
                    {imagesCaraosel.map((_, index) => (
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
            <View>
                <View>
                    <Text className='text-gray-500 font-light mb-1'>Permasalahan</Text>
                    <Text className='font-light'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente sequi temporibus delectus, corupti atque consectetur, optio consequuntur repellat molestias maiores dolorum commodi modi? Pariatur harum quaerat nobis, exercitationem incidunt ut?</Text>
                </View>
                <View className='my-7'>
                    <Text className='text-lg font-medium' >Lokasi Aduan</Text>
                </View>
            </View>

        </ScrollView>
    );
}
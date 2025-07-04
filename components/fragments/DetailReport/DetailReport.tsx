import React, { useState } from 'react'
import { Dimensions, Image, Linking, Text, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

type Props = {
    imageCaraosel: any
}

const DetailReport = ({ imageCaraosel }: Props) => {
    const { width } = Dimensions.get('window');
    const [activeIndex, setActiveIndex] = useState(0);
    const selectedLocation = {
        latitude: -6.175392,
        longitude: 106.827153,
    };
    const openInGoogleMaps = () => {
        if (selectedLocation) {
            const { latitude, longitude } = selectedLocation;
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url).catch(err => console.error('Gagal membuka Google Maps:', err));
        } else {
            alert('Lokasi belum dipilih');
        }
    };
    return (
        <View>
            <View className='my-7' style={{ position: 'relative', width: width - 29, height: 190 }}>
                <Carousel
                    loop
                    width={width - 23}
                    height={200}
                    data={imageCaraosel}
                    scrollAnimationDuration={100}
                    onSnapToItem={(index) => setActiveIndex(index)}
                    renderItem={({ item }: any) => (
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
            <View>
                <View>
                    <Text className='text-black font-bold mb-1'>Permasalahan</Text>
                    <Text className='font-light'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente sequi temporibus delectus, corupti atque consectetur, optio consequuntur repellat molestias maiores dolorum commodi modi? Pariatur harum quaerat nobis, exercitationem incidunt ut?</Text>
                </View>
                {/* <View className='my-3'>
                    <Text className='text-lg font-medium' >Lokasi Aduan</Text>
                </View> */}
            </View>

            {/* <View className='flex-row justify-between items-start'>
                <View className='flex-row justify-between items-start'>
                    <View className="flex-1 pr-2">
                        <Text className='font-light'>
                            Jalan Astana Anyar, Bandung, Jawa Barat, Indonesia, RT 04 RW 08
                        </Text>
                        <Text className='font-light text-sm mt-1 text-gray-400'>
                            Lat: -6.932977, Long: 107.599216
                        </Text>
                    </View>

                    <TouchableOpacity
                        className="ml-2"
                        onPress={openInGoogleMaps}
                    >
                        <FontAwesome5 name="map-marked-alt" size={20} color="#1E2A38" />
                    </TouchableOpacity>
                </View>
            </View> */}



            <View className='my-3'>
                <Text className='text-lg font-medium' >Sumber</Text>
            </View>


            <View className='flex-row justify-between items-end' >
                <View>
                    <Text className='text-sm font-thin'>Aduan ini telah</Text>
                    <Text className='text-sm font-medium' >Menunggu di Proses <Text className='font-light' >oleh</Text>  tim pemerintah</Text>
                    <Text className='text-sm font-light'>Minggu 01 Juni 2025 - 21-36, <Text className='text-primaryOrange font-medium' >Lihat Riwayat</Text> </Text>
                </View>
                {/*                 
                <View>
                    <Text className='py-1 px-2 border-2 border-primaryOrange text-sm rounded-lg text-primaryOrange' >
                        PRIORITAS
                    </Text>
                </View> */}

            </View>

        </View>
    )
}

export default DetailReport
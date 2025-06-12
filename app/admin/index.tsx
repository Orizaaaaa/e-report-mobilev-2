import AdminInfo from '@/components/elements/adminInfo/AdminInfo';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';

type Props = {}

const imagesCaraosel = [
    require('../../assets/images/demo.png'),
    require('../../assets/images/study1.png'),
    require('../../assets/images/demo.png'),
];

const index = (props: Props) => {
    const handlePress = () => {
        // Navigasi ke halaman detail dengan ID
        router.push(`/report/22`);
    };
    return (

        <SafeAreaView className=' pt-12  px-5 '>
            <ScrollView>
                <View className='flex-row justify-between items-center'>
                    <View>
                        <Text className='text-xl text-primaryNavy font-medium'>Hi, Admin desa rahayu 👋</Text>
                    </View>
                    <View>
                        <View className='w-16 h-16  rounded-full   '>
                            <Image
                                className='w-full h-full rounded-full'
                                source={require('../../assets/images/human.png')}
                                resizeMode='cover'
                            />
                        </View>
                    </View>
                </View>

                <View className="flex-row flex-wrap justify-between mt-6">
                    <AdminInfo icon={<FontAwesome name="file-text-o" size={24} color="orange" />} total="177" title="Laporan prioritas" />
                    <AdminInfo icon={<FontAwesome name="file-text-o" size={24} color="white" />} total="177" title="Laporan reguler" />
                    <AdminInfo icon={<MaterialCommunityIcons name="archive-check-outline" size={24} color="white" />} total="177" title="Laporan selesai" />
                    <AdminInfo icon={<Ionicons name="medal-outline" size={24} color="white" />} total="177" title="Lomba yang tersedia" />
                </View>



                {/* <View className='bg-white rounded-2xl mt-5 px-3 py-6  '>
                    <View>
                        <View className='flex-row justify-between items-center' >
                            <Text>Laporan Prioritas</Text>
                            <Text className='text-primaryOrange' >Lihat semua</Text>
                        </View>
                        <ScrollView className='mt-5 overflow-x-hidden' showsHorizontalScrollIndicator={false} horizontal={true} >
                            <CardReport heightImage='h-24' image={require('../../assets/images/demo.png')} handlepres={handlePress} />
                            <CardReport heightImage='h-24' image={require('../../assets/images/demo.png')} handlepres={handlePress} />
                            <CardReport heightImage='h-24' image={require('../../assets/images/demo.png')} handlepres={handlePress} />
                        </ScrollView>
                    </View>
                </View> */}



            </ScrollView>
        </SafeAreaView>


    )
}

export default index
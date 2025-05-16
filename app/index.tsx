import CardReport from '@/components/fragments/CardReport/CardReport';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import {
  ICarouselInstance
} from "react-native-reanimated-carousel";
const { height } = Dimensions.get('window');


const width = Dimensions.get("window").width;
export default function Index() {
  const navigation: any = useNavigation()
  const [searchText, setSearchText] = useState('');

  const ref = React.useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  const data = [
    {
      id: '1',
      title: 'Jalan Rusak',
      desc: 'lorem ipsum dolor sit amet...',
      image: require('../assets/images/demo.png')
    },
    {
      id: '2',
      title: 'title 1',
      desc: 'lorem ipsum dolor sit amet',
      image: require('../assets/images/demo.png')
    },
    {
      id: '3',
      title: 'title 1',
      desc: 'lorem ipsum dolor sit amet',
      image: require('../assets/images/demo.png')
    },
    {
      id: '4',
      title: 'title 1',
      desc: 'lorem ipsum dolor sit amet',
      image: require('../assets/images/demo.png')
    },
  ];

  const handlePress = () => {
    console.log('Tombol custom ditekan!');
  };




  return (
    <ScrollView className='pt-4 px-3 bg-white ' style={{ height: height }} >
      <View className="mb-40">
        <View className='flex-row items-center w-full justify-between  p-1   ' >

          <View className="gap-3 flex-col" >
            {/* <Text className="text-2xl">Hello !   </Text> */}
            <View className="flex-col gap-1">
              <Text className="text-xl font-semibold text-primaryBlack">Hi, Oriza Sativa 👋 </Text>
              <Text className="text-sm text-gray-500">Pamulang, Benda Baru, Tangerang Selatan </Text>
            </View>
          </View>

          <View className='w-16 h-16  rounded-xl   '>
            <Image
              className='w-full h-full rounded-3xl'
              source={require('../assets/images/human.png')}
              resizeMode='cover'
            />
          </View>

        </View>




        <View className="mt-5 flex-row items-center gap-2">
          <View className="flex-1 border-2 border-gray-300 h-14 px-2 rounded-lg flex-row items-center gap-2">
            <Feather name="search" size={24} color="#FF840C" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Cari..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View className=" flex-row justify-end">
            <View className="p-3 border-2 border-gray-300 rounded-xl">
              <MaterialIcons name="notifications-none" size={25} color="#FF840C" />
            </View>
          </View>
          <View className="w-14 border-2 border-gray-300 h-14 justify-center items-center rounded-lg">
            <Feather name="menu" size={24} color="#FF840C" />
          </View>


        </View>



        {/* buat di sini memiliki lengkungan sampai menutupi */}
        <View className='w-full h-40 rounded-3xl mt-5 overflow-hidden relative'>
          {/* Gambar */}
          <Image
            className='w-full h-full'
            source={require('../assets/images/study1.png')}
            resizeMode='cover'
          />

          {/* Overlay hitam */}
          <View className='absolute inset-0 bg-black/30' />

          {/* Konten di bawah */}
          <View className='absolute bottom-0 left-0 right-0 p-5'>
            <Text className='text-white text-lg'>Lomba Koding 3 April</Text>
            <Text className='text-white text-sm'>Terbuka untuk umum</Text>

            <View className='flex-row justify-between items-center mt-3'>
              <View>
                <Text className='text-black text-sm py-2 px-3 bg-slate-200 rounded-2xl'>Gabung</Text>
              </View>

              <View className='p-2 bg-slate-200 rounded-full'>
                <MaterialIcons name="keyboard-double-arrow-right" size={20} color="black" />
              </View>
            </View>
          </View>
        </View>


        <View className='flex-row justify-between items-center mt-7 px-1'>
          <Text>Laporan prioritas</Text>
          <TouchableOpacity
            onPress={handlePress}
          >
            <Text className='text-primaryOrange'>Lihat Semua</Text>
          </TouchableOpacity>

        </View>

        <ScrollView className='mt-5 overflow-x-hidden' horizontal={true} style={{ overflowX: 'hidden' }}>
          <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
          <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
          <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
        </ScrollView>



      </View>
    </ScrollView >
  );
}

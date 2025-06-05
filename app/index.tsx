import CardReport from '@/components/fragments/CardReport/CardReport';
import IndicatorInfo from '@/components/fragments/IndicatorInfo/IndicatorInfo';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import { router, useNavigation } from "expo-router";
import React, { useState } from "react";
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
const { height } = Dimensions.get('window');

export default function Index() {
  const navigation: any = useNavigation()
  const [searchText, setSearchText] = useState('');


  const handlePress = () => {
    // Navigasi ke halaman detail dengan ID
    router.push(`/report/22`);
  };




  return (
    <ScrollView className='pt-12 px-3 bg-white ' style={{ height: height }} >
      <View className="mb-40">
        <View>

        </View>
        <View className='flex-row items-center w-full justify-between p-1    ' >

          <View className="gap-3 flex-col" >
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
          <View className="flex-1 border-2 border-primaryNavy h-14 px-2 rounded-lg flex-row items-center gap-2">
            <Feather name="search" size={24} color="#1E2A38" />
            <TextInput
              className="flex-1 text-gray-800"
              placeholder="Cari..."
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>

          <View className=" flex-row justify-end">
            <View className="p-3 border-2 border-primaryNavy rounded-xl">
              <MaterialIcons name="notifications-none" size={25} color="#1E2A38" />
            </View>
          </View>
          <View className="w-14 border-2 border-primaryNavy h-14 justify-center items-center rounded-lg">
            <Feather name="menu" size={24} color="#1E2A38" />
          </View>


        </View>




        <View className='w-full h-40 rounded-3xl mt-5 overflow-hidden relative'>
          {/* Gambar */}
          <Image
            className='w-full h-full'
            source={require('../assets/images/study1.png')}
            resizeMode='cover'
          />

          {/* Overlay hitam */}
          <View className='absolute inset-0 bg-black/35' />

          {/* Konten di bawah */}
          <View className='absolute bottom-0 left-0 right-0 p-5'>
            <Text className='text-white text-lg'>Lomba Koding <Text className='text-primaryOrange' >3</Text>  April</Text>
            <Text className='text-white text-sm'>Terbuka untuk umum</Text>

            <View className='flex-row justify-between items-center mt-3'>
              <View>
                <Text className=' text-sm py-2 px-3 bg-primaryNavy text-white rounded-2xl'>Gabung</Text>
              </View>

              <View className='p-2 bg-primaryNavy rounded-full'>
                <MaterialIcons name="keyboard-double-arrow-right" size={20} color="white" />
              </View>
            </View>
          </View>
        </View>


        <IndicatorInfo finised='177' onProgress='44' total='221' />


        {/* laporan */}
        <View>
          <View className='flex-row justify-between items-center mt-7 px-1'>
            <Text>Laporan prioritas</Text>
            <TouchableOpacity
              onPress={handlePress}
            >
              <Text className='text-primaryOrange'>Lihat Semua</Text>
            </TouchableOpacity>

          </View>



          <ScrollView className='mt-5 overflow-x-hidden' showsHorizontalScrollIndicator={false} horizontal={true} >
            <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
            <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
            <CardReport image={require('../assets/images/demo.png')} handlepres={handlePress} />
          </ScrollView>
        </View>





      </View>
    </ScrollView >
  );
}

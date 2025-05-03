import { useNavigation } from "expo-router";
import { useRef } from "react";
import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
const { height } = Dimensions.get('window');
import { Feather, MaterialIcons } from '@expo/vector-icons';
import CardBuilding from "@/components/fragments/CardBuilding/CardBuilding";
import GaleriIcon from '../assets/images/galeri.svg';
import ReportIcon from '../assets/images/report.svg';
import BuildingIcon from '../assets/images/building.svg';
import OtherIcon from '../assets/images/other.svg';
import Svg, { Circle } from "react-native-svg";


export default function Index() {
  const navigation: any = useNavigation()
  const ref: any = useRef();
  const data = [
    {
      title: 'Jalan Rusak',
      desc: 'Lorem ipsum dolor s...'
    },
    {
      title: 'Jalan Rusak',
      desc: 'Lorem ipsum dolor s...'
    },
    {
      title: 'Jalan Rusak',
      desc: 'Lorem ipsum dolor s...'
    },
    {
      title: 'Jalan Rusak',
      desc: 'Lorem ipsum dolor s...'
    },

  ]



  const layananData = [
    {
      image: <ReportIcon width="100%" height="100%" fill="black" />,
      label: 'Laporan'
    },
    {
      image: <BuildingIcon width="100%" height="100%" fill="black" />,
      label: 'Bangunan'
    },
    {
      image: <GaleriIcon width="100%" height="100%" fill="black" />,
      label: 'Galeri desa'
    },

    {
      image: <OtherIcon width="100%" height="100%" fill="black" />,
      label: 'Lainnya'
    },
  ];
  console.log(GaleriIcon);

  return (
    <ScrollView className='pt-4 px-2 bg-white' style={{ height: height }} >
      <View className="mb-32">
        <View className='flex-row items-center w-full justify-between  p-1   ' >

          <View className="gap-3 flex-col" >
            <Text className="text-2xl">👋 Hello !  </Text>
            <View className="flex-col gap-1">
              <Text className="text-3xl font-semibold text-primary">Ahmad Kautsar </Text>
              <Text className="text-sm text-gray-500">📍Pamulang, Benda Baru, Tangerang Selatan </Text>
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

        <View className=" flex-row justify-end  ">
          <View className="p-2 border-2 border-gray-300 rounded-xl">
            <MaterialIcons name="notifications-none" size={25} color="black" />
          </View>
        </View>


        <View className="mt-5 flex flex-row items-center  gap-2">
          <View className="flex-1 border-2 border-gray-300 h-14 justify-center px-2 rounded-lg">
            <View className="flex-row items-center gap-2">
              <Feather name="search" size={24} color="gray" />
              <Text className="text-gray-400" >Cari apa saja...</Text>
            </View>
          </View>
          <View className="w-24 border-2 border-gray-300 h-14 justify-center items-center rounded-lg">
            <Feather name="menu" size={24} color="black" />
          </View>
        </View>

        {/* layanan */}
        <View className="px-2">
          <Text className="text-lg font-semibold my-5 text-slate-600">Layanan</Text>
          <View className="flex-row flex-wrap justify-between">
            {layananData.map((item, index) => (
              <View key={index} className="items-center w-[20%] my-2">
                <TouchableOpacity className="w-24 h-20 p-3 rounded-xl bg-white shadow-xl shadow-slate-500">
                  {item.image}
                </TouchableOpacity>
                <Text className="mt-2 text-sm text-center text-slate-600">{item.label}</Text>
              </View>
            ))}
          </View>

        </View>

        {/*  */}
        <View className="bg-primary h-36 my-6 rounded-xl p-5 overflow-hidden">
          <View className="flex-row items-center justify-between h-full">
            <View className="flex-row items-center gap-2">
              <Svg height="60" width="60" viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F9F8A7"
                  strokeWidth="10"
                  opacity={0.2}
                  fill="none"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F9F8A7"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={(1 - 0.45) * 2 * Math.PI * 45} // 45% progress
                  strokeLinecap="round"
                  rotation="-90"
                  origin="50,50"
                  fill="none"
                />

              </Svg>
              <Svg height="60" width="60" viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F9F8A7"
                  strokeWidth="10"
                  opacity={0.2}
                  fill="none"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F9F8A7"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={(1 - 0.45) * 2 * Math.PI * 45} // 45% progress
                  strokeLinecap="round"
                  rotation="-90"
                  origin="50,50"
                  fill="none"
                />

              </Svg>
              <Svg height="60" width="60" viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F9F8A7"
                  strokeWidth="10"
                  opacity={0.2}
                  fill="none"
                />
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="#F9F8A7"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 45}
                  strokeDashoffset={(1 - 0.45) * 2 * Math.PI * 45} // 45% progress
                  strokeLinecap="round"
                  rotation="-90"
                  origin="50,50"
                  fill="none"
                />

              </Svg>


            </View>






            <View className="relative">
              <View className="absolute right-[-140] bottom-[-190] h-80 w-80 rounded-full bg-gray-400 opacity-20" />
              <View className="absolute right-[-110] bottom-[-160] h-64 w-64 rounded-full bg-gray-500 opacity-30" />
              <View className="absolute right-[-80] bottom-[-130] h-48 w-48 rounded-full bg-gray-600 opacity-40" />
              <View className="absolute right-[-50] bottom-[-100] h-32 w-32 rounded-full bg-gray-700 opacity-60" />
            </View>
          </View>
        </View>


        <Text className="text-lg font-semibold mb-5 text-slate-600">Laporan Prioritas 🔥</Text>

        {/* data belum di map */}
        <View className="flex flex-row flex-wrap ">
          {data.map((item: any, index: any) => (
            <CardBuilding key={index} title={item.title}
              desc={item.desc} location={() => navigation.navigate('report')} />
          ))}
        </View>

      </View>
    </ScrollView >
  );
}

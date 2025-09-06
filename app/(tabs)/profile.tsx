import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { AntDesign, Entypo, FontAwesome5, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function Profile() {
    return (
        <View  >
            <View className="bg-white">
                {/* <View className="bg-primaryNavy py-12  rounded-bl-[60px]" > */}
                <View className="bg-['#2AA8E1'] py-12  rounded-bl-[60px]" >
                    <View className="flex-row justify-between items-center px-3">
                        <ButtonBack colorIcon="white" />
                        <Octicons name="gear" size={24} color="white" />
                    </View>
                    <View className="flex justify-center items-center">
                        <View className='w-28 h-28  rounded-xl   '>
                            <Image
                                className='w-full h-full rounded-full'
                                source={require('../../assets/images/human.png')}
                                resizeMode='cover'
                            />
                        </View>
                        <View className="mt-5" >
                            <Text className="text-white text-xl">Gabriel Yonathan</Text>

                        </View>
                    </View>
                </View>
            </View>

            <View className="bg-['#2AA8E1']">
                {/* <View className="bg-primaryNavy"> */}
                <View className="bg-white rounded-tr-[60px] p-4  -mt-0 h-full" >
                    <View className="mt-9 flex-row justify-between px-2" >
                        <Text className="text-lg font-medium">Informasi Pribadi</Text>
                        <AntDesign name="edit" size={24} color="#002B5A" />
                    </View>

                    <View className=" w-full bg-['#2AA8E1'] py-3 mt-6  rounded-2xl" >
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Ionicons name="person-circle-outline" size={24} color="white" />
                                    <Text className="text-white">NIK</Text>
                                </View>
                                <Text className="text-white">23332121212121</Text>
                            </View>
                        </View>
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Fontisto name="email" size={24} color="white" />
                                    <Text className="text-white" >email</Text>
                                </View>
                                <Text className="text-white">gabrielmonyet@gmail.com</Text>
                            </View>
                        </View>
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <FontAwesome5 name="whatsapp" size={24} color="white" />
                                    <Text className="text-white">nomor handphone</Text>
                                </View>
                                <Text className="text-white">085150586363</Text>
                            </View>
                        </View>
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Entypo name="location-pin" size={22} color="white" />
                                    <Text className="text-white">lokasi</Text>
                                </View>
                                <Text className="text-white">Garut, Jawa Barat, Indonesia</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => {
                            AsyncStorage.removeItem('user');
                            router.replace('/(tabs)/login');
                        }} className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row items-center px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Text className="text-white">Logout</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>


        </View>

    );
}

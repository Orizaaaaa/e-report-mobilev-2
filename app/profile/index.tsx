import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { AntDesign, Entypo, FontAwesome5, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, ScrollView, Text, View } from "react-native";

export default function Profile() {

    return (
        <ScrollView >
            <View className="bg-white">
                <View className="bg-primaryNavy py-12  rounded-bl-[60px]" >
                    <View className="flex-row justify-between items-center px-3">
                        <ButtonBack colorIcon="white" />
                        <Octicons onPress={() => router.push("/profile/setting")} name="gear" size={24} color="white" />
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

            <View className="bg-primaryNavy">
                <View className="bg-white rounded-tr-[60px] p-4  -mt-0 h-full" >
                    <View className="mt-5 flex-row justify-between pr-2" >
                        <Text className="text-lg font-medium">Informasi Pribadi</Text>
                        <AntDesign name="edit" size={24} color="#FF840C" />
                    </View>

                    <View className="w-full py-3  rounded-2xl">

                        {/* Nama */}
                        <View className="mt-3">
                            <Text className="text-gray-400 mb-1">Nama</Text>
                            <View className="py-2 bg-gray-200 rounded-xl">
                                <View className="flex-row justify-between px-4 py-2 items-center">
                                    <Text>Oriza Sativa Cikal .M</Text>
                                    <Ionicons name="person-circle-outline" size={24} color="gray" />
                                </View>
                            </View>
                        </View>

                        <View className="mt-3">
                            <Text className="text-gray-400 mb-1">NIK</Text>
                            <View className="py-2 bg-gray-200 rounded-xl">
                                <View className="flex-row justify-between px-4 py-2 items-center">
                                    <Text>23332121212121</Text>
                                    <AntDesign name="idcard" size={24} color="gray" />
                                </View>
                            </View>
                        </View>

                        {/* Email */}
                        <View className="mt-3">
                            <Text className="text-gray-400 mb-1">Email</Text>
                            <View className="py-2 bg-gray-200 rounded-xl">
                                <View className="flex-row justify-between px-4 py-2 items-center">
                                    <Text>oryza@gmail.com</Text>
                                    <Fontisto name="email" size={24} color="gray" />
                                </View>
                            </View>
                        </View>

                        {/* Nomor Handphone */}
                        <View className="mt-3">
                            <Text className="text-gray-400 mb-1">Nomor Handphone</Text>
                            <View className="py-2 bg-gray-200 rounded-xl">
                                <View className="flex-row justify-between px-4 py-2 items-center">
                                    <Text>085150586363</Text>
                                    <FontAwesome5 name="whatsapp" size={24} color="gray" />
                                </View>
                            </View>
                        </View>

                        {/* Lokasi */}
                        <View className="mt-3">
                            <Text className="text-gray-400 mb-1">Lokasi</Text>
                            <View className="py-2 bg-gray-200 rounded-xl">
                                <View className="flex-row justify-between px-4 py-2 items-center">
                                    <Text>Garut, Jawa Barat, Indonesia</Text>
                                    <Entypo name="location-pin" size={22} color="gray" />
                                </View>
                            </View>
                        </View>


                    </View>


                </View>
            </View>
        </ScrollView>

    );
}

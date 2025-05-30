import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { AntDesign, Entypo, FontAwesome5, Fontisto, Ionicons, Octicons } from "@expo/vector-icons";
import { Image, Text, View } from "react-native";

export default function Profile() {
    return (
        <View  >
            <View className="bg-white">
                <View className="bg-primaryOrange py-12  rounded-bl-[60px]" >
                    <View className="flex-row justify-between items-center px-3">
                        <ButtonBack colorIcon="white" />
                        <Octicons name="gear" size={24} color="white" />
                    </View>
                    <View className="flex justify-center items-center">
                        <View className='w-28 h-28  rounded-xl   '>
                            <Image
                                className='w-full h-full rounded-3xl'
                                source={require('../assets/images/human.png')}
                                resizeMode='cover'
                            />
                        </View>
                        <View className="mt-5" >
                            <Text className="text-white">Gabriel Yonathan</Text>

                        </View>
                    </View>
                </View>
            </View>

            <View className="bg-primaryOrange">
                <View className="bg-white rounded-tr-[60px] p-4  -mt-0 h-full" >
                    <View className="mt-9 flex-row justify-between px-2" >
                        <Text className="text-lg font-semibold">Informasi Pribadi</Text>
                        <AntDesign name="edit" size={24} color="#FF840C" />
                    </View>

                    <View className=" w-full bg-slate-200 py-3 mt-6  rounded-2xl" >
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Ionicons name="person-circle-outline" size={24} color="gray" />
                                    <Text className="text-gray-500">NIK</Text>
                                </View>
                                <Text>23332121212121</Text>
                            </View>
                        </View>
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Fontisto name="email" size={24} color="gray" />
                                    <Text className="text-gray-500" >email</Text>
                                </View>
                                <Text>gabrielmonyet@gmail.com</Text>
                            </View>
                        </View>
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <FontAwesome5 name="whatsapp" size={24} color="gray" />
                                    <Text className="text-gray-500">nomor handphone</Text>
                                </View>
                                <Text>085150586363</Text>
                            </View>
                        </View>
                        <View className="border-b-2 border-white pb-2 mb-2" >
                            <View className="flex-row justify-between px-4 py-2">
                                <View className="flex-row justify-center items-center gap-2">
                                    <Entypo name="location-pin" size={22} color="gray" />
                                    <Text className="text-gray-500">lokasi</Text>
                                </View>
                                <Text>Garut, Jawa Barat, Indonesia</Text>
                            </View>
                        </View>

                    </View>
                </View>
            </View>


        </View>

    );
}

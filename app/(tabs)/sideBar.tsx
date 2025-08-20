import { Feather, FontAwesome6, Ionicons, MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

type Props = {
    onNavigate?: (screen: string) => void;
};

const SideBar = ({ onNavigate }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current; // posisi awal di luar layar kiri

    const toggleSidebar = () => {
        if (isOpen) {
            Animated.timing(slideAnim, {
                toValue: -screenWidth,
                duration: 300,
                useNativeDriver: true,
            }).start(() => setIsOpen(false));
        } else {
            setIsOpen(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    return (
        <View className="flex-1">
            {/* Tombol Toggle */}
            <ScrollView>
                <View className="bg-[#2AA8E1] rounded-b-[25px]" >
                    <View className="py-12 px-4">
                        <View className="flex-row items-center gap-4 mb-5">
                            <TouchableOpacity
                                onPress={toggleSidebar}
                            >
                                <Ionicons name="menu" size={28} color="white" />
                            </TouchableOpacity>
                            <Text className="text-white  ml-2 text-lg">Selamat Datang, Admin</Text>
                        </View>

                        <View className="flex-row flex-wrap justify-between">
                            {/* Kotak 1 */}
                            <View className="bg-white rounded-xl shadow-2xl px-5 py-2 w-[48%]  mb-4 flex justify-center gap-3">
                                <View className="flex-row items-center gap-4" >
                                    <FontAwesome6 name="user-nurse" size={24} color="#205072" />
                                    <Text className="text-gray-500">Dokter Aktif</Text>
                                </View>
                                <Text className="text-xl font-semibold text-gray-600" >6</Text>
                            </View>

                            {/* Kotak 2 */}
                            <View className="bg-white rounded-xl shadow-2xl px-5 py-2 w-[48%]  mb-4 flex justify-center gap-3">
                                <View className="flex-row items-center gap-4" >
                                    <FontAwesome6 name="newspaper" size={24} color="#205072" />
                                    <Text className="text-gray-500">Publish Artikel</Text>
                                </View>
                                <Text className="text-xl font-semibold text-gray-600" >6</Text>
                            </View>

                            {/* Kotak 3 */}
                            <View className="bg-white rounded-xl shadow-2xl px-5 py-2 w-[48%]  mb-4 flex justify-center gap-3">
                                <View className="flex-row items-center gap-4" >
                                    <Feather name="gift" size={24} color="#205072" />
                                    <Text className="text-gray-500">Promo Aktif</Text>
                                </View>
                                <Text className="text-xl font-semibold text-gray-600" >6</Text>
                            </View>

                            {/* Kotak 4 */}
                            <View className="bg-white rounded-xl shadow-2xl px-5 py-2 w-[48%]  mb-4 flex justify-center gap-3">
                                <View className="flex-row items-center gap-4" >
                                    <MaterialIcons name="people-alt" size={24} color="#205072" />
                                    <Text className="text-gray-500">Pengguna</Text>
                                </View>
                                <Text className="text-xl font-semibold text-gray-600" >6</Text>
                            </View>
                        </View>


                    </View>
                </View>

            </ScrollView>

            {/* SIDEBAR DI SINI BOS */}

            {/* Overlay */}
            {isOpen && (
                <TouchableOpacity
                    className="absolute top-0 left-0 right-0 bottom-0 bg-black/40"
                    onPress={toggleSidebar}
                    activeOpacity={1}
                />
            )}

            {/* Sidebar */}
            <Animated.View
                style={{
                    transform: [{ translateX: slideAnim }],
                }}
                className="absolute top-0 bottom-0 left-0 w-3/4 bg-white "
            >
                <ScrollView className="bg-[#D4F2FF]" >
                    {/* Header */}
                    <View className="mb-8 bg-[#2AA8E1] py-16 rounded-br-[60px] px-6 justify-center">
                        <View className="flex-row items-center gap-4">
                            {/* Avatar */}
                            <View className="w-20 h-20 rounded-full bg-green-200 items-center justify-center">
                                <Ionicons name="person" size={40} color="#16a34a" />
                            </View>

                            {/* Nama + Role */}
                            <View className="justify-center">
                                <Text className="text-lg text-white font-medium">Bunga Melati</Text>
                                <Text className="text-white font-light">Admin</Text>
                            </View>
                        </View>
                    </View>


                    <View className="p-6" >
                        {/* Menu Items */}
                        <TouchableOpacity
                            className="flex-row items-center py-3 bg-[#2AA8E1] px-3  rounded-md"
                            onPress={() => {
                                onNavigate?.("Home");
                                toggleSidebar();
                            }}
                        >
                            <Ionicons name="home-outline" size={22} color="#ffff" />
                            <Text className="ml-3 text-base text-white">Home</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center p-3"
                            onPress={() => {
                                onNavigate?.("Profile");
                                toggleSidebar();
                            }}
                        >
                            <Ionicons name="person-outline" size={22} color="#374151" />
                            <Text className="ml-3 text-base text-gray-700">Profile</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            className="flex-row items-center p-3"
                            onPress={() => {
                                onNavigate?.("Logout");
                                toggleSidebar();
                            }}
                        >
                            <Ionicons name="log-out-outline" size={22} color="red" />
                            <Text className="ml-3 text-base text-red-600">Logout</Text>
                        </TouchableOpacity>
                    </View>


                </ScrollView>
            </Animated.View>
        </View>
    );
};

export default SideBar;

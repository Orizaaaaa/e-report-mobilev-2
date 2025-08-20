import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

type Props = {
    onNavigate?: (screen: string) => void;
};

const Article = ({ onNavigate }: Props) => {
    const route = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

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
        <View className="flex-1 bg-white">

            <View className="pt-12 px-4">
                <View className="flex-row items-center justify-between mb-5">
                    {/* Kiri */}
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={toggleSidebar}>
                            <Ionicons name="menu" size={28} color="#205072" />
                        </TouchableOpacity>
                        <Text className="text-[#205072] ml-2 text-lg">Artikel Kesehatan</Text>
                    </View>

                    {/* Kanan */}
                    <MaterialIcons name="notifications-none" size={24} color="black" />
                </View>
            </View>

            <ScrollView className="mt-5  px-4" >
                <TouchableOpacity onPress={() =>
                    router.push({
                        pathname: "/admin/articles/[id]", // path dinamis
                        params: { id: "33" },             // params harus string
                    })
                } className="p-3 bg-white rounded-xl shadow-2xl" >
                    <View className="bg-gray-600 py-16 rounded-xl" >

                    </View>
                    <View className="py-2" >
                        <Text className="font-medium text-[#205072]" >Cara sikat bool</Text>
                        <Text className="text-sm text-[#205072]" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa dignissimos rerum, eius, tempora deserunt dolorum facere natus minima fugit harum aliquam, doloribus in eligendi reprehenderit. Voluptatem totam quia non commodi.</Text>
                    </View>
                    <View className="flex-row items-center gap-6" >
                        <Text className="text-green-800" >Edit</Text>
                        <Text className="text-red-600" >Hapus</Text>
                    </View>
                </TouchableOpacity>

            </ScrollView>

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

export default Article;

import ButtonNav from "@/components/fragments/ButtonNav/ButtonNav";
import { db } from "@/database/firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs } from "firebase/firestore";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

type Props = {
    onNavigate?: (screen: string) => void;
};

const Article = ({ onNavigate }: Props) => {
    const route = useRouter();
    const [articles, setArticles] = useState([] as any);
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

    useFocusEffect(
        useCallback(() => {
            const fetchReports = async () => {
                try {
                    const snapshot = await getDocs(collection(db, 'articles'));
                    const articlesData = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setArticles(articlesData);
                } catch (err) {
                    console.error('❌ Gagal mengambil laporan:', err);
                }
            };

            fetchReports();

            return () => {
                // cleanup jika diperlukan
            };
        }, [])
    );

    console.log(articles);


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

            <View className="px-4 bg-primaryNavy py-3 rounded-b-[60px]" >
                <TouchableOpacity onPress={() => router.push("/admin/articles/addArticles")}>
                    <Text className="text-center text-white"  >
                        Tambah Artikel
                    </Text>

                </TouchableOpacity>
            </View>

            <ScrollView className="mt-5  px-4" >
                {articles.map((item: any) => (
                    <TouchableOpacity key={item.id} onPress={() =>
                        router.push({
                            pathname: "/admin/articles/[id]", // path dinamis
                            params: { id: item.id },             // params harus string
                        })
                    } className="p-3 bg-white rounded-xl shadow-2xl mb-6" >
                        <Image
                            source={{ uri: item.image }}
                            style={{
                                width: '100%',
                                height: 125,
                                borderRadius: 10
                            }}
                            className='relative'
                            resizeMode="cover"
                        />
                        <View className="py-2" >
                            <Text className="font-medium text-[#205072]" >{item.title}</Text>
                            <Text className="text-sm text-[#205072]" >{item.desc}</Text>
                        </View>
                        <View className="flex-row items-center gap-6" >
                            <Text className="text-green-800" >Edit</Text>
                            <Text className="text-red-600" >Hapus</Text>
                        </View>
                    </TouchableOpacity>
                ))}


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
                        <ButtonNav title="Home"
                            onPress={() => {
                                router.push("/admin/home");
                                toggleSidebar();
                            }}
                            icon={"home-outline"}
                        />

                        <ButtonNav title="Articles"
                            onPress={() => {
                                router.push("/admin/articles");
                                toggleSidebar();
                            }}
                            icon={"newspaper-outline"}
                        />

                        <ButtonNav title="Promo"
                            onPress={() => {
                                router.push("/admin/promo");
                                toggleSidebar();
                            }}
                            icon={"ticket-outline"}
                        />

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

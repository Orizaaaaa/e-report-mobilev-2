import ButtonNav from "@/components/fragments/ButtonNav/ButtonNav";
import { db } from "@/database/firebase";
import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Image } from "react-native-animatable";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

type Props = {
    onNavigate?: (screen: string) => void;
};

const Promo = ({ onNavigate }: Props) => {
    const route = useRouter();
    const [promos, setPromos] = useState([] as any[]);
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

    const fetchPromos = async () => {
        try {
            const snapshot = await getDocs(collection(db, "promo"));
            const promosData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPromos(promosData);
        } catch (err) {
            console.error("❌ Gagal mengambil data promo:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchPromos();
            return () => { };
        }, [])
    );

    // Fungsi untuk menghapus promo
    const handleDeletePromo = (promoId: string, promoName: string) => {
        Alert.alert(
            "Konfirmasi Hapus",
            `Apakah Anda yakin ingin menghapus promo ${promoName}?`,
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "promo", promoId));
                            Alert.alert("Sukses", "Promo berhasil dihapus");
                            // Refresh daftar promo
                            fetchPromos();
                        } catch (error) {
                            console.error("Error deleting promo: ", error);
                            Alert.alert("Error", "Gagal menghapus promo");
                        }
                    }
                }
            ]
        );
    };

    // Fungsi untuk format harga
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
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
                        <Text className="ml-3 text-lg text-[#205072] ">Promo</Text>
                    </View>

                    {/* Kanan */}
                    <MaterialIcons name="notifications-none" size={24} color="black" />
                </View>
            </View>

            {/* Tambah Promo */}
            <View className="flex items-end">
                <TouchableOpacity className="px-4 mr-5 rounded-lg mt-3 bg-[#FEDD3F] py-3" onPress={() => router.push("/admin/promo/addPromo")}>
                    <Text className="text-center text-primaryNavy font-semibold">Tambah Promo</Text>
                </TouchableOpacity>
            </View>

            <ScrollView className="mt-5 px-4 mb-20">
                {promos.map((item) => (
                    <View key={item.id} className="shadow-2xl rounded-2xl bg-white p-4 mb-4">
                        <TouchableOpacity onPress={() => route.push(`/admin/promo/${item.id}` as any)}>
                            <View className='w-full h-36 mr-6'>
                                <Image
                                    className='w-full h-full rounded-lg'
                                    source={{ uri: item.image }}
                                    resizeMode='cover'
                                />
                            </View>
                            <Text className="mt-3 text-xl text-[#205072] font-medium">{item.title}</Text>
                            <View className="self-start">
                                <Text className="p-2 rounded-xl bg-[#FEDD3F] text-[#205072] my-2 w-fit font-light">
                                    {item.start_periode} - {item.end_periode}
                                </Text>
                            </View>

                            <View className="flex flex-col mb-5">
                                <Text className="text-lg font-semibold text-[#FEDD3F]">
                                    {formatPrice(item.price_promo)}
                                </Text>
                                <Text className="text-gray-500 line-through">
                                    {formatPrice(item.real_price)}
                                </Text>
                            </View>

                            <View className="flex-row gap-3 justify-end">
                                <TouchableOpacity onPress={() => route.push(`/admin/promo/${item.id}/edit` as any)}>
                                    <AntDesign name="edit" size={24} color="black" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleDeletePromo(item.id, item.title)}>
                                    <Feather name="trash-2" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
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
                        <ButtonNav title="Dashboard"
                            onPress={() => {
                                router.push("/admin/home");
                                toggleSidebar();
                            }}
                            icon={"home-outline"}
                        />

                        <ButtonNav title="Artikel Kesehatan"
                            onPress={() => {
                                router.push("/admin/articles");
                                toggleSidebar();
                            }}
                            icon={"newspaper-outline"}
                        />

                        <ButtonNav
                            title="Daftar Dokter"
                            onPress={() => {
                                router.push("/admin/doctors");
                                toggleSidebar();
                            }}
                            icon={"medkit-outline"}
                        />

                        <ButtonNav
                            title="Fasilitas Klinik"
                            onPress={() => {
                                router.push("/admin/facilities");
                                toggleSidebar();
                            }}
                            icon={"business-outline"}
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
                                AsyncStorage.removeItem('user');
                                router.replace('/(tabs)/login');
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

export default Promo;
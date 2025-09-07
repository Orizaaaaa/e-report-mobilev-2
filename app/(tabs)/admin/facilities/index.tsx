import ButtonNav from "@/components/fragments/ButtonNav/ButtonNav";
import { db } from "@/database/firebase";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useRouter } from "expo-router";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import React, { useCallback, useRef, useState } from "react";
import { Alert, Animated, Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const screenWidth = Dimensions.get("window").width;

type Props = {
    onNavigate?: (screen: string) => void;
};

const Facilities = ({ onNavigate }: Props) => {
    const route = useRouter();
    const [facilities, setFacilities] = useState([] as any);
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

    const fetchFacilities = async () => {
        try {
            const snapshot = await getDocs(collection(db, "facilities"));
            const facilitiesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFacilities(facilitiesData);
        } catch (err) {
            console.error("❌ Gagal mengambil data fasilitas:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchFacilities();
            return () => { };
        }, [])
    );

    // Fungsi untuk menghapus fasilitas
    const handleDeleteFacility = (facilityId: string, facilityName: string) => {
        Alert.alert(
            "Konfirmasi Hapus",
            `Apakah Anda yakin ingin menghapus fasilitas ${facilityName}?`,
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
                            await deleteDoc(doc(db, "facilities", facilityId));
                            Alert.alert("Sukses", "Fasilitas berhasil dihapus");
                            // Refresh daftar fasilitas
                            fetchFacilities();
                        } catch (error) {
                            console.error("Error deleting facility: ", error);
                            Alert.alert("Error", "Gagal menghapus fasilitas");
                        }
                    }
                }
            ]
        );
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="pt-12 px-4">
                <View className="flex-row items-center justify-between mb-5">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={toggleSidebar}>
                            <Ionicons name="menu" size={28} color="#205072" />
                        </TouchableOpacity>
                        <Text className="text-[#205072] ml-2 text-lg">Daftar Fasilitas</Text>
                    </View>
                    <MaterialIcons name="notifications-none" size={24} color="black" />
                </View>
            </View>

            {/* Tambah Fasilitas */}
            <View className="flex items-end">
                <TouchableOpacity className="px-4 mr-5 rounded-lg mt-3 bg-[#FEDD3F] py-3" onPress={() => router.push("/admin/facilities/addFacilities")}>
                    <Text className="text-center text-primaryNavy font-semibold">Tambah Fasilitas</Text>
                </TouchableOpacity>
            </View>

            {/* List Fasilitas */}
            <ScrollView className="mt-5 px-4 mb-20">
                {facilities.map((item: any) => (
                    <View key={item.id} className="mb-4 rounded-2xl shadow-lg bg-white">
                        <TouchableOpacity
                            onPress={() =>
                                router.push({
                                    pathname: "/admin/facilities/[id]",
                                    params: { id: item.id },
                                })
                            }
                            activeOpacity={0.8}
                            className="flex-row h-28"
                        >
                            {/* Gambar Fasilitas */}
                            <View className="h-full w-36">
                                <Image
                                    source={{ uri: item.image }}
                                    className="w-32 h-full rounded-2xl"
                                    resizeMode="cover"
                                />
                            </View>

                            {/* Info Fasilitas */}
                            <View className="flex-col gap-2 m-3 flex-1 justify-center">
                                <View className="flex-col">
                                    <Text className="text-md font-semibold text-primaryNavy">
                                        {item.title}
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {/* Tombol Hapus */}
                        <TouchableOpacity
                            onPress={() => handleDeleteFacility(item.id, item.title)}
                            className="absolute top-2 right-2 bg-red-500 p-2 rounded-full"
                        >
                            <Ionicons name="trash-outline" size={20} color="white" />
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
                className="absolute top-0 bottom-0 left-0 w-3/4 bg-white"
            >
                <ScrollView className="bg-[#D4F2FF]">
                    {/* Header Sidebar */}
                    <View className="mb-8 bg-[#2AA8E1] py-16 rounded-br-[60px] px-6 justify-center">
                        <View className="flex-row items-center gap-4">
                            <View className="w-20 h-20 rounded-full bg-green-200 items-center justify-center">
                                <Ionicons name="person" size={40} color="#16a34a" />
                            </View>
                            <View className="justify-center">
                                <Text className="text-lg text-white font-medium">Bunga Melati</Text>
                                <Text className="text-white font-light">Admin</Text>
                            </View>
                        </View>
                    </View>

                    {/* Menu Items */}
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

export default Facilities;
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

const PromoDetail = () => {
    const data = {
        image: null,
        title: "Diskon Besar Akhir Tahun",
        start_periode: "27 Agustus 2025",
        end_periode: "30 Agustus 2025",
        real_price: 350000,
        price_promo: 200000,
        des: "Nikmati promo akhir tahun dengan potongan harga super besar untuk semua produk fashion favoritmu. Jangan sampai kelewatan ya!",
    };

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Gambar */}
            <View className="relative">
                {/* Tombol Back */}
                <TouchableOpacity className="absolute top-10 left-4 z-10 " onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={24} color="black" />
                </TouchableOpacity>

                {/* Gambar / Placeholder */}
                <View className="w-full h-60 bg-gray-200 justify-center items-center">
                    {data.image ? (
                        <Image
                            source={{ uri: data.image }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <Text className="text-gray-400">No Image Available</Text>
                    )}
                </View>
            </View>

            {/* Konten */}
            <View className="p-4 space-y-3">
                {/* Judul */}
                <Text className="text-2xl font-bold text-gray-800">{data.title}</Text>

                {/* Periode */}
                <View className="self-start bg-primaryOrange px-3 py-1 rounded-md my-3">
                    <Text className="text-white text-sm">
                        {data.start_periode} - {data.end_periode}
                    </Text>
                </View>

                {/* Harga */}
                <View className="flex-row items-center gap-2">
                    <Text className="text-xl font-bold text-primaryOrange">
                        Rp.{data.price_promo.toLocaleString("id-ID")}
                    </Text>
                    <Text className="text-gray-500 line-through">
                        Rp.{data.real_price.toLocaleString("id-ID")}
                    </Text>
                </View>

                {/* Deskripsi */}
                <Text className="text-gray-700 leading-relaxed">{data.des}</Text>
            </View>
        </ScrollView>
    );
};

export default PromoDetail;

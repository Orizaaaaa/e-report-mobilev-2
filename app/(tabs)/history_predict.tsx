import { db } from "@/database/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BellIcon, CalendarIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "react-native-heroicons/solid";

const HistoryPredict = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uid, setUid] = useState('');

    useEffect(() => {
        fetchUserHistory();
    }, []);

    const fetchUserHistory = async () => {
        try {
            console.log("Memulai fetch history...");

            // Ambil data user dari AsyncStorage
            const userData = await AsyncStorage.getItem('user');
            console.log("Data dari AsyncStorage:", userData);

            if (!userData) {
                console.log("Tidak ada data user di AsyncStorage");
                setLoading(false);
                return;
            }

            // Parse data user
            let user;
            try {
                user = JSON.parse(userData);
            } catch (e) {
                console.log("Data user bukan JSON, menggunakan langsung:", userData);
                user = { uid: userData };
            }

            const userUid = user.uid || user;
            console.log("UID yang digunakan:", userUid);
            setUid(userUid);

            if (userUid) {
                // APPROACH 1: Ambil semua data dulu, lalu filter di client
                console.log("Mengambil semua data predictions...");
                const predictionsRef = collection(db, "predictions");

                // Query tanpa orderBy dulu untuk menghindari error index
                const q = query(
                    predictionsRef,
                    where("userId", "==", userUid)
                    // Hapus orderBy sementara: , orderBy("createdAt", "desc")
                );

                const querySnapshot = await getDocs(q);
                console.log("Jumlah dokumen yang ditemukan:", querySnapshot.size);

                const historyData: any[] = [];

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    console.log("Data dokumen:", data);

                    historyData.push({
                        id: doc.id,
                        date: formatDate(data.createdAt),
                        desc: data.predictedClass,
                        confidence: data.confidence,
                        description: data.description,
                        status: getStatus(data.predictedClass),
                        statusColor: getStatusColor(data.predictedClass),
                        textColor: getTextColor(data.predictedClass),
                        icon: getStatusIcon(data.predictedClass),
                        imageUrl: data.imageUrl,
                        guestAction: data.guestAction || [],
                        createdAt: data.createdAt // Simpan timestamp untuk sorting
                    });
                });

                // Sort manually di client side berdasarkan createdAt
                historyData.sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
                });

                console.log("History data yang dihasilkan:", historyData);
                setHistory(historyData);
            } else {
                console.log("UID tidak valid");
            }
        } catch (error) {
            console.error("Error fetching history:", error);
            // Fallback: coba approach alternatif
            try {
                await fetchAllAndFilter();
            } catch (fallbackError) {
                console.error("Fallback juga error:", fallbackError);
            }
        } finally {
            setLoading(false);
        }
    };

    // Fallback function: ambil semua data lalu filter di client
    const fetchAllAndFilter = async () => {
        try {
            console.log("Mencoba fallback: mengambil semua data...");
            const predictionsRef = collection(db, "predictions");
            const querySnapshot = await getDocs(predictionsRef);

            const userData = await AsyncStorage.getItem('user');
            let userUid: string | { uid: string };

            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    userUid = user.uid || user;
                } catch (e) {
                    userUid = userData;
                }
            }

            const historyData: any[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.userId === userUid) {
                    historyData.push({
                        id: doc.id,
                        date: formatDate(data.createdAt),
                        desc: data.predictedClass,
                        confidence: data.confidence,
                        description: data.description,
                        status: getStatus(data.predictedClass),
                        statusColor: getStatusColor(data.predictedClass),
                        textColor: getTextColor(data.predictedClass),
                        icon: getStatusIcon(data.predictedClass),
                        imageUrl: data.imageUrl,
                        guestAction: data.guestAction || [],
                        createdAt: data.createdAt
                    });
                }
            });

            // Sort manually
            historyData.sort((a, b) => {
                if (!a.createdAt || !b.createdAt) return 0;
                return b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime();
            });

            setHistory(historyData);
        } catch (error) {
            console.error("Error dalam fallback:", error);
        }
    };

    // Format timestamp menjadi tanggal yang mudah dibaca
    const formatDate = (timestamp: any) => {
        if (!timestamp) return "Tanggal tidak tersedia";

        try {
            const date = timestamp.toDate();
            return date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return "Format tanggal tidak valid";
        }
    };

    // Tentukan status berdasarkan predictedClass
    const getStatus = (predictedClass: string) => {
        if (predictedClass === "Gigi Sehat") return "Sehat";
        if (predictedClass === "Radang Gusi" || predictedClass === "Gigi Berlubang") return "Perlu Penanganan";
        return "Perlu Perhatian";
    };

    const getStatusColor = (predictedClass: string) => {
        if (predictedClass === "Gigi Sehat") return "bg-green-100";
        if (predictedClass === "Radang Gusi" || predictedClass === "Gigi Berlubang") return "bg-red-100";
        return "bg-yellow-100";
    };

    const getTextColor = (predictedClass: string) => {
        if (predictedClass === "Gigi Sehat") return "text-green-600";
        if (predictedClass === "Radang Gusi" || predictedClass === "Gigi Berlubang") return "text-red-600";
        return "text-yellow-600";
    };

    const getStatusIcon = (predictedClass: string) => {
        if (predictedClass === "Gigi Sehat") return <CheckCircleIcon size={20} color="green" />;
        if (predictedClass === "Radang Gusi" || predictedClass === "Gigi Berlubang") return <XCircleIcon size={20} color="red" />;
        return <ExclamationCircleIcon size={20} color="orange" />;
    };

    const getStatusWidth = (predictedClass: string) => {
        if (predictedClass === "Gigi Sehat") return "w-24";
        if (predictedClass === "Radang Gusi" || predictedClass === "Gigi Berlubang") return "w-40";
        return "w-36";
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white justify-center items-center">
                <ActivityIndicator size="large" color="#1E3A8A" />
                <Text className="mt-4 text-gray-600">Memuat riwayat...</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row justify-between items-center px-6 mt-14 mb-6">
                <TouchableOpacity>
                    <ChevronLeftIcon size={28} color="#1E3A8A" />
                </TouchableOpacity>
                <Text className="font-bold text-2xl text-primaryNavy">Riwayat Deteksi Gigi</Text>
                <TouchableOpacity>
                    <BellIcon size={26} color="#1E3A8A" />
                </TouchableOpacity>
            </View>

            {/* Scroll List */}
            <ScrollView className="px-4">
                {history.length === 0 ? (
                    <View className="flex-1 justify-center items-center mt-20">
                        <Text className="text-gray-500 text-lg">Tidak ada riwayat deteksi</Text>
                        <Text className="text-gray-400 text-sm mt-2">
                            UID: {uid || 'Tidak ada UID'}
                        </Text>
                    </View>
                ) : (
                    history.map((item: any) => (
                        <View
                            key={item.id}
                            className="flex-row bg-white rounded-xl p-3 mb-4 shadow border border-gray-200"
                        >
                            <Image
                                source={{ uri: item.imageUrl }}
                                className="w-20 h-20 rounded-lg"
                                resizeMode="cover"
                            />
                            <View className="flex-1 ml-3 justify-center">
                                <View className="flex-row items-center mb-1">
                                    <CalendarIcon size={16} color="gray" />
                                    <Text className="ml-1 text-gray-600 text-sm">{item.date}</Text>
                                </View>
                                <Text className="text-base font-semibold text-primaryNavy">{item.desc}</Text>
                                <Text className="text-xs text-gray-500 mt-1">Akurasi: {item.confidence}</Text>
                                <View className={`flex-row items-center mt-2 px-2 py-1 rounded-xl ${getStatusColor(item.desc)} ${getStatusWidth(item.desc)}`}>
                                    {getStatusIcon(item.desc)}
                                    <Text className={`ml-1 text-xs font-semibold ${getTextColor(item.desc)}`}>
                                        {getStatus(item.desc)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>
        </View>
    );
};

export default HistoryPredict;
import React from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { BellIcon, CalendarIcon, ChevronLeftIcon } from "react-native-heroicons/outline";
import { CheckCircleIcon, ExclamationCircleIcon, XCircleIcon } from "react-native-heroicons/solid";

const HistoryPredict = () => {
    const history = [
        {
            id: 1,
            date: "14 Juli 2025",
            desc: "Gigi Berlubang",
            status: "Perlu Penanganan",
            statusColor: "bg-red-100 text-red-600 w-40",
            textColor: "text-red-600",
            icon: <XCircleIcon size={20} color="red" />,
            image: require('../../assets/images/tooth5.png'),
        },
        {
            id: 2,
            date: "1 Juli 2025",
            desc: "Terdapat Plak di gigi depan",
            status: "Perlu Perhatian",
            statusColor: "bg-yellow-100 text-yellow-600 w-36",
            textColor: "text-yellow-600",
            icon: <ExclamationCircleIcon size={20} color="orange" />,
            image: require('../../assets/images/tooth5.png'),
        },
        {
            id: 3,
            date: "20 Juni 2025",
            desc: "Gigi mu sehat",
            status: "Sehat",
            statusColor: "bg-green-100 text-green-600 w-24",
            textColor: "text-green-600",
            icon: <CheckCircleIcon size={20} color="green" />,
            image: require('../../assets/images/tooth5.png'),
        },
    ];

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
                {history.map((item) => (
                    <View
                        key={item.id}
                        className="flex-row bg-white rounded-xl p-3 mb-4 shadow border border-gray-200"
                    >
                        <Image
                            source={item.image as any}
                            className="w-20 h-20 rounded-lg"
                            resizeMode="cover"
                        />
                        <View className="flex-1 ml-3 justify-center">
                            <View className="flex-row items-center mb-1">
                                <CalendarIcon size={16} color="gray" />
                                <Text className="ml-1 text-gray-600 text-sm">{item.date}</Text>
                            </View>
                            <Text className="text-base font-semibold text-primaryNavy">{item.desc}</Text>
                            <View className={`flex-row items-center mt-2 px-2 py-1 rounded-xl ${item.statusColor}`}>
                                {item.icon}
                                <Text className={`ml-1 text-xs font-semibold ${item.textColor}`}>{item.status}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

        </View>
    );
};

export default HistoryPredict;

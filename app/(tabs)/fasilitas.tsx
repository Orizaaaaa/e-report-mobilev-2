import { db } from '@/database/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

const fasilitasData = [
    { id: 1, title: 'Ruang Tunggu', image: require('../../assets/images/artikle2.jpg') },
    { id: 2, title: 'Pendaftaran', image: require('../../assets/images/artikle2.jpg') },
    { id: 3, title: 'Ruang Tindakan Poli Umum', image: require('../../assets/images/artikle2.jpg') },
    { id: 4, title: 'Ruang Tindakan Poli Gigi', image: require('../../assets/images/artikle2.jpg') },
    { id: 5, title: 'Ruang Tindakan Poli Gigi Anak', image: require('../../assets/images/artikle2.jpg') },
    { id: 6, title: 'Ruang Rawat Inap', image: require('../../assets/images/artikle2.jpg') },
    { id: 7, title: 'Toilet Bersih', image: require('../../assets/images/artikle2.jpg') },
    { id: 8, title: 'Parkiran Luas', image: require('../../assets/images/artikle2.jpg') },
];

const FasilitasPage = () => {
    const [Fasilitas, setFasilitas]: any = React.useState([]);
    const fetchFasilitas = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'facilities'));
            const fasilitasData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));
            setFasilitas(fasilitasData);
        } catch (err) {
            console.error('❌ Gagal mengambil laporan:', err);
        }
    };
    useEffect(() => {
        fetchFasilitas();
    }, []);
    return (
        <View className="flex-1 bg-white">
            <ScrollView className="bg-white h-full">
                {/* Header */}
                <View className="flex-col px-6 mt-14 mb-6 items-center">
                    <Text className="font-bold text-3xl text-primaryNavy">Fasilitas</Text>
                </View>

                {/* Grid Fasilitas */}
                <View className="flex-row flex-wrap justify-center px-4">
                    {Fasilitas.map((item: any, index: number) => (
                        <TouchableOpacity
                            key={item.id}
                            className="w-[45%] m-2 bg-white rounded-lg shadow-md overflow-hidden"
                            activeOpacity={0.8}
                        >
                            <Image source={{ uri: item.image }} className="w-full h-28" resizeMode="cover" />
                            <View className="p-2 items-center">
                                <Text className="text-sm font-medium text-gray-800 text-center">
                                    {item.title}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default FasilitasPage;

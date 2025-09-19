import AdminInfo from '@/components/elements/adminInfo/AdminInfo';
import ButtonBack from '@/components/elements/buttonBack/ButtonBack';
import { db } from '@/lib/firebase/firebase';
import { truncateText } from '@/utils/helper';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RelativePathString, router, useFocusEffect } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';

type Props = {}

type Report = {
    id: string;
    typeReport?: string;
    status?: string;
    desc?: string;
};

type Contest = {
    id: string;
    status?: string;
};

const Index = (props: Props) => {
    const [listReport, setListReport] = useState([] as Report[]);
    const [countPrioritas, setCountPrioritas] = useState(0);
    const [countReguler, setCountReguler] = useState(0);
    const [countSelesai, setCountSelesai] = useState(0);
    const [countAvailableContest, setCountAvailableContest] = useState(0);
    const [countAllContest, setCountAllContest] = useState(0);
    const [userFoto, setUserFoto] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const userData = await AsyncStorage.getItem('user');
                    if (userData) {
                        const parsed = JSON.parse(userData);
                        setUserFoto(parsed?.image || '');
                    }

                    const contestRef = collection(db, 'contest');
                    const contestQuery = query(contestRef, orderBy('createdAt', 'desc'));
                    const contestSnapshot = await getDocs(contestQuery);
                    const contests: Contest[] = contestSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as Contest));

                    const reportRef = collection(db, 'reports');
                    const reportSnapshot = await getDocs(reportRef);
                    const reports: Report[] = reportSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as Report));

                    const prioritas = reports.filter(item => item.typeReport === 'Prioritas');
                    const reguler = reports.filter(item => item.typeReport === 'Reguler');
                    const selesai = reports.filter(item => item.status === 'selesai');
                    const available = contests.filter(item => item.status !== 'selesai');

                    setListReport(reports);
                    setCountPrioritas(prioritas.length);
                    setCountReguler(reguler.length);
                    setCountSelesai(selesai.length);
                    setCountAvailableContest(available.length);
                    setCountAllContest(contests.length);

                } catch (error) {
                    console.error('❌ Gagal mengambil data:', error);
                }
            };

            fetchData();
        }, [])
    );

    const handleToDetail = (reportId: string) => {
        if (!reportId) {
            console.warn('ID lomba tidak tersedia');
            return;
        }

        router.push(`/info/report/${reportId}` as RelativePathString);
    }

    console.log(listReport);


    return (
        <SafeAreaView className="flex-1 bg-gray-50 pt-16 px-5">
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-row justify-between items-center mb-10 ' >
                    <ButtonBack />
                    <Text className='text-xl'>Informasi</Text>
                    <Text>{''}</Text>
                </View>

                {/* Cards */}
                <View className="flex-row flex-wrap justify-between">
                    <AdminInfo
                        icon={<FontAwesome name="file-text-o" size={22} color="orange" />}
                        total={countPrioritas.toString()}
                        title="Laporan prioritas"
                    />
                    <AdminInfo
                        icon={<FontAwesome name="file-text-o" size={22} color="#22c55e" />}
                        total={countReguler.toString()}
                        title="Laporan reguler"
                    />
                    <AdminInfo
                        icon={<MaterialCommunityIcons name="archive-check-outline" size={22} color="#22c55e" />}
                        total={countSelesai.toString()}
                        title="Laporan selesai"
                    />
                    <AdminInfo
                        icon={<Ionicons name="medal-outline" size={22} color="#22c55e" />}
                        total={countAvailableContest.toString()}
                        title="Lomba tersedia"
                    />
                </View>

                {/* Jumlah Lomba */}
                <View className="bg-primaryNavy rounded-2xl shadow-md mt-6 px-6 py-5">
                    <Text className="text-white text-base">Jumlah Lomba</Text>
                    <Text className="text-4xl font-bold text-green-500 mt-1">{countAllContest}</Text>
                    <Text className="text-white text-sm mt-1">Total lomba yang ada saat ini</Text>
                </View>

                <View className="flex-row justify-between my-6">
                    <Text className=" font-semibold italic">List Laporan</Text>
                </View>


                {listReport.map((item: any, index: number) => (
                    <TouchableOpacity onPress={() => handleToDetail(item.id)} key={index}  // ✅ key={index}
                        className="bg-white rounded-xl p-5 flex-row items-start mb-5">
                        {/* Gambar di kiri */}
                        <Image
                            source={{ uri: item.images[0] }} // ganti dengan link gambar
                            className="w-20 h-20 rounded-lg mr-4"
                            resizeMode="cover"
                        />

                        {/* Teks di kanan, isi full */}


                        <View className="flex-1">
                            <Text className='text-gray-600' >
                                {truncateText(item.desc, 120)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}

            </ScrollView>
        </SafeAreaView>
    );
};

export default Index;

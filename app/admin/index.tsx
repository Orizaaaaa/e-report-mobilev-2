import AdminInfo from '@/components/elements/adminInfo/AdminInfo';
import { db } from '@/lib/firebase/firebase';
import { FontAwesome, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { Image, SafeAreaView, ScrollView, Text, View } from 'react-native';

type Props = {}

type Report = {
    id: string;
    typeReport?: string;
    status?: string;
    // Tambahkan properti lain sesuai kebutuhan
};

type Contest = {
    id: string;
    status?: string;
    // Tambahkan properti lain jika ada
};


const index = (props: Props) => {

    // State untuk menampung jumlah
    const [countPrioritas, setCountPrioritas] = useState(0);
    const [countReguler, setCountReguler] = useState(0);
    const [countSelesai, setCountSelesai] = useState(0);
    const [countAvailableContest, setCountAvailableContest] = useState(0);

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    // Ambil data contest
                    const contestRef = collection(db, 'contest');
                    const contestQuery = query(contestRef, orderBy('createdAt', 'desc'));
                    const contestSnapshot = await getDocs(contestQuery);
                    const contests: Contest[] = contestSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as Contest));



                    // Ambil data reports
                    const reportRef = collection(db, 'reports');
                    const reportSnapshot = await getDocs(reportRef);
                    const reports: Report[] = reportSnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    } as Report));



                    // Hitung jumlah berdasarkan filter
                    const prioritas = reports.filter(item => item.typeReport === 'Prioritas');
                    const reguler = reports.filter(item => item.typeReport === 'Reguler');
                    const selesai = reports.filter(item => item.status === 'selesai');
                    const available = contests.filter(item => item.status !== 'selesai'); // asumsi status !== selesai berarti masih tersedia

                    setCountPrioritas(prioritas.length);
                    setCountReguler(reguler.length);
                    setCountSelesai(selesai.length);
                    setCountAvailableContest(available.length);

                } catch (error) {
                    console.error('❌ Gagal mengambil data:', error);
                }
            };

            fetchData();
        }, [])
    );

    return (

        <SafeAreaView className=' pt-12  px-5 '>
            <ScrollView>
                <View className='flex-row justify-between items-center'>
                    <View>
                        <Text className='text-xl text-primaryNavy font-medium'>Hi, Admin desa rahayu 👋</Text>
                    </View>
                    <View>
                        <View className='w-16 h-16  rounded-full   '>
                            <Image
                                className='w-full h-full rounded-full'
                                source={require('../../assets/images/human.png')}
                                resizeMode='cover'
                            />
                        </View>
                    </View>
                </View>

                <View className="flex-row flex-wrap justify-between mt-6">
                    <View className="flex-row flex-wrap justify-between mt-6">
                        <AdminInfo
                            icon={<FontAwesome name="file-text-o" size={24} color="orange" />}
                            total={countPrioritas.toString()}
                            title="Laporan prioritas"
                        />
                        <AdminInfo
                            icon={<FontAwesome name="file-text-o" size={24} color="white" />}
                            total={countReguler.toString()}
                            title="Laporan reguler"
                        />
                        <AdminInfo
                            icon={<MaterialCommunityIcons name="archive-check-outline" size={24} color="white" />}
                            total={countSelesai.toString()}
                            title="Laporan selesai"
                        />
                        <AdminInfo
                            icon={<Ionicons name="medal-outline" size={24} color="white" />}
                            total={countAvailableContest.toString()}
                            title="Lomba yang tersedia"
                        />
                    </View>

                </View>


                {/* contoh yang langsung masuk ke notif lomba */}
                {/* <ButtonPrimary
                    text="Buat laporan"
                    onPress={() => router.push('/admin/notif/NotifPage?tab=lomba')}
                /> */}


                {/* <View className='bg-white rounded-2xl mt-5 px-3 py-6  '>
                    <View>
                        <View className='flex-row justify-between items-center' >
                            <Text>Laporan Prioritas</Text>
                            <Text className='text-primaryOrange' >Lihat semua</Text>
                        </View>
                        <ScrollView className='mt-5 overflow-x-hidden' showsHorizontalScrollIndicator={false} horizontal={true} >
                            <CardReport heightImage='h-24' image={require('../../assets/images/demo.png')} handlepres={handlePress} />
                            <CardReport heightImage='h-24' image={require('../../assets/images/demo.png')} handlepres={handlePress} />
                            <CardReport heightImage='h-24' image={require('../../assets/images/demo.png')} handlepres={handlePress} />
                        </ScrollView>
                    </View>
                </View> */}



            </ScrollView>
        </SafeAreaView>


    )
}

export default index
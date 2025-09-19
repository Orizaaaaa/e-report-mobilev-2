import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import NotifReportCard from '@/components/fragments/cardNotif/notifReportCard'
import { db } from '@/lib/firebase/firebase'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRoute } from '@react-navigation/native'
import { router, useFocusEffect } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

type Props = {}

const NotifUser = (props: Props) => {
    const route = useRoute()
    const params = route.params as { tab?: 'laporan' | 'lomba' }
    const [userUid, setUserUid] = useState('')

    const [activeTab, setActiveTab] = useState<'laporan' | 'lomba'>('laporan')

    // Cek parameter saat pertama kali render
    useEffect(() => {
        if (params?.tab === 'lomba' || params?.tab === 'laporan') {
            setActiveTab(params.tab)
        }
    }, [params])

    const [dataNotif, setDataNotif]: any = useState([])
    useFocusEffect(
        useCallback(() => {
            const fetchNotifs = async () => {
                try {
                    const userStr = await AsyncStorage.getItem('user');
                    const currentUser = userStr ? JSON.parse(userStr) : null;
                    if (!currentUser) return;

                    setUserUid(currentUser.uid);

                    const snapshot = await getDocs(collection(db, 'notifications'));
                    const notifications = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setDataNotif(notifications);
                } catch (err) {
                    console.error('❌ Gagal mengambil notifikasi:', err);
                }
            };

            fetchNotifs();

            // Optional cleanup
            return () => {
                // console.log('Screen blur');
            };
        }, [])
    );

    console.log('kontol', dataNotif);
    console.log('uid cuy', userUid);


    return (
        <SafeAreaView className="pt-12 px-5">
            <View className='flex-row justify-between items-center' >
                <ButtonBack />
                <Text className='text-xl font-medium' >Notifikasi</Text>
                <Text>{''}</Text>
            </View>
            {/* Tab Selector */}
            <View className="flex-row justify-between bg-slate-200 my-7 px-3 py-5 rounded-2xl">

                {/* Laporan Tab */}
                <TouchableOpacity
                    onPress={() => setActiveTab('laporan')}
                    className={`py-3 px-7 rounded-full flex-row items-center gap-2 ${activeTab === 'laporan' ? 'bg-primaryNavy' : 'bg-slate-300'
                        }`}
                >
                    <Text className={`text-center ${activeTab === 'laporan' ? 'text-white' : 'text-black'}`}>
                        Laporan
                    </Text>
                    <MaterialCommunityIcons
                        name="clipboard-text-clock-outline"
                        size={18}
                        color={activeTab === 'laporan' ? 'white' : 'black'}
                    />
                </TouchableOpacity>

                {/* Lomba Tab */}
                <TouchableOpacity
                    onPress={() => setActiveTab('lomba')}
                    className={`py-3 px-7 rounded-full flex-row items-center gap-2 ${activeTab === 'lomba' ? 'bg-primaryNavy' : 'bg-slate-300'
                        }`}
                >
                    <Text className={`text-center ${activeTab === 'lomba' ? 'text-white' : 'text-black'}`}>
                        Lomba
                    </Text>
                    <Ionicons
                        name="medal-outline"
                        size={18}
                        color={activeTab === 'lomba' ? 'white' : 'black'}
                    />
                </TouchableOpacity>
            </View>

            {/* Konten Scroll */}
            <ScrollView>
                {activeTab === 'laporan' ? (
                    // Konten Laporan
                    (() => {
                        const laporanNotif = dataNotif
                            .filter(
                                (item: any) =>
                                    item.typeNotif === 'report' && item.fromUid === userUid && item.toRole === 'user'
                            )
                            .sort(
                                (a: any, b: any) =>
                                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            );

                        return laporanNotif.length === 0 ? (
                            <Text className="text-center text-gray-500 mt-5">
                                Belum ada notifikasi
                            </Text>
                        ) : (
                            laporanNotif.map((item: any, index: number) => (
                                <NotifReportCard
                                    goToLink={() => router.push(`/user/report/${item.reportId}`)}
                                    key={index}
                                    imageUrl={item.image}
                                    description={item.body}
                                    date={item.createdAt}
                                    user={item.userName}
                                />
                            ))
                        );
                    })()
                ) : (
                    // Konten Lomba
                    (() => {
                        const contestNotif = dataNotif
                            .filter(
                                (item: any) =>
                                    item.typeNotif === 'contest' && item.toRole === 'user'
                            )
                            .sort(
                                (a: any, b: any) =>
                                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                            );

                        return contestNotif.length === 0 ? (
                            <Text className="text-center text-gray-500 mt-5">
                                Belum ada notifikasi
                            </Text>
                        ) : (
                            contestNotif.map((item: any, index: number) => (
                                <NotifReportCard
                                    goToLink={() => router.push(`/user/contest/${item.contestId}`)}
                                    key={index}
                                    imageUrl={item.image}
                                    description={item.body}
                                    date={item.createdAt}
                                    user={item.userName}
                                />
                            ))
                        );
                    })()
                )}
            </ScrollView>


        </SafeAreaView>
    )
}

export default NotifUser

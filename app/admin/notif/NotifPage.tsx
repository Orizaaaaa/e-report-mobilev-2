import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import NotifReportCard from '@/components/fragments/cardNotif/notifReportCard'
import { db } from '@/lib/firebase/firebase'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import { collection, getDocs } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native'

type Props = {}

const NotifPage = (props: Props) => {
    const [dataNotif, setDataNotif]: any = useState([])
    const route = useRoute()
    const params = route.params as { tab?: 'laporan' | 'lomba' }

    const [activeTab, setActiveTab] = useState<'laporan' | 'lomba'>('laporan')

    useEffect(() => {
        const fetchNotifs = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'notifications'));
                const notifications = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setDataNotif(notifications);
            } catch (err) {
                console.error('❌ Gagal mengambil laporan:', err);
            }
        };

        fetchNotifs();
    }, []);

    console.log('data notif', dataNotif);


    // Cek parameter saat pertama kali render
    useEffect(() => {
        if (params?.tab === 'lomba' || params?.tab === 'laporan') {
            setActiveTab(params.tab)
        }
    }, [params])

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
                    dataNotif.filter((item: any) => item.typeNotif === 'report').map((item: any, index: number) => (
                        <NotifReportCard key={index} imageUrl={item.image} description={item.body} date={item.createdAt} user={item.userName} />
                    ))
                ) : (
                    // Konten Lomba
                    dataNotif.filter((item: any) => item.typeNotif === 'contest').map((item: any, index: number) => (
                        <NotifReportCard key={index} imageUrl={item.image} description={item.body} date={item.createdAt} user={item.userName} />
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    )
}

export default NotifPage

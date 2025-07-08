import { sendNotificationToRole } from '@/api/api';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import BottomSheetCustom from '@/components/fragments/bottomSheet';
import CardContest from '@/components/fragments/CardContest/CardContest';
import { db } from '@/lib/firebase/firebase';
import { formatDate } from '@/utils/helper';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RelativePathString, router, useFocusEffect } from 'expo-router';
import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TextInput } from 'react-native-gesture-handler';


const statusList = [
    { label: 'Tidak valid', value: 'invalid', icon: <Feather name="x-circle" size={18} color="black" /> },
    { label: 'Menunggu', value: 'pending', icon: <MaterialIcons name="pending-actions" size={18} color="white" /> },
    { label: 'Di proses', value: 'processing', icon: <MaterialCommunityIcons name="archive-cog-outline" size={18} color="black" /> },
    { label: 'Selesai', value: 'done', icon: <MaterialCommunityIcons name="archive-check-outline" size={18} color="black" /> },
];
type Props = {}
interface User {
    email: string;
    name: string;
    image: string;
    uid: string;
}
const Contest = (props: Props) => {

    const [loading, setLoading] = useState(false)
    const [dataContest, setDataContest] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userEmail, setUserEmail] = useState('');

    // Ambil data user dari AsyncStorage
    useEffect(() => {
        const fetchUser = async () => {
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            setUserEmail(user?.email || '');
            setCurrentUser(user || '');
        };
        fetchUser();
    }, []);


    // Ambil data lomba

    useFocusEffect(
        useCallback(() => {
            const fetchContests = async () => {
                console.log('fetch');
                setLoading(true)
                try {
                    const contestRef = collection(db, 'contest');
                    const q = query(contestRef, orderBy('createdAt', 'desc'));
                    const snapshot = await getDocs(q);

                    const contests = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                    }));

                    setDataContest(contests);
                    setLoading(false)
                } catch (error) {
                    console.error('❌ Gagal mengambil data contest:', error);
                }
            };

            fetchContests();
        }, []) // ✅ Kosong karena tidak perlu dependency di sini
    );


    // Fungsi daftar lomba
    const handleJoinContest = async (contestId: string) => {
        try {
            const contestRef = doc(db, 'contest', contestId);
            const contest = dataContest.find(item => item.id === contestId);

            if (!contest) return;

            const sudahDaftar = contest.userAudiens?.includes(userEmail);
            if (sudahDaftar) return;

            const updatedUserAudiens = [...(contest.userAudiens || []), userEmail];

            // Update ke Firestore
            await updateDoc(contestRef, {
                userAudiens: updatedUserAudiens,
            });

            await sendNotificationToRole('admin', `${userEmail} telah bergabung di lomba ${contest.desc}!`);
            await addDoc(collection(db, 'notifications'), {
                title: 'Laporan Baru',
                body: ` ${currentUser?.name} Telah bergabung di lomba ${contest.desc}!`,
                toRole: 'admin',
                typeNotif: 'contest',
                userName: currentUser?.name || 'User',
                image: currentUser?.image || 'image empty',
                fromUid: currentUser?.uid,
                reportId: contestId, // ✅ ID laporan dibawa ke notifikasi
                createdAt: new Date().toISOString(),
                read: false,
            });
            // ✅ Update state lokal agar UI ikut berubah
            setDataContest(prev =>
                prev.map(item =>
                    item.id === contestId
                        ? { ...item, userAudiens: updatedUserAudiens }
                        : item
                )
            );

        } catch (err) {
            console.error('❌ Gagal daftar lomba:', err);
        }
    };





    const [searchText, setSearchText] = useState('');
    const totalPeserta = 1000;
    const pesertaSaatIni = 700;
    const progress = Math.min(pesertaSaatIni / totalPeserta, 1);

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);

    const [period, setPeriod] = useState({ startDate: '', endDate: '' });
    const [filtering, setFiltering] = useState({
        status: '',
        date: '',
        search: '',
    });

    const getMarkedDates = (start: string, end: string) => {
        const marked: any = {};

        if (!start) return marked;

        const startDate = new Date(start);
        const endDate = end ? new Date(end) : new Date(start);

        let current = new Date(startDate);

        while (current <= endDate) {
            const dateStr = current.toISOString().split('T')[0];

            marked[dateStr] = {
                startingDay: dateStr === start,
                endingDay: dateStr === end,
                color: '#1E2A38',
                textColor: 'white',
            };

            current.setDate(current.getDate() + 1);
        }

        return marked;
    };

    const handleToDetail = (contestId: string) => {
        if (!contestId) {
            console.warn('ID lomba tidak tersedia');
            return;
        }

        router.push(`/user/contest/${contestId}` as RelativePathString);
    }

    const parseCustomDate = (dateStr: string) => {
        const [day, month, year] = dateStr.split('-');
        return new Date(`${year}-${month}-${day}`); // Convert to YYYY-MM-DD
    };
    const filteredData = dataContest.filter(item => {
        const matchSearch = item?.desc?.toLowerCase().includes(filtering.search.toLowerCase()) ||
            item?.location?.toLowerCase().includes(filtering.search.toLowerCase());

        const itemDate = parseCustomDate(item.date);
        const startDate = period.startDate ? new Date(period.startDate) : null;
        const endDate = period.endDate ? new Date(period.endDate) : null;

        const matchDate = (!startDate && !endDate) || (
            startDate && endDate && itemDate >= startDate && itemDate <= endDate
        );

        return matchSearch && matchDate;
    });

    const totalLomba = dataContest.length;
    return (
        <View className="flex-1 bg-white">
            {/* Bagian Atas */}
            <View className="pb-14 pt-12 px-3 relative overflow-hidden">
                <View className="absolute inset-0 bg-primaryNavy opacity-100 z-0" />

                <View className="relative z-10 mt-5 flex-row items-center gap-2 bg-white rounded-full px-2">
                    <View className="flex-1 h-14 px-2 rounded-lg flex-row items-center gap-2">
                        <Feather name="search" size={24} color="#FF840C" />
                        <TextInput
                            className="flex-1 text-gray-800"
                            placeholder="Cari..."
                            placeholderTextColor={'gray'}
                            value={filtering.search}
                            onChangeText={(text) => setFiltering(prev => ({ ...prev, search: text }))}
                        />
                    </View>

                    <View className="flex-row justify-end">
                        <View className="p-3 border-white rounded-xl">
                            <MaterialIcons onPress={() => { router.push('/user/notif') }} name="notifications-none" size={25} color="#FF840C" />
                        </View>
                    </View>
                    <View className="w-14 border-white h-14 justify-center items-center rounded-lg">
                        <Feather onPress={openBottomSheet} name="menu" size={24} color="#FF840C" />
                    </View>
                </View>

                <View className="relative z-10 flex justify-center items-center mt-4">
                    <MaterialCommunityIcons name="trophy-award" size={70} color="#FF840C" />
                    <Text className="text-3xl text-white">{totalLomba}</Text>
                    <Text className="text-slate-200">Lomba Tersedia</Text>

                </View>
            </View>

            {/* Scrollable Content */}
            <View className="flex-1 rounded-tr-[37px] -mt-9 bg-white overflow-hidden pb-12">
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {loading ? (
                        <ActivityIndicator size="large" color="#FF840C" />
                    ) : (
                        filteredData.map(item => {
                            const sudahDaftar: any = item.userAudiens?.includes(userEmail);
                            return (
                                <TouchableOpacity onPress={() => handleToDetail(item.id)} key={item.id}>
                                    <CardContest
                                        key={item.id}
                                        contest={item}
                                        disabled={sudahDaftar}
                                        styleButton={sudahDaftar ? 'bg-slate-400' : 'bg-primaryNavy'}
                                        textButton={sudahDaftar ? 'Anda sudah daftar' : 'Daftar Sekarang'}
                                        handlePres={() => handleJoinContest(item.id)}
                                    />
                                </TouchableOpacity>
                            );
                        })
                    )}
                </ScrollView>
            </View>

            <BottomSheetCustom index={-1} ref={bottomSheetRef} snap={snapPoints} onChange={handleSheetChanges} >
                <Text className="text-sm text-slate-400 ">Filter berdasarkan tanggal</Text>
                <Calendar
                    onDayPress={(day) => {
                        const formatted = formatDate({ day: day.day, month: day.month, year: day.year });

                        if (!period.startDate || (period.startDate && period.endDate)) {
                            // Mulai periode baru
                            setPeriod({ startDate: day.dateString, endDate: '' });
                            setFiltering(prev => ({ ...prev, date: formatted }));
                        } else {
                            const isBefore = new Date(day.dateString) < new Date(period.startDate);

                            if (isBefore) {
                                setPeriod({ startDate: day.dateString, endDate: period.startDate });
                                const startFormatted = formatDate({ day: day.day, month: day.month, year: day.year });
                                const endDateObj = new Date(period.startDate);
                                const endFormatted = formatDate({
                                    day: endDateObj.getDate(),
                                    month: endDateObj.getMonth() + 1,
                                    year: endDateObj.getFullYear()
                                });
                                setFiltering(prev => ({ ...prev, date: `${startFormatted} - ${endFormatted}` }));
                            } else {
                                setPeriod({ startDate: period.startDate, endDate: day.dateString });
                                const startDateObj = new Date(period.startDate);
                                const startFormatted = formatDate({
                                    day: startDateObj.getDate(),
                                    month: startDateObj.getMonth() + 1,
                                    year: startDateObj.getFullYear()
                                });
                                const endFormatted = formatted;
                                setFiltering(prev => ({ ...prev, date: `${startFormatted} - ${endFormatted}` }));
                            }
                        }
                    }}
                    markingType={'period'}
                    markedDates={getMarkedDates(period.startDate, period.endDate)}
                    theme={{
                        selectedDayBackgroundColor: '#1E2A38',
                        todayTextColor: '#1E2A38',
                        arrowColor: '#1E2A38',
                        textDayHeaderFontSize: 12,
                        textDayFontSize: 14,
                    }}
                />
                <View className='flex-row justify-between mt-7 '>
                    <ButtonSecondary
                        className='w-[48%] rounded-lg py-2'
                        text='Reset'
                        onPress={() => {
                            setPeriod({ startDate: '', endDate: '' });
                            setFiltering(prev => ({ ...prev, date: '' }));
                        }}
                    />

                    <ButtonPrimary
                        className='w-[48%] rounded-lg py-2'
                        text='Terapkan'
                        onPress={() => {
                            bottomSheetRef.current?.close();
                        }}
                    />

                </View>
            </BottomSheetCustom>
        </View>
    );
}

export default Contest;

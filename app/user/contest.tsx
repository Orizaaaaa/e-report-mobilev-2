import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import BottomSheetCustom from '@/components/fragments/bottomSheet';
import CardContest from '@/components/fragments/CardContest/CardContest';
import { db } from '@/lib/firebase/firebase';
import { formatDate } from '@/utils/helper';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { collection, doc, getDocs, orderBy, query, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TextInput } from 'react-native-gesture-handler';


const statusList = [
    { label: 'Tidak valid', value: 'invalid', icon: <Feather name="x-circle" size={18} color="black" /> },
    { label: 'Menunggu', value: 'pending', icon: <MaterialIcons name="pending-actions" size={18} color="white" /> },
    { label: 'Di proses', value: 'processing', icon: <MaterialCommunityIcons name="archive-cog-outline" size={18} color="black" /> },
    { label: 'Selesai', value: 'done', icon: <MaterialCommunityIcons name="archive-check-outline" size={18} color="black" /> },
];
type Props = {}

const Contest = (props: Props) => {

    const [dataContest, setDataContest] = useState<any[]>([]);
    const [userName, setUserName] = useState('');

    // Ambil data user dari AsyncStorage
    useEffect(() => {
        const fetchUser = async () => {
            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            setUserName(user?.name || user?.email || '');
        };
        fetchUser();
    }, []);

    // Ambil data lomba
    const fetchContests = async () => {
        try {
            const contestRef = collection(db, 'contest');
            const q = query(contestRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const contests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setDataContest(contests);
        } catch (error) {
            console.error('❌ Gagal mengambil data contest:', error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchContests();
        }, [fetchContests])
    );

    // Fungsi daftar lomba
    const handleJoinContest = async (contestId: string) => {
        try {
            const contestRef = doc(db, 'contest', contestId);
            const contest = dataContest.find(item => item.id === contestId);

            if (!contest) return;

            const sudahDaftar = contest.userAudiens?.includes(userName);
            if (sudahDaftar) return;

            const updatedUserAudiens = [...(contest.userAudiens || []), userName];

            await updateDoc(contestRef, {
                userAudiens: updatedUserAudiens,
            });

            fetchContests(); // Refresh setelah daftar
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
                            value={searchText}
                            onChangeText={setSearchText}
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
                    <Text className="text-3xl text-white">700</Text>
                    <Text className="text-slate-200">Lomba Tersedia</Text>

                </View>
            </View>

            {/* Scrollable Content */}
            <View className="flex-1 rounded-tr-[37px] -mt-9 bg-white overflow-hidden pb-12">
                <ScrollView
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                >
                    {dataContest.map(item => {
                        const sudahDaftar = item.userAudiens?.includes(userName);
                        return (
                            <CardContest
                                key={item.id}
                                contest={item}
                                textButton={sudahDaftar ? 'Anda sudah daftar' : 'Daftar Sekarang'}
                                handlePres={() => handleJoinContest(item.id)}
                            />
                        );
                    })}
                </ScrollView>
            </View>

            <BottomSheetCustom index={-1} ref={bottomSheetRef} snap={snapPoints} onChange={handleSheetChanges} >

                <View className="">
                    <Text className="mb-2 text-sm text-slate-400">Filter berdasarkan status</Text>

                    <View className="flex-row items-center justify-between bg-gray-200 rounded-2xl px-2 py-2">
                        {statusList.map((item) => {
                            const isActive = filtering.status === item.value;
                            return (
                                <TouchableOpacity
                                    key={item.value}
                                    className={`flex items-center px-2 py-1 rounded-xl ${isActive ? 'bg-primaryNavy' : ''}`}
                                    onPress={() => {
                                        // Toggle off jika sama
                                        setFiltering((prev) => ({
                                            ...prev,
                                            status: prev.status === item.value ? '' : item.value,
                                        }));
                                    }}
                                >
                                    {React.cloneElement(item.icon, {
                                        color: isActive ? 'white' : 'black',
                                    })}
                                    <Text className={`text-sm ${isActive ? 'text-white' : 'text-primaryNavy'}`}>
                                        {item.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>







                <View className='mt-7' >
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


                </View>

                <View className='flex-row justify-between mt-7 '>
                    <ButtonSecondary className='w-[48%] rounded-lg py-2' text='Reset' onPress={() => { }} />
                    <ButtonPrimary className='w-[48%] rounded-lg py-2' text='Terapkan' onPress={() => { }} />
                </View>
            </BottomSheetCustom>
        </View>
    );
}

export default Contest;

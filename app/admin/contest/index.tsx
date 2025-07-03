import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import BottomSheetCustom from '@/components/fragments/bottomSheet';
import CardContest from '@/components/fragments/CardContest/CardContest';
import { db } from '@/lib/firebase/firebase';
import { formatDate } from '@/utils/helper';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import { router, useFocusEffect } from 'expo-router';
import { collection, deleteDoc, doc, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { TextInput } from 'react-native-gesture-handler';

type Props = {}

const Contest = (props: Props) => {
    const [selectedContest, setSelectedContest] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const [loading, setLoading] = useState(false)
    const [dataContest, setDataContest] = useState<any[]>([]);
    useFocusEffect(
        useCallback(() => {
            const fetchContests = async () => {
                setLoading(true)
                try {
                    const contestRef = collection(db, 'contest');
                    const q = query(contestRef, orderBy('createdAt', 'desc'));
                    const snapshot = await getDocs(q);

                    const contests = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));

                    setDataContest(contests);
                    setLoading(false)
                } catch (error) {
                    console.error('❌ Gagal mengambil data contest:', error);
                }
            };

            fetchContests();
        }, [])
    );

    const [filtering, setFiltering] = useState({
        date: '',

    });
    const [period, setPeriod] = useState({ startDate: '', endDate: '' });
    const [searchText, setSearchText] = useState('');
    const totalPeserta = 1000;
    const pesertaSaatIni = 700;
    const progress = Math.min(pesertaSaatIni / totalPeserta, 1);


    const handlePress = (contestId: string) => {
        if (!contestId) {
            console.warn('ID lomba tidak tersedia');
            return;
        }

        router.push(`/admin/contest/${contestId}`);
    };

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

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["70%"], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);

    console.log(dataContest);
    const confirmDelete = (contest: any) => {
        setSelectedContest(contest);
        setModalVisible(true);
    };

    const handleDeleteContest = async () => {
        try {
            if (!selectedContest?.id) return;
            await deleteDoc(doc(db, 'contest', selectedContest.id));
            setModalVisible(false);
            setSelectedContest(null);

            const contestRef = collection(db, 'contest');
            const q = query(contestRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            const contests = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setDataContest(contests);

        } catch (error) {
            console.error('Gagal menghapus lomba:', error);
        }
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
                            <MaterialIcons onPress={() => router.push('/admin/notif/NotifPage?tab=lomba')} name="notifications-none" size={25} color="#FF840C" />
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

                    <View className='flex-row gap-3 mb-4' >
                        <ButtonPrimary className='py-2 px-3 rounded-full' text='Tambah Lomba'
                            onPress={() => { router.push(`/admin/contest/addContest`) }} />
                    </View>


                    {loading ? (
                        <ActivityIndicator size="large" color="#FF840C" />
                    ) : (
                        dataContest.map(item => {

                            return (
                                <TouchableOpacity onPress={() => handlePress(item.id)} key={item.id} >

                                    <CardContest
                                        key={item.id}
                                        contest={item}
                                        textButton="Hapus lomba"
                                        handlePres={() => confirmDelete(item)}
                                    />

                                </TouchableOpacity>
                            );
                        })
                    )}

                </ScrollView>
            </View>

            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-center items-center px-6">
                    <View className="bg-white p-6 rounded-xl w-full">
                        <Text className="text-lg font-semibold mb-4">
                            Apakah Anda yakin ingin menghapus lomba ini?
                        </Text>

                        <View className="flex-row justify-end gap-3">
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="px-4 py-2 bg-gray-200 rounded-lg"
                            >
                                <Text>Batal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleDeleteContest}
                                className="px-4 py-2 bg-red-500 rounded-lg"
                            >
                                <Text className="text-white">Hapus</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
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
                    <ButtonSecondary className='w-[48%] rounded-lg py-2' text='Reset' onPress={() => { }} />
                    <ButtonPrimary className='w-[48%] rounded-lg py-2' text='Terapkan' onPress={() => { }} />
                </View>
            </BottomSheetCustom>
        </View>
    );
}

export default Contest;

import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import BottomSheetCustom from '@/components/fragments/bottomSheet';
import CardReport from '@/components/fragments/CardReport/CardReport';
import IndicatorInfo from '@/components/fragments/IndicatorInfo/IndicatorInfo';
import { db } from '@/lib/firebase/firebase';
import { formatDate, getFirstTwoWords, STATUS_LIST, truncateText } from '@/utils/helper';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Calendar } from 'react-native-calendars';
const { height } = Dimensions.get('window');

const statusList = [
    { label: 'Tidak valid', value: 'invalid', icon: <Feather name="x-circle" size={18} color="black" /> },
    { label: 'Menunggu', value: 'pending', icon: <MaterialIcons name="pending-actions" size={18} color="white" /> },
    { label: 'Di proses', value: 'processing', icon: <MaterialCommunityIcons name="archive-cog-outline" size={18} color="black" /> },
    { label: 'Selesai', value: 'done', icon: <MaterialCommunityIcons name="archive-check-outline" size={18} color="black" /> },
];


export default function Index() {
    const [userData, setUserData]: any = useState({});
    const [reports, setReports]: any = useState([]);
    const [contestValue, setContestValue] = useState('');

    useFocusEffect(
        useCallback(() => {
            const fetchUser = async () => {
                const userStr = await AsyncStorage.getItem('user');
                const user = userStr ? JSON.parse(userStr) : null;
                if (user) {
                    setUserData({ user });
                }

            };

            fetchUser();
        }, []) // dependensi kosong = hanya saat screen fokus
    );

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'reports'));
                const reports = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));


                const snapshotContest = await getDocs(collection(db, 'contest'));
                const contestShot = snapshotContest.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setContestValue(contestShot.length.toString());
                setReports(reports);
            } catch (err) {
                console.error('❌ Gagal mengambil laporan:', err);
            }
        };

        fetchReports();
    }, []);

    const handlePress = () => {
        // Navigasi ke halaman detail dengan ID
        router.push(`/user/report`);
    };

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

    console.log('user tolol', userData);

    const allReport = reports.length;

    const status_onprocess = reports.filter((report: any) =>
        report.status?.toLowerCase() === 'di proses' || report.status?.toLowerCase() === 'di proses'
    ).length;

    const status_finished = reports.filter((report: any) =>
        report.status?.toLowerCase() === 'selesai'
    ).length;

    const router = useRouter()

    const resetFilters = () => {
        setFiltering({
            status: '',
            date: '',
            search: '',
        });
        setPeriod({
            startDate: '',
            endDate: '',
        });
        bottomSheetRef.current?.close(); // Tutup bottom sheet setelah reset
    };

    const applyFilters = () => {
        bottomSheetRef.current?.close(); // Tutup bottom sheet setelah menerapkan
    };
    const filterReports = (reports: any[], filters: any) => {
        return reports.filter((report) => {
            // Filter berdasarkan status
            if (filters.status && report.status !== filters.status) {
                return false;
            }

            // Filter berdasarkan tanggal
            if (filters.date && period.startDate) {
                const reportDate = new Date(report.createdAt);
                const startDate = new Date(period.startDate);

                if (period.endDate) {
                    const endDate = new Date(period.endDate);
                    endDate.setDate(endDate.getDate() + 1); // Tambah 1 hari agar mencakup hari terakhir

                    if (reportDate < startDate || reportDate >= endDate) {
                        return false;
                    }
                } else {
                    // Filter untuk satu hari
                    if (
                        reportDate.getDate() !== startDate.getDate() ||
                        reportDate.getMonth() !== startDate.getMonth() ||
                        reportDate.getFullYear() !== startDate.getFullYear()
                    ) {
                        return false;
                    }
                }
            }

            // 🔍 Filter berdasarkan pencarian
            if (filters.search) {
                const keyword = filters.search.toLowerCase();
                const searchFields = [
                    report.desc?.toLowerCase() || '',
                    report.category?.toLowerCase() || '',
                    report.email?.toLowerCase() || '',
                    report.location?.[0]?.adress?.toLowerCase() || '',
                ];

                const isMatch = searchFields.some(field => field.includes(keyword));
                if (!isMatch) return false;
            }

            return true;
        });
    };

    const filteredReports = filterReports(reports, filtering);

    return (
        <ScrollView className='pt-12 px-3 bg-white ' style={{ height: height }} >
            <View className="mb-40">
                <View>

                </View>
                <View className='flex-row items-center w-full justify-between p-1    ' >

                    <View className="gap-3 flex-col" >
                        <View className="flex-col gap-1">
                            <Text className="text-xl font-semibold text-primaryBlack">Hi, {getFirstTwoWords(userData?.user?.name)} 👋 </Text>
                            <Text className="text-sm text-gray-500">{truncateText(userData?.user?.location, 30)}</Text>
                        </View>
                    </View>

                    <View className='w-16 h-16  rounded-full   '>
                        <Image
                            className='w-full h-full rounded-full'
                            source={{ uri: `${userData?.user?.image}` }}
                            resizeMode='cover'
                        />
                    </View>

                </View>




                <View className="mt-5 flex-row items-center gap-2">
                    <View className="flex-1 bg-gray-200  h-14 px-4 rounded-full flex-row items-center gap-2">
                        <Feather name="search" size={24} color="#1E2A38" />
                        <TextInput
                            className="flex-1 text-primaryNavy"
                            placeholder="Cari laporan..."
                            placeholderTextColor={'gray'}
                            value={filtering.search}
                            onChangeText={(text) =>
                                setFiltering((prev) => ({ ...prev, search: text }))
                            }
                        />
                    </View>

                    <View className=" flex-row justify-end">
                        <View className="p-3  ">
                            <MaterialIcons onPress={() => { router.push('/user/notif') }} name="notifications-none" size={25} color="#1E2A38" />
                        </View>
                    </View>
                    <View className="w-14   h-14 justify-center items-center rounded-lg">
                        <Feather onPress={openBottomSheet} name="menu" size={24} color="#1E2A38" />
                    </View>


                </View>




                <View className='w-full h-40 rounded-3xl mt-5 overflow-hidden relative'>

                    <Image
                        className='w-full h-full'
                        source={require('../../assets/images/study1.png')}
                        resizeMode='cover'
                    />


                    <View className='absolute inset-0 bg-black/35' />


                    <View className='absolute bottom-0 left-0 right-0 p-5'>
                        <Text className='text-white text-lg'>Lomba Tersedia <Text className='text-primaryOrange font-semibold' >{contestValue}</Text> </Text>
                        <Text className='text-white text-sm'>Terbuka untuk umum</Text>

                        <View className='flex-row justify-between items-center mt-3'>
                            <View>
                                <Text onPress={() => router.push('/user/contest')} className=' text-sm py-2 px-3 bg-primaryNavy text-white rounded-2xl'>Gabung</Text>
                            </View>

                            <View className='p-2 bg-primaryNavy rounded-full'>
                                <MaterialIcons onPress={() => router.push('/user/contest')} name="keyboard-double-arrow-right" size={20} color="white" />
                            </View>
                        </View>
                    </View>
                </View>






                <IndicatorInfo finised={status_finished} onProgress={status_onprocess} total={allReport} />


                {/* laporan */}
                <View>
                    <View className='flex-row justify-between items-center mt-7 px-1'>
                        <Text>Laporan prioritas</Text>
                        <TouchableOpacity
                            onPress={handlePress}
                        >
                            <Text className='text-primaryOrange'>Lihat Semua</Text>
                        </TouchableOpacity>

                    </View>



                    {filteredReports.length === 0 ? (
                        <Text className="text-center text-gray-500 mt-5">Belum ada laporan prioritas</Text>
                    ) : (
                        <ScrollView
                            className='mt-5 overflow-x-hidden'
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}
                        >

                            {filteredReports
                                .filter(r => r.typeReport === 'Prioritas')
                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                .map((report, index) => (
                                    <CardReport
                                        key={report.id || index}
                                        image={
                                            report.images && report.images.length > 0
                                                ? { uri: report.images[0] }
                                                : require('../../assets/images/demo.png')
                                        }
                                        desc={report.desc}
                                        handlepres={() => router.push(`/user/report/${report.id}`)}
                                    />
                                ))}

                        </ScrollView>
                    )}


                </View>





            </View>

            <BottomSheetCustom index={-1} ref={bottomSheetRef} snap={snapPoints} onChange={handleSheetChanges} >

                <View className="">
                    <Text className="mb-2 text-sm text-slate-400">Filter berdasarkan status</Text>

                    <View className="flex-row items-center justify-between bg-gray-200 rounded-2xl px-2 py-2">
                        {STATUS_LIST.map((item) => {
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
                    <ButtonSecondary
                        className='w-[48%] rounded-lg py-2'
                        text='Reset'
                        onPress={resetFilters}
                    />
                    <ButtonPrimary
                        className='w-[48%] rounded-lg py-2'
                        text='Terapkan'
                        onPress={applyFilters}
                    />
                </View>
            </BottomSheetCustom>
        </ScrollView >
    );
}

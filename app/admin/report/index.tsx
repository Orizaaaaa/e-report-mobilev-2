import ButtonPrimary from '@/components/elements/Button/ButtonPrimary'
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary'
import BottomSheetCustom from '@/components/fragments/bottomSheet'
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard'
import { db } from '@/lib/firebase/firebase'
import { formatDate, STATUS_LIST } from '@/utils/helper'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { useRouter } from 'expo-router'
import { collection, getDocs } from 'firebase/firestore'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

type Props = {}
const pages = [
    { label: 'REGULER', value: 'regular' as const },
    { label: 'PRIORITAS', value: 'prioritas' as const },
    { label: 'SELESAI', value: 'selesai' as const },

];
const today = new Date();
const index = (props: Props) => {
    const router = useRouter()
    const [dataReport, setDataReport]: any = useState([]);
    const [period, setPeriod] = useState({ startDate: '', endDate: '' });
    const [activePage, setActivePage] = React.useState(pages[0].value);
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


    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);






    useEffect(() => {
        const fetchReports = async () => {
            try {
                const snapshot = await getDocs(collection(db, 'reports'));
                const reports = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                setDataReport(reports);
            } catch (err) {
                console.error('❌ Gagal mengambil laporan:', err);
            }
        };

        fetchReports();
    }, []);
    console.log('anying', dataReport);
    console.log(filtering);

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



    const renderContent = () => {
        // Terapkan filter ke dataReport
        const filteredReports = filterReports(dataReport, filtering);

        switch (activePage) {
            case 'regular': {
                const filtered = filteredReports.filter((item: any) => item.typeReport === 'Reguler');
                return filtered.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-5">Belum ada laporan reguler</Text>
                ) : (
                    filtered.map((item: any, index: number) => (
                        <CaraoselCard onpress={() => router.push(`/admin/report/${item.id}`)}
                            key={item.id || index}
                            status={item.status || 'status not found'}
                            desc={item.desc || 'description not found'}
                            imageCaraosel={item.images}
                            typeReport="REGULER"
                        />
                    ))
                );
            }
            case 'prioritas': {
                const filtered = filteredReports.filter((item: any) => item.typeReport === 'Prioritas');
                return filtered.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-5">Belum ada laporan prioritas</Text>
                ) : (
                    filtered.map((item: any, index: number) => (
                        <CaraoselCard
                            key={item.id || index}
                            status={item.status || 'status not found'}
                            desc={item.desc || 'description not found'}
                            imageCaraosel={item.images}
                            typeReport="PRIORITAS"
                        />
                    ))
                );
            }
            case 'selesai': {
                const filtered = filteredReports.filter((item: any) => item.status === 'selesai');
                return filtered.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-5">Belum ada laporan selesai</Text>
                ) : (
                    filtered.map((item: any, index: number) => (
                        <CaraoselCard
                            key={item.id || index}
                            status={item.status || 'status not found'}
                            desc={item.desc || 'description not found'}
                            imageCaraosel={item.images}
                            typeReport="SELESAI"
                        />
                    ))
                );
            }
            default:
                return null;
        }
    };

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
    return (
        <SafeAreaView className="flex-1 bg-primaryNavy">
            <View className="bg-primaryNavy pb-14 pt-12 px-3 relative overflow-hidden">
                {/* Decorative circles using original className, assuming NativeWind handles transforms */}
                <View className="absolute z-0 w-[400px] h-[400px] rounded-full bg-white/10 left-1/2 -translate-x-1/2 top-10" />
                <View className="absolute z-0 w-[300px] h-[300px] rounded-full bg-white/10 -right-20 top-1/3" />

                <View className="relative z-10">

                    <View className="flex-row justify-between items-center mt-3 py-3 px-5 bg-primaryWhite rounded-2xl">
                        {pages.map((page) => (
                            <TouchableOpacity
                                key={page.value}
                                className={`py-2 px-4 rounded-full shadow-2xl ${activePage === page.value ? 'bg-primaryOrange' : ''}`}
                                onPress={() => setActivePage(page.value)}
                            >
                                <Text className={activePage === page.value ? 'text-white' : 'text-black'}>
                                    {page.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>



                    <View className="relative z-10 mt-5 flex-row items-center justify-between gap-2  ">
                        <View className="flex-1 h-14 px-3  flex-row items-center gap-2 bg-white rounded-full">
                            <Feather name="search" size={24} color="#FF840C" />
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="Cari..."
                                placeholderTextColor={'gray'}
                                onChangeText={(text) =>
                                    setFiltering((prev) => ({ ...prev, search: text }))
                                }
                            />
                        </View>

                        <View >
                            <View className=" mx-2 border-white rounded-xl">
                                <MaterialIcons onPress={() => { router.push('/admin/notif/NotifPage') }} name="notifications-none" size={25} color="#FF840C" />
                            </View>
                        </View>
                        <View >
                            <Feather onPress={openBottomSheet} name="menu" size={25} color="#FF840C" />
                        </View>
                    </View>


                </View>
            </View>

            {/* View pembungkus konten dari kode asli Anda */}
            <ScrollView className="flex-1 bg-white rounded-t-3xl -mt-6 px-4 py-6">
                {renderContent()}
            </ScrollView>


            <BottomSheetCustom index={-1} ref={bottomSheetRef} snap={snapPoints} onChange={handleSheetChanges} >

                {activePage !== 'selesai' && (
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
                )}






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
        </SafeAreaView>
    )
}

export default index
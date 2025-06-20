import ButtonPrimary from '@/components/elements/Button/ButtonPrimary'
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary'
import BottomSheetCustom from '@/components/fragments/bottomSheet'
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard'
import { formatDate } from '@/utils/helper'
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { Calendar } from 'react-native-calendars'

type Props = {}

const today = new Date();
const index = (props: Props) => {
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


    const handleChange = (key: keyof typeof filtering, value: string | number) => {
        setFiltering(prev => ({ ...prev, [key]: value.toString() }));
    };

    const pages = [
        { label: 'REGULER', value: 'regular' as const },
        { label: 'PRIORITAS', value: 'prioritas' as const },
        { label: 'SELESAI', value: 'selesai' as const },

    ];
    const [activePage, setActivePage] = React.useState(pages[0].value);
    const imagesCaraosel = [
        require('../../../assets/images/demo.png'),
        require('../../../assets/images/study1.png'),
        require('../../../assets/images/demo.png'),
    ];

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);



    const statusList = [
        { label: 'Tidak valid', value: 'invalid', icon: <Feather name="x-circle" size={18} color="black" /> },
        { label: 'Menunggu', value: 'pending', icon: <MaterialIcons name="pending-actions" size={18} color="white" /> },
        { label: 'Di proses', value: 'processing', icon: <MaterialCommunityIcons name="archive-cog-outline" size={18} color="black" /> },
        { label: 'Selesai', value: 'done', icon: <MaterialCommunityIcons name="archive-check-outline" size={18} color="black" /> },
    ];

    console.log(filtering);

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

                            />
                        </View>

                        <View >
                            <View className=" mx-2 border-white rounded-xl">
                                <MaterialIcons name="notifications-none" size={25} color="#FF840C" />
                            </View>
                        </View>
                        <View >
                            <Feather onPress={openBottomSheet} name="menu" size={25} color="#FF840C" />
                        </View>
                    </View>


                </View>
            </View>

            {/* View pembungkus konten dari kode asli Anda */}
            <View className="bg-slate-100 rounded-t-3xl p-4 -mt-6">
                <Text>
                    <TouchableOpacity onPress={() => { router.push('/admin/report/11') }}>
                        <CaraoselCard imageCaraosel={imagesCaraosel} typeReport='REGULER' />
                    </TouchableOpacity>

                </Text>
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
        </SafeAreaView>
    )
}

export default index
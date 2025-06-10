import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { toDateId } from "@marceloterreiro/flash-calendar";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Konfigurasi Bahasa Indonesia
LocaleConfig.locales['id'] = {
    monthNames: [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ],
    monthNamesShort: [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ],
    dayNames: [
        'Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'
    ],
    dayNamesShort: [
        'Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'
    ],
    today: 'Hari ini'
};
LocaleConfig.defaultLocale = 'id';

const DetailContestAdmin = () => {
    const { id } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState(toDateId(new Date()));
    const [selected, setSelected] = useState('');
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["60%"], []);

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);

    const todayDate = new Date();
    const todayId = toDateId(todayDate);

    const nextYear = new Date(todayDate);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearId = toDateId(nextYear);

    return (
        <GestureHandlerRootView className="flex-1 justify-center">
            {/* Tombol buka BottomSheet */}
            <TouchableOpacity
                onPress={openBottomSheet}
                className="bg-blue-600 py-3 px-6 rounded-lg self-center mt-80"
            >
                <Text className="text-white font-semibold text-base">Buka Kalender</Text>
            </TouchableOpacity>

            {/* BottomSheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
            >
                <BottomSheetView className="p-4">
                    <Calendar
                        onDayPress={day => {
                            setSelected(day.dateString);
                        }}
                        markedDates={{
                            [selected]: {
                                selected: true,
                                disableTouchEvent: true,
                                selectedColor: '#1E2A38'
                            }
                        }}
                        theme={{
                            selectedDayBackgroundColor: '#1E2A38',
                            todayTextColor: '#1E2A38',
                            arrowColor: '#1E2A38',
                        }}
                    />
                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default DetailContestAdmin;

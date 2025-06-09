import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Calendar, toDateId } from "@marceloterreiro/flash-calendar";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const DetailContestAdmin = () => {
    const { id } = useLocalSearchParams();
    const [selectedDate, setSelectedDate] = useState(toDateId(new Date()));

    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["50%"], []);

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand(); // Lebih aman dibanding snapToIndex(0)
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);

    // Hitung range kalender
    const todayDate = new Date();
    const todayId = toDateId(todayDate);

    const nextYear = new Date(todayDate);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    const nextYearId = toDateId(nextYear);

    return (
        <GestureHandlerRootView style={styles.container}>
            {/* Tombol buka BottomSheet */}
            <TouchableOpacity
                onPress={openBottomSheet}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Buka Kalender</Text>
            </TouchableOpacity>

            {/* BottomSheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
            >
                <BottomSheetView style={styles.contentContainer}>
                    <Text style={styles.title}>Pilih Tanggal:</Text>
                    <Calendar
                        calendarActiveDateRanges={[
                            {
                                startId: selectedDate,
                                endId: selectedDate,
                            },
                        ]}
                        calendarColorScheme="light"
                        calendarMonthId={todayId}
                        onCalendarDayPress={(dateId) => {
                            // Validasi agar hanya dari hari ini sampai tahun depan
                            if (dateId >= todayId && dateId <= nextYearId) {
                                setSelectedDate(dateId);
                            }
                        }}
                    />

                </BottomSheetView>
            </BottomSheet>
        </GestureHandlerRootView>
    );
};

export default DetailContestAdmin;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    button: {
        backgroundColor: "#2563eb", // blue-600
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        alignSelf: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
    },
    contentContainer: {
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 12,
    },
});

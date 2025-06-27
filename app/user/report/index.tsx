// File: screens/report/reportScreen.tsx

import { PostPredict } from '@/api/model';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    Alert,
    Dimensions, SafeAreaView, // StyleSheet tetap digunakan untuk style yang bukan dari className (mis. deleteImageIcon)
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Import SVG sebagai komponen React
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import DescriptionInput from '@/components/elements/Input/DescriptionInput';
import BottomSheetCustom from '@/components/fragments/bottomSheet';
import CategorySelection from '@/components/fragments/CategorySelection/CategorySelection';
import FullScreenMapModalView from '@/components/fragments/FullScreenMapModalView/FullScreenMapModalView';
import ImageUploadSection from '@/components/fragments/ImageUpload/ImageUploadSection';
import LocationPicker from '@/components/fragments/LocationPicker/LocationPicker';
import { Category, formatDate, FormState, SelectedLocationType } from '@/utils/helper';
import BottomSheet from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import Kat1Icon from '../../../assets/images/kat1.svg';
import Kat2Icon from '../../../assets/images/kat2.svg';
import Kat3Icon from '../../../assets/images/kat3.svg';
import Kat4Icon from '../../../assets/images/kat4.svg';

const { width: windowWidth } = Dimensions.get('window');


// --- Data Kategori ---
const CATEGORIES_DATA: Category[] = [
    { id: 'fasum', name: 'Fasilitas Umum', Icon: Kat1Icon, value: 'Fasilitas Umum' },
    { id: 'jalan', name: 'Jalan Rusak', Icon: Kat2Icon, value: 'Jalan Rusak' },
    { id: 'penerangan', name: 'Penerangan', Icon: Kat3Icon, value: 'Penerangan' },
    { id: 'lainnya', name: 'Lainnya', Icon: Kat4Icon, value: 'Lainnya' },
];

// --- Sub-Komponen ---


const statusList = [
    { label: 'Tidak valid', value: 'invalid', icon: <Feather name="x-circle" size={18} color="black" /> },
    { label: 'Menunggu', value: 'pending', icon: <MaterialIcons name="pending-actions" size={18} color="white" /> },
    { label: 'Di proses', value: 'processing', icon: <MaterialCommunityIcons name="archive-cog-outline" size={18} color="black" /> },
    { label: 'Selesai', value: 'done', icon: <MaterialCommunityIcons name="archive-check-outline" size={18} color="black" /> },
];


// --- Komponen Layar Utama ---
const ReportScreen = () => {
    const [form, setForm] = useState<FormState>({
        desc: '',
        images: [],
        location: [{ lat: 0, long: 0, adress: '' }],
        category: '',
    });

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocationType | null>(null);
    const [fullScreenMapVisible, setFullScreenMapVisible] = useState(false);
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [activePage, setActivePage] = useState<'regular' | 'prioritas' | 'laporan'>('laporan');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    useEffect(() => {
        setForm(prevForm => ({ ...prevForm, images: images }));
    }, [images]);

    useEffect(() => {
        if (selectedLocation) {
            setForm(prevForm => ({
                ...prevForm,
                location: [{
                    lat: selectedLocation.latitude,
                    long: selectedLocation.longitude,
                    adress: selectedAddress || '',
                }],
            }));
        }
    }, [selectedLocation, selectedAddress]);

    const handleImagePickerResponse = (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled) {
            const newAssets = result.assets;
            const totalAfterAdd = images.length + newAssets.length;

            if (totalAfterAdd <= 4) {
                setImages(prev => [...prev, ...newAssets]);
            } else {
                const remainingSlots = 4 - images.length;
                if (remainingSlots > 0) {
                    setImages(prev => [...prev, ...newAssets.slice(0, remainingSlots)]);
                    Alert.alert('Maksimal Gambar', `Hanya ${remainingSlots} gambar berhasil ditambahkan. Maksimal 4 gambar.`);
                } else {
                    Alert.alert('Maksimal Gambar', 'Anda sudah mengunggah maksimal 4 gambar.');
                }
            }
        }
    };

    const openCamera = useCallback(async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses kamera diperlukan!'); return;
        }
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
        handleImagePickerResponse(result);
    }, [images]); // dependency images ditambahkan jika logika di handleImagePickerResponse bergantung padanya

    const openGallery = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses galeri diperlukan!'); return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 1 });
        handleImagePickerResponse(result);
    }, [images]); // dependency images

    const deleteImage = useCallback((indexToDelete: number) => {
        setImages(currentImages => {
            const updatedImages = currentImages.filter((_, idx) => idx !== indexToDelete);
            if (mainImageIndex === indexToDelete) {
                setMainImageIndex(updatedImages.length > 0 ? 0 : 0);
            } else if (mainImageIndex > indexToDelete) {
                setMainImageIndex(prevIndex => prevIndex - 1);
            } else if (mainImageIndex >= updatedImages.length && updatedImages.length > 0) {
                setMainImageIndex(updatedImages.length - 1);
            }
            return updatedImages;
        });
    }, [mainImageIndex]);


    const handleCategorySelect = useCallback((categoryValue: string) => {
        setActiveCategory(categoryValue);
        setForm(prevForm => ({ ...prevForm, category: categoryValue }));
    }, []);

    const handleSubmitReport = useCallback(() => {
        if (!form.desc.trim()) { Alert.alert('Input Kurang', 'Deskripsi laporan tidak boleh kosong.'); return; }
        if (form.images.length === 0) { Alert.alert('Input Kurang', 'Mohon unggah minimal satu gambar sebagai bukti.'); return; }
        if (!selectedLocation) { Alert.alert('Input Kurang', 'Mohon pilih lokasi laporan di peta.'); return; }
        if (!form.category) { Alert.alert('Input Kurang', 'Mohon pilih kategori laporan.'); return; }

        console.log("Mengirim Laporan dengan data form:", form);
        PostPredict(form, (result: any) => {
            console.log("Hasil Pengiriman:", result);
            if (result.success) {
                Alert.alert("Sukses", "Laporan berhasil dikirim!");
                setForm({ desc: '', images: [], location: [{ lat: 0, long: 0, adress: '' }], category: '' });
                setImages([]);
                setSelectedLocation(null);
                setSelectedAddress(null);
                setSearchQuery('');
                setSuggestions([]);
                setActiveCategory(null);
                setMainImageIndex(0);
            } else {
                Alert.alert("Gagal", result.message || "Gagal mengirim laporan.");
            }
        });
    }, [form, selectedLocation]);

    useEffect(() => {
        Location.requestForegroundPermissionsAsync().then(({ status }) => {
            if (status !== 'granted') {
                Alert.alert('Izin Lokasi', 'Aplikasi membutuhkan izin lokasi untuk menampilkan alamat.');
            }
        });
    }, []);

    const handleMapPress = useCallback(async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
        setSuggestions([]);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
                headers: { 'User-Agent': 'ReactNativeApp/1.0' }
            });
            const data = await response.json();
            setSelectedAddress(data.display_name || 'Alamat tidak ditemukan');
        } catch (error) {
            console.error('Gagal reverse geocode:', error);
            setSelectedAddress('Gagal mendapatkan alamat');
        }
    }, []);

    const handleSuggestionPress = useCallback((item: any) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        setSelectedLocation({ latitude: lat, longitude: lon });
        setSearchQuery(item.display_name);
        setSelectedAddress(item.display_name);
        setSuggestions([]);
        setFullScreenMapVisible(false);
    }, []);

    useEffect(() => {
        if (searchQuery.length < 3) { setSuggestions([]); return; }
        const fetchSuggestions = async () => {
            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=6&countrycodes=ID`;
                const response = await fetch(url, { headers: { 'User-Agent': 'ReactNativeApp/1.0' } });
                const data = await response.json();
                setSuggestions(data);
            } catch (error) { console.error('Gagal fetch lokasi:', error); }
        };
        const delayDebounce = setTimeout(fetchSuggestions, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    const imagesCaraosel = [
        require('../../../assets/images/demo.png'),
        require('../../../assets/images/study1.png'),
        require('../../../assets/images/demo.png'),
    ];
    const pages = [
        { label: 'REGULER', value: 'regular' as const },
        { label: 'PRIORITAS', value: 'prioritas' as const },
        { label: 'BUAT LAPORAN', value: 'laporan' as const },
    ];

    console.log(form);



    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);
    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };
    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);



    const renderLaporanForm = () => (
        <View>
            <ImageUploadSection
                images={images}
                mainImageIndex={mainImageIndex}
                onSetMainImageIndex={setMainImageIndex}
                onOpenCamera={openCamera}
                onOpenGallery={openGallery}
                onDeleteImage={deleteImage}
            />
            <DescriptionInput
                title='Deskripsi Laporan'
                placeholderText='Masukkan deskripsi laporan...'
                value={form.desc}
                onChangeText={(text) => setForm(prev => ({ ...prev, desc: text }))}
            />

            <CategorySelection
                categories={CATEGORIES_DATA}
                activeCategoryValue={activeCategory}
                onSelectCategory={handleCategorySelect}
            />

            <LocationPicker
                selectedLocation={selectedLocation}
                selectedAddress={selectedAddress}
                onMapPress={handleMapPress}
                onOpenFullScreenMap={() => setFullScreenMapVisible(true)}
            />
            <FullScreenMapModalView
                visible={fullScreenMapVisible}
                onClose={() => setFullScreenMapVisible(false)}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                suggestions={suggestions}
                onSuggestionPress={handleSuggestionPress}
                selectedLocation={selectedLocation}
                onMapPress={handleMapPress}
                onConfirmLocation={() => setFullScreenMapVisible(false)}
            />

            {/* Menggunakan `className` sesuai dengan kode asli user untuk ButtonPrimary */}
            <View className='flex-row  '>
                <ButtonPrimary text="Buat Laporan" className="px-3 py-2 mt-6 mb-6 rounded-lg " onPress={handleSubmitReport} />
            </View>
        </View>
    );

    const renderContent = () => {
        switch (activePage) {
            case 'regular': return <CaraoselCard imageCaraosel={imagesCaraosel} typeReport='REGULER' />;
            case 'prioritas': return <CaraoselCard imageCaraosel={imagesCaraosel} typeReport='PRIORITAS' />;
            case 'laporan': return renderLaporanForm();
            default: return null;
        }
    };

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

    // console.log(form); // Untuk debugging jika diperlukan

    return (
        <SafeAreaView className='flex-1 ' >
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

                    {
                        activePage !== 'laporan' ? (

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
                                        <MaterialIcons onPress={() => { router.push('/user/notif') }} name="notifications-none" size={25} color="#FF840C" />
                                    </View>
                                </View>
                                <View >
                                    <Feather onPress={openBottomSheet} name="menu" size={25} color="#FF840C" />
                                </View>
                            </View>

                        ) : null
                    }

                </View>
            </View>

            {/* View pembungkus konten dari kode asli Anda */}
            <View className="bg-white rounded-t-3xl p-4 -mt-6 flex-1">
                {renderContent()}
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
    );
};



export default ReportScreen;
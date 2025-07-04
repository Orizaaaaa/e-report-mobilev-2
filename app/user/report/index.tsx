// File: screens/report/reportScreen.tsx
import { Feather, MaterialIcons } from '@expo/vector-icons';
import BottomSheet from '@gorhom/bottom-sheet';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    SafeAreaView,
    ScrollView,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';

// Components
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import DescriptionInput from '@/components/elements/Input/DescriptionInput';
import BottomSheetCustom from '@/components/fragments/bottomSheet';
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard';
import ImageUploadSection from '@/components/fragments/ImageUpload/ImageUploadSection';

// API and Types
import { PostPredict } from '@/api/model';
import { CATEGORIES_DATA, formatDate, FormState, PAGES, SelectedLocationType, STATUS_LIST } from '@/utils/helper';

// Assets
import { sendNotificationToRole, uploadImagesToStorage } from '@/api/api';
import CategorySelection from '@/components/fragments/CategorySelection/CategorySelection';
import { db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection, getDocs } from 'firebase/firestore';

const { width: windowWidth } = Dimensions.get('window');

type CaraoselCardProps = {
    imageCaraosel: string[];
    typeReport: 'REGULER' | 'PRIORITAS';
};
// Constants

const MAX_IMAGES = 4;

const ReportScreen = () => {

    // State Management
    const [loadingSend, setLoadingSend] = useState(false);
    const [dataReport, setDataReport]: any = useState([])
    const [form, setForm] = useState<FormState>({
        desc: '',
        images: [],
        location: [{ lat: 0, long: 0, adress: '' }],
        category: '',
        typeReport: '',
        status: 'menunggu',
        anonim: false
    });

    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [activePage, setActivePage] = useState<'regular' | 'prioritas' | 'laporan'>('regular');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<SelectedLocationType | null>(null);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

    // Search State
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [searched, setSearched] = useState(false);

    // Filter State
    const [period, setPeriod] = useState({ startDate: '', endDate: '' });
    const [filtering, setFiltering] = useState({
        status: '',
        date: '',
        search: '',
    });

    // Refs
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ["80%"], []);

    // Effects
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

    useEffect(() => {
        Location.requestForegroundPermissionsAsync().then(({ status }) => {
            if (status !== 'granted') {
                Alert.alert('Izin Lokasi', 'Aplikasi membutuhkan izin lokasi untuk menampilkan alamat.');
            }
        });
    }, []);

    // Handlers
    const handleImagePickerResponse = (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled) {
            const newAssets = result.assets;
            const totalAfterAdd = images.length + newAssets.length;

            if (totalAfterAdd <= MAX_IMAGES) {
                setImages(prev => [...prev, ...newAssets]);
            } else {
                const remainingSlots = MAX_IMAGES - images.length;
                if (remainingSlots > 0) {
                    setImages(prev => [...prev, ...newAssets.slice(0, remainingSlots)]);
                    Alert.alert('Maksimal Gambar', `Hanya ${remainingSlots} gambar berhasil ditambahkan. Maksimal ${MAX_IMAGES} gambar.`);
                } else {
                    Alert.alert('Maksimal Gambar', `Anda sudah mengunggah maksimal ${MAX_IMAGES} gambar.`);
                }
            }
        }
    };

    const openCamera = useCallback(async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses kamera diperlukan!');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        handleImagePickerResponse(result);
    }, [images]);

    const openGallery = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses galeri diperlukan!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        handleImagePickerResponse(result);
    }, [images]);

    const deleteImage = useCallback((indexToDelete: number) => {
        setImages(currentImages => {
            const updatedImages = currentImages.filter((_, idx) => idx !== indexToDelete);

            // Adjust main image index if needed
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

    const handleSubmitReport = async (
        form: FormState,
        setForm: (f: FormState) => void,

    ) => {
        setLoadingSend(true);
        try {
            // ✅ Validasi isi
            if (
                !form.desc.trim() ||
                !form.category.trim() ||
                form.location.length === 0 ||
                form.images.length === 0
            ) {
                Alert.alert('Error', 'Semua Form harus diisi');
                setLoadingSend(false);
                return;
            }

            // ✅ Validasi karakter minimal 15
            const descLength = form.desc.trim().length;
            const locationAddress = form.location[0]?.adress || '';
            const locationLength = locationAddress.trim().length;

            if (descLength < 15) {
                Alert.alert('Error', 'Deskripsi minimal 15 karakter');
                setLoadingSend(false);
                return;
            }

            if (locationLength < 15) {
                Alert.alert('Error', 'Lokasi minimal 15 karakter');
                setLoadingSend(false);
                return;
            }

            if (form.images.length > 4) {
                Alert.alert('Error', 'Gambar maksimal 4');
                setLoadingSend(false);
                return;
            }

            // Ambil user dari storage
            const userStr = await AsyncStorage.getItem('user');
            const currentUser = userStr ? JSON.parse(userStr) : null;

            if (!currentUser) {
                Alert.alert('Gagal', 'User belum login');
                setLoadingSend(false);
                return;
            }

            // 🔎 Prediksi tipe laporan
            PostPredict(form.desc, async (predictResult: any) => {
                const predictedType = predictResult?.prediction || 'reguler';

                setForm({ ...form, typeReport: predictedType });

                // Upload gambar
                const imageUrls = await uploadImagesToStorage(
                    form.images.map((image) => image.uri),
                    currentUser.uid
                );

                // Siapkan data laporan
                const reportData = {
                    desc: form.desc,
                    images: imageUrls,
                    location: form.location,
                    category: form.category,
                    typeReport: predictedType,
                    anonim: form.anonim,
                    uid: currentUser.uid,
                    email: currentUser.email,
                    status: 'menunggu',
                    name: currentUser.name,
                    createdAt: new Date().toISOString(),
                };

                // Simpan ke Firestore
                const reportRef = await addDoc(collection(db, 'reports'), reportData);
                console.log('✅ Laporan dikirim dengan ID:', reportRef.id);

                // Notifikasi ke admin
                await sendNotificationToRole('admin', 'Ada laporan baru dari');

                // Simpan data notifikasi
                await addDoc(collection(db, 'notifications'), {
                    title: 'Laporan Baru',
                    body: `Ada laporan baru bertipe ${predictedType} dari ${currentUser.name}`,
                    toRole: 'admin',
                    typeNotif: 'report',
                    userName: currentUser.name,
                    image: currentUser.image || 'image empety',
                    fromUid: currentUser.uid,
                    createdAt: new Date().toISOString(),
                    read: false,
                });

                setLoadingSend(false);
                Alert.alert('Sukses', 'Laporan berhasil dikirim!');
            });
        } catch (err) {
            setLoadingSend(false);
            console.error('❌ Gagal kirim laporan:', err);
            Alert.alert('Error', 'Gagal mengirim laporan');
        }
    };


    const resetForm = () => {
        setForm({
            desc: '',
            images: [],
            location: [{ lat: 0, long: 0, adress: '' }],
            category: '',
            anonim: false,
            typeReport: '',
            status: 'menunggu',
        });
        setImages([]);
        setSelectedLocation(null);
        setSelectedAddress(null);
        setQuery('');
        setResults([]);
        setSearched(false);
        setActiveCategory(null);
        setMainImageIndex(0);
    };

    const handleSearch = async () => {
        if (query.length < 3) {
            setResults([]);
            setSearched(true);
            return;
        }

        setLoading(true);
        setResults([]);
        setSearched(false);

        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1&accept-language=id`,
                {
                    headers: {
                        'User-Agent': 'e-report-mobile/1.0 (youremail@example.com)',
                    },
                }
            );
            const data = await res.json();
            setResults(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Search error:', err);
            setResults([]);
        } finally {
            setLoading(false);
            setSearched(true);
        }
    };

    const handleSelect = (item: any) => {
        if (!item) return;

        setForm((prev) => ({
            ...prev,
            location: [
                {
                    lat: parseFloat(item.lat),
                    long: parseFloat(item.lon),
                    adress: item.display_name,
                },
            ],
        }));

        setQuery(item.display_name);
        setResults([]);
        setSearched(false);
    };

    const openBottomSheet = () => {
        bottomSheetRef.current?.expand();
    };

    const handleSheetChanges = useCallback((index: number) => {
        console.log("BottomSheet index:", index);
    }, []);

    // Helper Functions
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

    // Render Functions
    const renderLaporanForm = () => (
        <ScrollView className='mb-24'>
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

            <View className="mt-8">
                <Text className='mb-2 text-gray-500'>Lokasi Kejadian (tidak harus sesuai pencarian) </Text>
                <View className="flex-row items-center space-x-2 mb-4 gap-2">
                    <TextInput
                        placeholderTextColor={'gray'}
                        placeholder="Masukkan lokasi kejadian..."
                        value={query}
                        onChangeText={(text) => {
                            setQuery(text);
                            // Update location state immediately as user types
                            setForm(prev => ({
                                ...prev,
                                location: [{
                                    lat: 0, // Default 0 jika tidak ada koordinat
                                    long: 0, // Default 0 jika tidak ada koordinat
                                    adress: text, // Simpan teks yang diketik user
                                }],
                            }));
                        }}
                        className="flex-1 border border-gray-300 rounded-md p-3 text-base"
                    />

                    <TouchableOpacity
                        onPress={handleSearch}
                        className="p-3 border border-gray-300 rounded-md"
                    >
                        <Feather name="search" size={20} color="black" />
                    </TouchableOpacity>
                </View>
                {loading && <ActivityIndicator size="small" color="#000" />}

                {!loading && searched && results.length === 0 && (
                    <Text className="text-center text-gray-500">Lokasi tidak ditemukan</Text>
                )}

                {!loading && results.map((item, index) => (
                    <TouchableOpacity
                        key={item.place_id || index}
                        onPress={() => handleSelect(item)}
                        className="p-3 border border-gray-200 rounded-md mb-2 bg-white"
                    >
                        <Text className="text-sm text-gray-800">
                            {item.display_name || 'Nama lokasi tidak tersedia'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <CategorySelection
                categories={CATEGORIES_DATA}
                activeCategoryValue={activeCategory}
                onSelectCategory={handleCategorySelect}
            />

            <View className="flex-row items-center justify-between mt-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <View className="flex-1">
                    <Text className="text-base font-medium text-gray-800">Laporkan sebagai Anonim</Text>
                    <Text className="text-sm text-gray-500">Identitas Anda tidak akan ditampilkan</Text>
                </View>
                <Switch
                    trackColor={{ false: "#e5e7eb", true: "#1E2A38" }}
                    thumbColor={"#ffffff"}
                    ios_backgroundColor="#e5e7eb"
                    onValueChange={(value) => setForm(prev => ({ ...prev, anonim: value }))}
                    value={form.anonim}
                    className="ml-2"
                />
            </View>

            <View className='flex-row justify-end'>
                {loadingSend ?
                    <View className='px-6 py-4 mt-6 mb-6 rounded-lg bg-primaryNavy' >
                        <ActivityIndicator size="large" color="white" />
                    </View>

                    :
                    <ButtonPrimary
                        text="Buat Laporan"
                        className="px-6 py-4 mt-6 mb-6 rounded-lg"
                        onPress={() => handleSubmitReport(form, setForm)}
                    />}

            </View>
        </ScrollView>
    );


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

    const renderContent = () => {
        // Terapkan filter ke dataReport
        const filteredReports = filterReports(dataReport, filtering);

        switch (activePage) {
            case 'regular': {
                const filtered = filteredReports.filter((item: any) => item.typeReport === 'Reguler');
                return filtered.length === 0 ? (
                    <Text className="text-center text-gray-500 mt-2">Belum ada laporan reguler</Text>
                ) : (
                    filtered.map((item: any, index: number) => (
                        <CaraoselCard
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
                    <Text className="text-center text-gray-500 mt-2">Belum ada laporan prioritas</Text>
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
            case 'laporan':
                return renderLaporanForm();
            default:
                return null;
        }
    };

    const renderStatusFilter = () => (
        <View className="flex-row items-center justify-between bg-gray-200 rounded-2xl px-2 py-2">
            {STATUS_LIST.map((item) => {
                const isActive = filtering.status === item.value;
                return (
                    <TouchableOpacity
                        key={item.value}
                        className={`flex items-center px-2 py-1 rounded-xl ${isActive ? 'bg-primaryNavy' : ''}`}
                        onPress={() => {
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
    );

    const renderCalendar = () => (
        <Calendar
            onDayPress={(day) => {
                const formatted = formatDate({ day: day.day, month: day.month, year: day.year });

                if (!period.startDate || (period.startDate && period.endDate)) {
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
    );

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
                    endDate.setDate(endDate.getDate() + 1); // Tambah 1 hari untuk mencakup seluruh hari terakhir

                    if (reportDate < startDate || reportDate >= endDate) {
                        return false;
                    }
                } else {
                    // Filter untuk satu hari tertentu
                    if (
                        reportDate.getDate() !== startDate.getDate() ||
                        reportDate.getMonth() !== startDate.getMonth() ||
                        reportDate.getFullYear() !== startDate.getFullYear()
                    ) {
                        return false;
                    }
                }
            }

            return true;
        });
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
    console.log(filtering);

    return (
        <SafeAreaView className='flex-1'>
            <View className="bg-primaryNavy pb-14 pt-12 px-3 relative overflow-hidden">
                {/* Decorative circles */}
                <View className="absolute z-0 w-[400px] h-[400px] rounded-full bg-white/10 left-1/2 -translate-x-1/2 top-10" />
                <View className="absolute z-0 w-[300px] h-[300px] rounded-full bg-white/10 -right-20 top-1/3" />

                <View className="relative z-10">
                    <View className="flex-row justify-between items-center mt-3 py-3 px-5 bg-primaryWhite rounded-2xl">
                        {PAGES.map((page) => (
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

                    {activePage !== 'laporan' && (
                        <View className="relative z-10 mt-5 flex-row items-center justify-between gap-2">
                            <View className="flex-1 h-14 px-3 flex-row items-center gap-2 bg-white rounded-full">
                                <Feather name="search" size={24} color="#FF840C" />
                                <TextInput
                                    className="flex-1 text-gray-800"
                                    placeholder="Cari..."
                                    placeholderTextColor={'gray'}
                                />
                            </View>

                            <View className="mx-2 border-white rounded-xl">
                                <MaterialIcons
                                    onPress={() => { router.push('/user/notif') }}
                                    name="notifications-none"
                                    size={25}
                                    color="#FF840C"
                                />
                            </View>

                            <View>
                                <Feather
                                    onPress={openBottomSheet}
                                    name="menu"
                                    size={25}
                                    color="#FF840C"
                                />
                            </View>
                        </View>
                    )}
                </View>
            </View>

            <View className="bg-white rounded-t-3xl p-4 -mt-6 flex-1">
                {renderContent()}
            </View>

            <BottomSheetCustom
                index={-1}
                ref={bottomSheetRef}
                snap={snapPoints}
                onChange={handleSheetChanges}
            >
                <View className="">
                    <Text className="mb-2 text-sm text-slate-400">Filter berdasarkan status</Text>
                    {renderStatusFilter()}
                </View>

                <View className='mt-7'>
                    <Text className="text-sm text-slate-400">Filter berdasarkan tanggal</Text>
                    {renderCalendar()}
                </View>

                <View className='flex-row justify-between mt-7'>

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
    );
};

export default ReportScreen;
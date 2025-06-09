// File: screens/report/reportScreen.tsx

import { PostPredict } from '@/api/model';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard';
import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions, // StyleSheet tetap digunakan untuk style yang bukan dari className (mis. deleteImageIcon)
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Import SVG sebagai komponen React
import DescriptionInput from '@/components/elements/Input/DescriptionInput';
import CategorySelection from '@/components/fragments/CategorySelection/CategorySelection';
import FullScreenMapModalView from '@/components/fragments/FullScreenMapModalView/FullScreenMapModalView';
import ImageUploadSection from '@/components/fragments/ImageUpload/ImageUploadSection';
import LocationPicker from '@/components/fragments/LocationPicker/LocationPicker';
import { Category, FormState, SelectedLocationType } from '@/utils/helper';
import Kat1Icon from '../../assets/images/kat1.svg';
import Kat2Icon from '../../assets/images/kat2.svg';
import Kat3Icon from '../../assets/images/kat3.svg';
import Kat4Icon from '../../assets/images/kat4.svg';

const { width: windowWidth } = Dimensions.get('window');


// --- Data Kategori ---
const CATEGORIES_DATA: Category[] = [
    { id: 'fasum', name: 'Fasilitas Umum', Icon: Kat1Icon, value: 'Fasilitas Umum' },
    { id: 'jalan', name: 'Jalan Rusak', Icon: Kat2Icon, value: 'Jalan Rusak' },
    { id: 'penerangan', name: 'Penerangan', Icon: Kat3Icon, value: 'Penerangan' },
    { id: 'lainnya', name: 'Lainnya', Icon: Kat4Icon, value: 'Lainnya' },
];

// --- Sub-Komponen ---




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
        require('../../assets/images/demo.png'),
        require('../../assets/images/study1.png'),
        require('../../assets/images/demo.png'),
    ];
    const pages = [
        { label: 'REGULER', value: 'regular' as const },
        { label: 'PRIORITAS', value: 'prioritas' as const },
        { label: 'BUAT LAPORAN', value: 'laporan' as const },
    ];

    console.log(form);


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
            <View className='flex-row justify-end '>
                <ButtonPrimary text="Kirim Laporan" className="p-3 mt-6 mb-6 rounded-lg " onPress={handleSubmitReport} />
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

    // console.log(form); // Untuk debugging jika diperlukan

    return (
        <LayoutPage padding='p-0'>
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
                                        <MaterialIcons name="notifications-none" size={25} color="#FF840C" />
                                    </View>
                                </View>
                                <View >
                                    <Feather name="menu" size={25} color="#FF840C" />
                                </View>
                            </View>

                        ) : null
                    }

                </View>
            </View>

            {/* View pembungkus konten dari kode asli Anda */}
            <View className="bg-white rounded-t-3xl p-4 -mt-6">
                {renderContent()}
            </View>
        </LayoutPage>
    );
};



export default ReportScreen;
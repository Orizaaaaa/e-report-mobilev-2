// File: screens/report/reportScreen.tsx

import { PostPredict } from '@/api/model';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard';
import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView as RNScrollView,
    StyleSheet, // StyleSheet tetap digunakan untuk style yang bukan dari className (mis. deleteImageIcon)
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';

// Import SVG sebagai komponen React
import Kat1Icon from '../../assets/images/kat1.svg';
import Kat2Icon from '../../assets/images/kat2.svg';
import Kat3Icon from '../../assets/images/kat3.svg';
import Kat4Icon from '../../assets/images/kat4.svg';

const { width: windowWidth } = Dimensions.get('window');

// --- Helper Types ---
interface FormState {
    desc: string;
    images: ImagePicker.ImagePickerAsset[];
    location: Array<{ lat: number; long: number; adress: string }>;
    category: string;
}
interface SelectedLocationType { // Diberi nama yang lebih spesifik
    latitude: number;
    longitude: number;
}
interface Category {
    id: string;
    name: string;
    Icon: React.FC<any>;
    value: string;
}

// --- Data Kategori ---
const CATEGORIES_DATA: Category[] = [
    { id: 'fasum', name: 'Fasilitas Umum', Icon: Kat1Icon, value: 'Fasilitas Umum' },
    { id: 'jalan', name: 'Jalan Rusak', Icon: Kat2Icon, value: 'Jalan Rusak' },
    { id: 'penerangan', name: 'Penerangan', Icon: Kat3Icon, value: 'Penerangan' },
    { id: 'lainnya', name: 'Lainnya', Icon: Kat4Icon, value: 'Lainnya' },
];

// --- Sub-Komponen ---

interface ReportDescriptionInputProps {
    value: string;
    onChangeText: (text: string) => void;
}
const ReportDescriptionInput: React.FC<ReportDescriptionInputProps> = ({ value, onChangeText }) => (
    <View className="mt-4">
        <Text className="text-base font-semibold mb-1 text-gray-700">Deskripsi Laporan</Text>
        <TextInput
            className="border-2 border-gray-300 rounded-lg p-3" // className dari user
            placeholder="Masukkan deskripsi laporan..."
            multiline
            numberOfLines={6}
            value={value}
            onChangeText={onChangeText}
            style={{ textAlignVertical: 'top', height: 120 }} // style inline dari user
        />
    </View>
);

interface ImageUploadSectionProps {
    images: ImagePicker.ImagePickerAsset[];
    mainImageIndex: number;
    onSetMainImageIndex: (index: number) => void;
    onOpenCamera: () => void;
    onOpenGallery: () => void;
    onDeleteImage: (index: number) => void;
}
const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    images,
    mainImageIndex,
    onSetMainImageIndex,
    onOpenCamera,
    onOpenGallery,
    onDeleteImage,
}) => {
    const imageSlots = [0, 1, 2, 3];

    const handleThumbnailPress = (index: number) => {
        if (images[index]) {
            onSetMainImageIndex(index);
        } else {
            if (images.length < 4) {
                Alert.alert(
                    "Pilih Sumber Gambar",
                    "Ambil gambar dari kamera atau galeri?",
                    [
                        { text: "Kamera", onPress: onOpenCamera },
                        { text: "Galeri", onPress: onOpenGallery },
                        { text: "Batal", style: "cancel" }
                    ]
                );
            } else {
                Alert.alert("Penuh", "Anda sudah mengunggah 4 gambar.");
            }
        }
    };

    return (
        <View>
            <View
                className={`w-full h-40 rounded-xl justify-center items-center ${images[mainImageIndex] ? '' : 'border-2 border-dotted  border-gray-400'}`}
            >
                {images.length > 0 && images[mainImageIndex] ? (
                    <Image
                        source={{ uri: images[mainImageIndex].uri }}
                        className="w-full h-full rounded-lg" // className dari user
                        resizeMode="cover"
                    />
                ) : (
                    <AntDesign name="pluscircleo" size={30} color="gray" />
                )}
            </View>

            <View className="flex-row flex-wrap justify-start -mx-1 mt-2">
                {imageSlots.map(index => (
                    <View key={index} className="basis-1/4 px-1 mb-2">
                        <TouchableOpacity
                            className="relative" // className dari user
                            onPress={() => handleThumbnailPress(index)}
                            onLongPress={() => {
                                if (images[index]) onDeleteImage(index);
                            }}
                        >
                            <View
                                className={`aspect-square rounded-lg justify-center items-center overflow-hidden ${images[index] ? '' : 'border-2 border-dotted border-gray-300'}`}
                            >
                                {images[index] ? (
                                    <Image
                                        source={{ uri: images[index].uri }}
                                        className="w-full h-full" // className dari user
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <AntDesign name="plus" size={24} color="gray" />
                                )}
                            </View>
                            {images[index] && (
                                <TouchableOpacity
                                    style={styles.deleteImageIcon} // Ini adalah style inline asli, dipertahankan atau di StyleSheet
                                    onPress={() => onDeleteImage(index)}
                                >
                                    <AntDesign name="closecircle" size={18} color="white" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {images.length > 0 && (
                <>
                    <Text className='text-xs italic text-gray-600 mt-1'>
                        * Tekan thumbnail untuk mengganti gambar utama.
                    </Text>
                    <Text className='text-xs italic text-red-600'>
                        * Tekan lama thumbnail atau ikon (x) untuk menghapus gambar.
                    </Text>
                </>
            )}
            {images.length >= 4 && (
                <Text className="text-xs italic text-red-700 mt-1">
                    * Bukti laporan maksimal 4 gambar.
                </Text>
            )}

            <View className="flex-row justify-between mt-3">
                <View className="w-[48%]">
                    {/* Menggunakan `className` sesuai dengan kode asli user untuk ButtonPrimary */}
                    <ButtonPrimary text="Buka Kamera" className="p-2 rounded-lg border-2 border-primaryNavy" onPress={onOpenCamera} />
                </View>
                <View className="w-[48%]">
                    {/* Menggunakan `className` sesuai dengan kode asli user untuk ButtonSecondary */}
                    <ButtonSecondary text="Buka Galeri" className="p-2 rounded-lg" onPress={onOpenGallery} />
                </View>
            </View>
        </View>
    );
};

interface LocationPickerProps {
    selectedLocation: SelectedLocationType | null;
    selectedAddress: string | null;
    onMapPress: (event: any) => void;
    onOpenFullScreenMap: () => void;
}
const LocationPicker: React.FC<LocationPickerProps> = ({
    selectedLocation,
    selectedAddress,
    onMapPress,
    onOpenFullScreenMap,
}) => {
    const defaultMapRegion = { // Lokasi default jika belum ada yang dipilih
        latitude: -2.548926,
        longitude: 118.014863,
        latitudeDelta: 20,
        longitudeDelta: 20,
    };
    const currentRegion = selectedLocation
        ? { ...selectedLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 }
        : defaultMapRegion;

    return (
        <View className="mt-4">
            <Text className="text-base font-semibold mb-1 text-gray-700">Lokasi Laporan</Text>
            <View className="h-40 w-full rounded-xl overflow-hidden relative border-2 border-gray-300">
                <MapView style={{ flex: 1 }} region={currentRegion} onPress={onMapPress}>
                    {selectedLocation && <Marker coordinate={selectedLocation} title="Lokasi laporan" />}
                </MapView>
                <TouchableOpacity
                    className="absolute bottom-2 right-2 bg-primaryNavy bg-opacity-80 px-3 py-1.5 rounded-md shadow-md" // className dari user
                    onPress={onOpenFullScreenMap}
                >
                    <Text className="text-white text-sm font-medium">Pilih di Peta Besar</Text>
                </TouchableOpacity>
            </View>
            {selectedLocation && (
                <Text className="mt-2 text-sm text-gray-600">
                    Koordinat: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </Text>
            )}
            {selectedAddress && (
                <Text className="mt-1 text-sm text-gray-600">Alamat: {selectedAddress}</Text>
            )}
        </View>
    );
};

interface FullScreenMapModalViewProps {
    visible: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    suggestions: any[];
    onSuggestionPress: (item: any) => void;
    selectedLocation: SelectedLocationType | null;
    onMapPress: (event: any) => void;
    onConfirmLocation: () => void;
}
const FullScreenMapModalView: React.FC<FullScreenMapModalViewProps> = ({
    visible,
    onClose,
    searchQuery,
    onSearchQueryChange,
    suggestions,
    onSuggestionPress,
    selectedLocation,
    onMapPress,
    onConfirmLocation
}) => {
    const initialModalRegion = selectedLocation
        ? { ...selectedLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 }
        : { latitude: -6.914744, longitude: 107.60981, latitudeDelta: 0.0922, longitudeDelta: 0.0421 };

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View className="flex-1">
                <View className="absolute top-4 left-4 right-4 z-10 bg-white p-2 rounded-xl shadow-lg">
                    <TextInput
                        placeholder="Cari nama jalan atau tempat..."
                        value={searchQuery}
                        onChangeText={onSearchQueryChange}
                        className="border border-gray-300 p-2.5 rounded-lg text-sm" // className dari user
                    />
                    {suggestions.length > 0 && (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.place_id?.toString() || Math.random().toString()}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => onSuggestionPress(item)} className="p-2.5 border-b border-gray-200">
                                    <Text className="text-sm text-gray-700">{item.display_name}</Text>
                                </Pressable>
                            )}
                            style={{ maxHeight: 200 }}
                        />
                    )}
                </View>

                <MapView
                    style={{ flex: 1 }}
                    initialRegion={initialModalRegion}
                    region={selectedLocation ? { ...selectedLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 } : undefined}
                    onPress={onMapPress}
                    showsUserLocation={true}
                >
                    {selectedLocation && <Marker coordinate={selectedLocation} title="Lokasi laporan" />}
                </MapView>

                <TouchableOpacity
                    className="absolute bottom-6 right-4 bg-red-500 px-4 py-2 rounded-lg shadow-md" // className dari user
                    onPress={onClose}
                >
                    <Text className="text-white text-base font-medium">Tutup Peta</Text>
                </TouchableOpacity>
                {selectedLocation && (
                    <TouchableOpacity
                        className="absolute bottom-6 left-4 bg-green-500 px-4 py-2 rounded-lg shadow-md" // className dari user
                        onPress={onConfirmLocation}
                    >
                        <Text className="text-white text-base font-medium">Konfirmasi Lokasi Ini</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
};

interface CategoryItemProps {
    category: Category;
    isActive: boolean;
    onPress: () => void;
}
const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onPress }) => (
    // Wrapper View untuk className dari kode asli user di ScrollView
    <View className="px-1">
        <TouchableOpacity
            onPress={onPress}
            // className untuk styling tombol kategori individual
            className={`p-3 border-2 rounded-lg items-center w-24 h-24 justify-center 
                        ${isActive ? 'border-primaryOrange bg-orange-50' : 'border-gray-300 bg-white'}`}
        >
            <category.Icon width={32} height={32} />
            <Text
                className={`mt-1 text-xs text-center ${isActive ? 'text-primaryOrange font-semibold' : 'text-gray-700'}`}
                numberOfLines={2}
            >
                {category.name}
            </Text>
        </TouchableOpacity>
    </View>
);

interface CategorySelectionProps {
    categories: Category[];
    activeCategoryValue: string | null;
    onSelectCategory: (categoryValue: string) => void;
}
const CategorySelection: React.FC<CategorySelectionProps> = ({ categories, activeCategoryValue, onSelectCategory }) => (
    <View className="mt-4">
        <Text className="text-base font-semibold mb-2 text-gray-700">Kategori Laporan</Text>
        {/* className -mx-1 dari kode asli user untuk ScrollView */}
        <RNScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            {categories.map((cat) => (
                <CategoryItem
                    key={cat.id}
                    category={cat}
                    isActive={activeCategoryValue === cat.value}
                    onPress={() => onSelectCategory(cat.value)}
                />
            ))}
        </RNScrollView>
    </View>
);


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
            <ReportDescriptionInput
                value={form.desc}
                onChangeText={(text) => setForm(prev => ({ ...prev, desc: text }))}
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
            <CategorySelection
                categories={CATEGORIES_DATA}
                activeCategoryValue={activeCategory}
                onSelectCategory={handleCategorySelect}
            />
            {/* Menggunakan `className` sesuai dengan kode asli user untuk ButtonPrimary */}
            <ButtonPrimary text="Kirim Laporan" className="p-3 mt-8 mb-6 rounded-lg bg-green-600" onPress={handleSubmitReport} />
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
                    <View className="flex-row justify-between items-center mt-3 py-3 px-5 bg-primaryWhite rounded-full">
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
                    <View className="mt-7 flex-row items-center gap-2">
                        <View className="flex-1 border-2 border-gray-200 h-14 px-2 rounded-lg flex-row items-center gap-2">
                            <Feather name="search" size={24} color="white" />
                            <TextInput
                                className="flex-1 text-white"
                                placeholder="Cari Laporan..."
                                placeholderTextColor="#FFFFFF"
                            />
                        </View>
                        <View className="w-14 border-2 border-gray-200 h-14 justify-center items-center rounded-lg">
                            <Feather name="menu" size={24} color="white" />
                        </View>
                    </View>
                </View>
            </View>

            {/* View pembungkus konten dari kode asli Anda */}
            <View className="bg-white rounded-t-3xl p-4 -mt-6">
                {/* Jika konten 'laporan' bisa panjang, ScrollView mungkin diperlukan di sini atau di dalam renderLaporanForm */}
                {/* Untuk saat ini, saya akan mengikuti struktur asli dimana renderContent() langsung di dalam View ini. */}
                {/* Jika Anda menemukan masalah scrolling, bungkus output renderLaporanForm dengan ScrollView. */}
                {renderContent()}
            </View>
        </LayoutPage>
    );
};

const styles = StyleSheet.create({
    deleteImageIcon: { // Style ini adalah style inline asli, jadi aman di StyleSheet
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        padding: 2,
    },
});

export default ReportScreen;
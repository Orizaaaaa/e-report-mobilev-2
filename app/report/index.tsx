import { PostPredict } from '@/api/model';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard';
import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, Dimensions, FlatList, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import Kat1 from '../../assets/images/kat1.svg';
import Kat2 from '../../assets/images/kat2.svg';
import Kat3 from '../../assets/images/kat3.svg';
import Kat4 from '../../assets/images/kat4.svg';
// Dummy data




const reportScreen = () => {

    const [form, setForm] = useState({
        desc: '',
        images: [] as ImagePicker.ImagePickerAsset[], // Tipe disesuaikan dengan hasil ImagePicker
        location: [
            {
                lat: 0,
                long: 0,
                adress: ''
            }
        ],
        category: ''
    });

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const { width } = Dimensions.get('window');
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]); // State untuk UI ImagePicker
    const [mainImageIndex, setMainImageIndex] = useState(0);
    // const [searchText, setSearchText] = useState(''); // Ini sepertinya tidak terpakai, form.desc digunakan
    const [activePage, setActivePage] = useState<'regular' | 'prioritas' | 'laporan'>('regular');
    const [activeCategory, setActiveCategory] = useState<string | null>(null); // Untuk UI feedback kategori

    // console.log("Current form state:", form); // Untuk debug form state

    // Sinkronkan state 'images' (dari ImagePicker) ke 'form.images'
    useEffect(() => {
        setForm(prevForm => ({
            ...prevForm,
            images: images
        }));
    }, [images]);

    // Sinkronkan 'selectedLocation' dan 'selectedAddress' ke 'form.location'
    useEffect(() => {
        if (selectedLocation) {
            setForm(prevForm => ({
                ...prevForm,
                location: [{
                    lat: selectedLocation.latitude,
                    long: selectedLocation.longitude,
                    adress: selectedAddress || '' // Jika selectedAddress null, gunakan string kosong
                }]
            }));
        }
    }, [selectedLocation, selectedAddress]);


    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses kamera diperlukan!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            if (images.length + result.assets.length <= 4) {
                setImages(prev => [...prev, ...result.assets]);
            } else {
                Alert.alert('Maksimal Gambar', 'Anda hanya dapat mengunggah maksimal 4 gambar.');
            }
        }
    };

    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses galeri diperlukan!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            // allowsMultipleSelection: true, // Aktifkan jika ingin multiple selection dan handle hasilnya
            quality: 1,
        });

        if (!result.canceled) {
            // Jika allowsMultipleSelection false (default atau Android), result.assets akan berisi satu item
            // Jika true (iOS), bisa banyak item
            const newAssets = result.assets;
            if (images.length + newAssets.length <= 4) {
                setImages(prev => [...prev, ...newAssets]);
            } else {
                Alert.alert('Maksimal Gambar', `Anda hanya dapat menambahkan ${4 - images.length} gambar lagi.`);
                // Tambahkan hanya gambar yang muat
                const remainingSlots = 4 - images.length;
                if (remainingSlots > 0) {
                    setImages(prev => [...prev, ...newAssets.slice(0, remainingSlots)]);
                }
            }
        }
    };

    const pickImage = async (index: number) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses galeri diperlukan!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const newImage = result.assets[0];
            setImages(prev => {
                const updated = [...prev];
                updated[index] = newImage;
                return updated;
            });
        }
    };

    const deleteImage = (index: number) => {
        setImages(prev => {
            const updated = [...prev];
            updated.splice(index, 1);
            if (mainImageIndex === index && updated.length > 0) {
                setMainImageIndex(0);
            } else if (updated.length === 0) {
                setMainImageIndex(0); // Reset jika tidak ada gambar tersisa
            } else if (mainImageIndex >= updated.length) {
                setMainImageIndex(updated.length - 1); // Sesuaikan jika gambar utama yg dihapus di akhir
            }
            return updated;
        });
    };

    // Fungsi untuk menangani pemilihan kategori
    const handleCategorySelect = (categoryName: string) => {
        setActiveCategory(categoryName); // Untuk feedback UI
        setForm(prevForm => ({
            ...prevForm,
            category: categoryName
        }));
    };

    const predict = () => {
        // Validasi sederhana sebelum mengirim
        if (!form.desc.trim()) {
            Alert.alert('Input Kurang', 'Deskripsi laporan tidak boleh kosong.');
            return;
        }
        if (form.images.length === 0) {
            Alert.alert('Input Kurang', 'Mohon unggah minimal satu gambar sebagai bukti.');
            return;
        }
        if (!selectedLocation) {
            Alert.alert('Input Kurang', 'Mohon pilih lokasi laporan di peta.');
            return;
        }
        if (!form.category) {
            Alert.alert('Input Kurang', 'Mohon pilih kategori laporan.');
            return;
        }

        console.log("Mengirim Laporan dengan data form:", form);
        PostPredict(form, (result: any) => {
            console.log("Hasil Pengiriman:", result);
            if (result.success) {
                Alert.alert("Sukses", "Laporan berhasil dikirim!");
                // Reset form setelah berhasil
                setForm({
                    desc: '',
                    images: [],
                    location: [{ lat: 0, long: 0, adress: '' }],
                    category: ''
                });
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
    };


    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Izin Lokasi', 'Aplikasi membutuhkan izin lokasi untuk menampilkan alamat');
            }
        })();
    }, []);


    const handleMapPress = async (event: any) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedLocation({ latitude, longitude });
        setSuggestions([]);
        setSearchQuery('');

        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
                {
                    headers: {
                        'User-Agent': 'ReactNativeApp/1.0'
                    }
                }
            );
            const data = await response.json();
            setSelectedAddress(data.display_name || 'Alamat tidak ditemukan');
        } catch (error) {
            console.error('Gagal reverse geocode:', error);
            setSelectedAddress('Gagal mendapatkan alamat');
        }
    };


    const handleSuggestionPress = (item: any) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        setSelectedLocation({
            latitude: lat,
            longitude: lon
        });

        setSearchQuery(item.display_name);
        setSelectedAddress(item.display_name);
        setSuggestions([]);
        setFullScreen(false); // Tutup modal setelah memilih sugesti
    };


    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=6&countrycodes=ID`; // Tambahkan countrycodes=ID untuk Indonesia

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'ReactNativeApp/1.0'
                    }
                });

                const data = await response.json();
                setSuggestions(data);
            } catch (error) {
                console.error('Gagal fetch lokasi:', error);
            }
        };

        const delayDebounce = setTimeout(fetchSuggestions, 500); // debounce 500ms
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);
    const imagesCaraosel = [
        require('../../assets/images/demo.png'),
        require('../../assets/images/study1.png'),
        require('../../assets/images/demo.png'),
    ];

    const pages = [
        { label: 'REGULER', value: 'regular' },
        { label: 'PRIORITAS', value: 'prioritas' },
        { label: 'BUAT LAPORAN', value: 'laporan' },
    ];
    const renderContent = () => {
        switch (activePage) {
            case 'regular':
                return (
                    <View>
                        <CaraoselCard imageCaraosel={imagesCaraosel} typeReport='REGULAR' />
                    </View>)
            case 'prioritas':
                return (
                    <View>
                        <CaraoselCard imageCaraosel={imagesCaraosel} typeReport='PRIORITAS' />
                    </View>)
            case 'laporan':
                return (
                    <View>
                        <View
                            className={`w-full h-40 rounded-lg justify-center items-center ${images[mainImageIndex] ? '' : 'border-2 border-dotted border-gray-400'
                                }`}
                        >
                            {images.length > 0 && images[mainImageIndex] ? (
                                <Image
                                    source={{ uri: images[mainImageIndex].uri }}
                                    className="w-full h-full rounded-lg"
                                    resizeMode="cover"
                                />
                            ) : (
                                <AntDesign name="pluscircleo" size={30} color="gray" />
                            )}
                        </View>

                        <View className="flex-row flex-wrap justify-start -mx-1 mt-2">
                            {[0, 1, 2, 3].map(index => (
                                <View key={index} className="basis-1/4 px-1 mb-2">
                                    <TouchableOpacity
                                        className="relative"
                                        onPress={() => {
                                            if (images[index]) {
                                                setMainImageIndex(index);
                                            } else {
                                                // Jika slot kosong dan belum mencapai batas maksimal, buka galeri/kamera
                                                if (images.length < 4) {
                                                    Alert.alert(
                                                        "Pilih Sumber Gambar",
                                                        "Ambil gambar dari kamera atau galeri?",
                                                        [
                                                            { text: "Kamera", onPress: openCamera },
                                                            { text: "Galeri", onPress: openGallery },
                                                            { text: "Batal", style: "cancel" }
                                                        ]
                                                    );
                                                } else {
                                                    Alert.alert("Penuh", "Anda sudah mengunggah 4 gambar.")
                                                }
                                            }
                                        }}
                                        onLongPress={() => {
                                            if (images[index]) deleteImage(index);
                                        }}
                                    >
                                        <View
                                            className={`aspect-square rounded-lg justify-center items-center overflow-hidden ${images[index] ? '' : 'border-2 border-dotted border-gray-300'
                                                }`}
                                        >
                                            {images[index] ? (
                                                <Image
                                                    source={{ uri: images[index].uri }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <AntDesign name="plus" size={24} color="gray" />
                                            )}
                                        </View>
                                        {images[index] && (
                                            <TouchableOpacity
                                                style={{ position: 'absolute', top: -5, right: -5, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 10, padding: 2 }}
                                                onPress={() => deleteImage(index)}
                                            >
                                                <AntDesign name="closecircle" size={18} color="white" />
                                            </TouchableOpacity>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {images.length > 0 && (
                            <Text className='text-xs italic text-gray-600 mt-1'>
                                * Tekan thumbnail untuk mengganti gambar utama.
                            </Text>
                        )}
                        {images.length > 0 && (
                            <Text className='text-xs italic text-red-600'>
                                * Tekan lama thumbnail untuk menghapus gambar.
                            </Text>
                        )}
                        {images.length >= 4 && (
                            <Text className="text-xs italic text-red-700 mt-1">
                                * Bukti laporan maksimal 4 gambar.
                            </Text>
                        )}

                        <View className="flex-row justify-between mt-3">
                            <View className="w-[48%]">
                                <ButtonPrimary text="Buka Kamera" className="p-2 rounded-lg border-2 border-primaryNavy" onPress={openCamera} />
                            </View>
                            <View className="w-[48%]">
                                <ButtonSecondary text="Buka Galeri" className="p-2 rounded-lg" onPress={openGallery} />
                            </View>
                        </View>

                        {/* Input Deskripsi */}
                        <View className="mt-4">
                            <Text className="text-base font-semibold mb-1 text-gray-700">Deskripsi Laporan</Text>
                            <TextInput
                                className="border-2 border-gray-300 rounded-lg p-3"
                                placeholder="Masukkan deskripsi laporan..."
                                multiline
                                numberOfLines={6}
                                value={form.desc} // Hubungkan ke form.desc
                                onChangeText={(text) => setForm(prevForm => ({ ...prevForm, desc: text }))} // Update form.desc
                                style={{
                                    textAlignVertical: 'top',
                                    height: 120, // Sesuaikan tinggi jika perlu
                                }}
                            />
                        </View>

                        {/* Tampilan Peta Kecil */}
                        <View className="mt-4">
                            <Text className="text-base font-semibold mb-1 text-gray-700">Lokasi Laporan</Text>
                            <View className="h-40 w-full rounded-xl overflow-hidden relative border-2 border-gray-300">
                                <MapView
                                    style={{ flex: 1 }}
                                    region={
                                        selectedLocation
                                            ? {
                                                ...selectedLocation,
                                                latitudeDelta: 0.005, // Zoom lebih dekat
                                                longitudeDelta: 0.005,
                                            }
                                            : { // Lokasi default (misal: tengah Indonesia atau kota Anda)
                                                latitude: -2.548926,
                                                longitude: 118.014863,
                                                latitudeDelta: 20, // Zoom out untuk melihat Indonesia
                                                longitudeDelta: 20,
                                            }
                                    }
                                    onPress={handleMapPress}
                                >
                                    {selectedLocation && (
                                        <Marker
                                            coordinate={selectedLocation}
                                            title="Lokasi laporan"
                                        />
                                    )}
                                </MapView>
                                <TouchableOpacity
                                    className="absolute bottom-2 right-2 bg-primaryNavy bg-opacity-80 px-3 py-1.5 rounded-md shadow-md"
                                    onPress={() => setFullScreen(true)}
                                >
                                    <Text className="text-white text-sm font-medium">Pilih di Peta Besar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {selectedLocation && (
                            <Text className="mt-2 text-sm text-gray-600">
                                Koordinat: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                            </Text>
                        )}
                        {selectedAddress && (
                            <Text className="mt-1 text-sm text-gray-600">Alamat: {selectedAddress}</Text>
                        )}

                        {/* Modal Peta Fullscreen */}
                        <Modal visible={fullScreen} animationType="slide" onRequestClose={() => setFullScreen(false)}>
                            <View className="flex-1">
                                <View className="absolute top-4 left-4 right-4 z-10 bg-white p-2 rounded-xl shadow-lg">
                                    <TextInput
                                        placeholder="Cari nama jalan atau tempat..."
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        className="border border-gray-300 p-2.5 rounded-lg text-sm"
                                    />
                                    {suggestions.length > 0 && (
                                        <FlatList
                                            data={suggestions}
                                            keyExtractor={(item) => item.place_id.toString()}
                                            renderItem={({ item }) => (
                                                <Pressable onPress={() => handleSuggestionPress(item)} className="p-2.5 border-b border-gray-200">
                                                    <Text className="text-sm text-gray-700">{item.display_name}</Text>
                                                </Pressable>
                                            )}
                                            style={{ maxHeight: 200 }} // Batasi tinggi daftar saran
                                        />
                                    )}
                                </View>

                                <MapView
                                    style={{ flex: 1 }}
                                    initialRegion={{ // Bisa diset ke lokasi pengguna saat ini jika diinginkan
                                        latitude: selectedLocation?.latitude || -6.914744, // Bandung default
                                        longitude: selectedLocation?.longitude || 107.60981,
                                        latitudeDelta: 0.0922,
                                        longitudeDelta: 0.0421,
                                    }}
                                    region={
                                        selectedLocation
                                            ? {
                                                ...selectedLocation,
                                                latitudeDelta: 0.005,
                                                longitudeDelta: 0.005,
                                            }
                                            : undefined // Biarkan MapView menggunakan initialRegion jika belum ada selectedLocation
                                    }
                                    onPress={handleMapPress}
                                    showsUserLocation={true}
                                >
                                    {selectedLocation && (
                                        <Marker coordinate={selectedLocation} title="Lokasi laporan" />
                                    )}
                                </MapView>

                                <TouchableOpacity
                                    className="absolute bottom-6 right-4 bg-red-500 px-4 py-2 rounded-lg shadow-md"
                                    onPress={() => setFullScreen(false)}
                                >
                                    <Text className="text-white text-base font-medium">Tutup Peta</Text>
                                </TouchableOpacity>
                                {selectedLocation && (
                                    <TouchableOpacity
                                        className="absolute bottom-6 left-4 bg-green-500 px-4 py-2 rounded-lg shadow-md"
                                        onPress={() => {

                                            setFullScreen(false); // Cukup tutup saja, data sudah di selectedLocation & selectedAddress
                                        }}
                                    >
                                        <Text className="text-white text-base font-medium">Konfirmasi Lokasi Ini</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Modal>

                        {/* Pemilihan Kategori */}
                        <View className="mt-4">
                            <Text className="text-base font-semibold mb-2 text-gray-700">Kategori Laporan</Text>
                            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="-mx-1">
                                <View className="px-1">
                                    <Kat1 onPress={() => handleCategorySelect('Jalan Rusak')} />
                                </View>
                                <View className="px-1">
                                    <Kat2 onPress={() => handleCategorySelect('Jalan Rusak')} />
                                </View>
                                <View className="px-1">
                                    <Kat3 onPress={() => handleCategorySelect('Penerangan')} />
                                </View>
                                <View className="px-1">
                                    <Kat4 onPress={() => handleCategorySelect('Lainnya')} />
                                </View>
                                {/* Tambahkan kategori lain jika ada */}
                            </ScrollView>
                        </View>

                        <ButtonPrimary text="Kirim Laporan" className="p-3 mt-8 mb-6 rounded-lg bg-green-600" onPress={predict} />
                    </View>
                )
            default:
                return null;
        }
    };
    console.log(form);

    return (
        <LayoutPage padding='p-0'>
            {/* multipages */}
            <View className="bg-primaryNavy pb-14 pt-12 px-3 relative overflow-hidden">
                {/* Lapisan Lingkaran Dekoratif */}
                <View className="absolute z-0 w-[400px] h-[400px] rounded-full bg-white/10 left-1/2 -translate-x-1/2 top-10" />

                {/* Lingkaran besar di pojok kanan */}
                <View className="absolute z-0 w-[300px] h-[300px] rounded-full bg-white/10 -right-20 top-1/3" />

                {/* Konten Utama */}
                <View className="relative z-10">

                    {/* Tombol Tab */}
                    <View className="flex-row justify-between items-center mt-3 py-3 px-5 bg-primaryWhite rounded-full">
                        {pages.map((page: any) => (
                            <TouchableOpacity
                                key={page.value}
                                className={`py-2 px-4 rounded-full shadow-2xl ${activePage === page.value ? 'bg-primaryOrange' : ''
                                    }`}
                                onPress={() => setActivePage(page.value)}
                            >
                                <Text className={activePage === page.value ? 'text-white' : ''}>
                                    {page.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Search Bar */}
                    <View className="mt-7 flex-row items-center gap-2">
                        <View className="flex-1 border-2 border-gray-200 h-14 px-2 rounded-lg flex-row items-center gap-2">
                            <Feather name="search" size={24} color="white" />
                            <TextInput
                                className="flex-1 text-white"
                                placeholder="Cari Laporan..."
                                placeholderTextColor="#FFFFFF"
                            // value={searchText}
                            // onChangeText={setSearchText}
                            />
                        </View>

                        <View className="w-14 border-2 border-gray-200 h-14 justify-center items-center rounded-lg">
                            <Feather name="menu" size={24} color="white" />
                        </View>
                    </View>
                </View>
            </View>



            {/* Content */}
            <View className="bg-white rounded-t-3xl p-4 -mt-6">
                {renderContent()}
            </View>
        </LayoutPage>
    );
}

export default reportScreen;



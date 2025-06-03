import { PostPredict } from '@/api/model';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard';
import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Dimensions, FlatList, Image, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MapView, { Marker } from 'react-native-maps';
import Kat1 from '../../assets/images/kat1.svg';
import Kat2 from '../../assets/images/kat2.svg';
import Kat3 from '../../assets/images/kat3.svg';
import Kat4 from '../../assets/images/kat4.svg';
// Dummy data




const reportScreen = () => {
    const { width } = Dimensions.get('window');
    const [selectedLocation, setSelectedLocation] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [fullScreen, setFullScreen] = useState(false);
    const [images, setImages] = useState<any[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0); // default gambar utama index 0
    const [searchText, setSearchText] = useState('');
    const [activePage, setActivePage] = useState<'regular' | 'prioritas' | 'laporan'>('regular');
    console.log(images);


    const openCamera = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.granted === false) {
            alert('Permission to access camera is required!');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets]);
        }
    };

    const openGallery = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permission.granted === false) {
            alert('Permission to access gallery is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsMultipleSelection: false, // hanya berlaku di iOS, Android hanya bisa satu
            quality: 1,
        });

        if (!result.canceled) {
            setImages(prev => [...prev, ...result.assets]);
        }
    };

    const pickImage = async (index: number) => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Permission to access gallery is required!');
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
            // Sesuaikan index utama jika dihapus
            if (mainImageIndex === index) setMainImageIndex(0);
            return updated;
        });
    };

    const predict = () => {
        const inputText = "lampu taman sudah mulai ada yang rusak ";
        PostPredict(inputText, (result: any) => {
            console.log("Prediction result:", result);
        });
    };


    console.log(selectedLocation);

    const imagesCaraosel = [
        require('../../assets/images/demo.png'),
        require('../../assets/images/study1.png'),
        require('../../assets/images/demo.png'),
    ];
    const [activeIndex, setActiveIndex] = useState(0);
    const [suggestions, setSuggestions] = useState<any[]>([]);


    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Aplikasi membutuhkan izin lokasi untuk menampilkan alamat');
            }
        })();
    }, []);

    const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Fungsi saat user klik di peta
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
            setSelectedAddress(data.display_name);
        } catch (error) {
            console.error('Gagal reverse geocode:', error);
            setSelectedAddress(null);
        }
    };


    const handleSuggestionPress = (item: any) => {
        setSelectedLocation({
            latitude: parseFloat(item.lat),
            longitude: parseFloat(item.lon)
        });

        setSearchQuery(item.display_name);
        setSelectedAddress(item.display_name); // ✅ Tambahkan ini
        setSuggestions([]);
    };


    useEffect(() => {
        const fetchSuggestions = async () => {
            if (searchQuery.length < 3) {
                setSuggestions([]);
                return;
            }

            try {
                const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=6`;

                const response = await fetch(url, {
                    headers: {
                        'User-Agent': 'ReactNativeApp/1.0' // penting untuk Nominatim
                    }
                });

                const data = await response.json();

                setSuggestions(data);
                console.log('berhasil', data);

            } catch (error) {
                console.error('Gagal fetch lokasi:', error);
            }
        };

        const delayDebounce = setTimeout(fetchSuggestions, 200); // debounce
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    console.log(selectedAddress);
    console.log(suggestions);
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
                    <View >

                        <View
                            className={`w-full h-40 rounded-lg  justify-center items-center  ${images[mainImageIndex] ? '' : 'border-2 border-dotted'
                                }`}
                        >
                            {images[mainImageIndex] ? (
                                <Image
                                    source={{ uri: images[mainImageIndex].uri }}
                                    className="w-full h-full rounded-lg"
                                    resizeMode="cover"
                                />
                            ) : (
                                <AntDesign name="plus" size={24} color="black" />
                            )}
                        </View>



                        <View className="flex-row flex-wrap justify-start -mx-1 mt-2">
                            {[0, 1, 2, 3].map(index => (
                                <View key={index} className="basis-1/4 px-1 mb-2">
                                    <TouchableOpacity
                                        className="relative"
                                        onPress={() =>
                                            images[index]
                                                ? setMainImageIndex(index)
                                                : pickImage(index)
                                        }
                                        onLongPress={() => deleteImage(index)}
                                    >
                                        <View
                                            className={`aspect-square rounded-lg justify-center items-center overflow-hidden ${images[index] ? '' : 'border-2 border-dotted'
                                                }`}
                                        >
                                            {images[index] ? (
                                                <Image
                                                    source={{ uri: images[index].uri }}
                                                    className="w-full h-full"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <AntDesign name="plus" size={24} color="black" />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>

                        {images.length > 0 && (
                            <Text className='text-sm italic text-red-700'>
                                * Tekan gambar bila anda ingin mengganti gambar utama
                            </Text>
                        )}

                        {images.length > 4 && (
                            <Text className="text-sm italic text-red-700">
                                * Bukti laporan maksimal 4
                            </Text>
                        )}



                        <View className="flex-row flex-wrap justify-between -mx-1">
                            <View className="w-1/2 px-1">
                                <ButtonPrimary text="Buka Kamera" className=" p-2 mt-2 rounded-lg border-2 border-primaryNavy" onPress={openCamera} />
                            </View>
                            <View className="w-1/2 px-1">
                                <ButtonSecondary text="Buka Galeri" className=" p-2 mt-2 rounded-lg" onPress={openGallery} />
                            </View>
                        </View>


                        <View>
                            <TextInput
                                className="border-2 border-black rounded-lg p-3 mt-3"
                                placeholder="Masukkan deskripsi laporan..."
                                multiline
                                numberOfLines={6} // Mengatur tinggi area input dengan 6 baris
                                style={{
                                    textAlignVertical: 'top', // Menjaga teks tetap di atas pada multiline
                                    height: 150, // Menentukan tinggi area input
                                }}
                            />
                        </View>


                        {/* Tampilan Map Kecil */}
                        <View className="h-40 w-full rounded-xl overflow-hidden relative mt-4">
                            <MapView
                                style={{ flex: 1 }}
                                region={
                                    selectedLocation
                                        ? {
                                            ...selectedLocation,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }
                                        : {
                                            latitude: -6.914744,
                                            longitude: 107.60981,
                                            latitudeDelta: 0.01,
                                            longitudeDelta: 0.01,
                                        }
                                }
                                onPress={handleMapPress}
                            >
                                {selectedLocation && (
                                    <Marker
                                        coordinate={selectedLocation}
                                        title="Lokasi dipilih"
                                        description={`Lat: ${selectedLocation.latitude}, Lng: ${selectedLocation.longitude}`}
                                    />
                                )}
                            </MapView>
                            <TouchableOpacity
                                className="absolute bottom-2 right-2 bg-primaryNavy bg-opacity-60 px-3 py-1 rounded-md"
                                onPress={() => setFullScreen(true)}
                            >
                                <Text className="text-white text-sm">Zoom</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Koordinat */}
                        {selectedLocation && (
                            <Text className="mt-3 text-sm text-gray-700">
                                Koordinat: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                            </Text>
                        )}

                        {/* Alamat */}
                        {selectedAddress && (
                            <Text className="mt-1 text-sm text-gray-700">Alamat: {selectedAddress}</Text>
                        )}

                        {/* Modal fullscreen */}
                        <Modal visible={fullScreen} animationType="slide">
                            <View className="flex-1">
                                {/* 🔍 Input Pencarian */}
                                <View className="absolute top-10 left-4 right-4 z-10 bg-white p-2 rounded-xl">
                                    <TextInput
                                        placeholder="Cari lokasi..."
                                        value={searchQuery}
                                        onChangeText={setSearchQuery}
                                        className=" p-2 rounded"
                                    />
                                    {suggestions.length > 0 && (
                                        <FlatList
                                            data={suggestions}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => (
                                                <Pressable onPress={() => handleSuggestionPress(item)} className="p-2 border-b border-gray-200">
                                                    <Text className="text-sm text-gray-700">{item.display_name}</Text>
                                                </Pressable>
                                            )}
                                        />
                                    )}
                                </View>

                                {/* MapView */}
                                <MapView
                                    style={{ flex: 1 }}
                                    region={{
                                        latitude: selectedLocation?.latitude || -6.914744,
                                        longitude: selectedLocation?.longitude || 107.60981,
                                        latitudeDelta: 0.01,
                                        longitudeDelta: 0.01,
                                    }}
                                    onPress={handleMapPress}
                                >
                                    {selectedLocation && (
                                        <Marker coordinate={selectedLocation} title="Lokasi dipilih" />
                                    )}
                                </MapView>

                                {/* ❌ Tombol tutup */}
                                <TouchableOpacity
                                    className="absolute bottom-10 right-4 bg-primaryNavy bg-opacity-70 px-3 py-1 rounded-lg"
                                    onPress={() => setFullScreen(false)}
                                >
                                    <Text className="text-white text-base">Tutup</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>

                        <ScrollView className='mt-5 overflow-x-hidden ' showsHorizontalScrollIndicator={false} horizontal={true} >
                            <View className='mr-5'>
                                <Kat1 />
                            </View>

                            <View className='mr-5'>
                                <Kat2 />
                            </View>

                            <View className='mr-5'>
                                <Kat3 />
                            </View>

                            <View className='mr-5'>
                                <Kat4 />
                            </View>
                            <View className='mr-5'>
                                <Kat4 />
                            </View>
                            <View className='mr-5'>
                                <Kat4 />
                            </View>
                            <View className='mr-5'>
                                <Kat4 />
                            </View>
                        </ScrollView>

                        <ButtonPrimary text="Kirim Laporan" className=" p-3 mt-4 rounded-lg" onPress={predict} />

                    </View>
                )
            default:
                return null;
        }
    };

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
                                value={searchText}
                                onChangeText={setSearchText}
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



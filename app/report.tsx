import { PostPredict } from '@/api/model';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { AntDesign, Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Dummy data
const dummyData = [
    { id: '1', name: 'Baju Katun' },
    { id: '2', name: 'Celana Jeans' },
    { id: '3', name: 'Sepatu Sneakers' },
    { id: '4', name: 'Jaket Hoodie' },
    { id: '5', name: 'Kaos Polos' },
];



const reportScreen = () => {
    const [images, setImages] = useState<any[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0); // default gambar utama index 0
    const [searchText, setSearchText] = useState('');
    const [activePage, setActivePage] = useState<'regular' | 'prioritas' | 'laporan'>('regular');


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


    const renderContent = () => {
        switch (activePage) {
            case 'regular':
                return <Text className="p-4">Ini halaman Regular</Text>;
            case 'prioritas':
                return <Text className="p-4">Ini halaman Prioritas</Text>;
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
                                <ButtonPrimary text="Buka Kamera" className=" p-2 mt-2 rounded-lg" onPress={openCamera} />
                            </View>
                            <View className="w-1/2 px-1">
                                <ButtonSecondary text="Buka Galeri" className=" p-2 mt-2 rounded-lg" onPress={openGallery} />
                            </View>
                        </View>


                        <View>
                            <TextInput
                                className="border-2 border-black rounded-lg p-3 mt-3"
                                placeholder="Judul laporan..."
                                value={searchText}
                                onChangeText={setSearchText}
                                multiline
                                numberOfLines={4} // Mengatur jumlah baris awal
                            />
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
                            <ButtonPrimary text="Cek Prioritas" className=" p-2 mt-2 rounded-lg" onPress={predict} />
                        </View>


                    </View>
                )
            default:
                return null;
        }
    };

    return (
        <LayoutPage padding='p-0'>
            {/* multipages */}
            <View className="bg-primary pb-14 px-3">

                {/* Tab Navigation */}
                <View className="flex-row justify-between items-center mt-3 py-3 px-5 bg-[#EBEEF0]  rounded-lg ">
                    <TouchableOpacity
                        className={`py-2 px-4 rounded-lg shadow-2xl ${activePage === 'regular' ? 'bg-white' : ''}`}
                        onPress={() => setActivePage('regular')}
                    >
                        <Text>REGULER</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-2 px-4 rounded-lg shadow-2xl ${activePage === 'prioritas' ? 'bg-white' : ''}`}
                        onPress={() => setActivePage('prioritas')}
                    >
                        <Text>PRIORITAS</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-2 px-4 rounded-lg shadow-2xl ${activePage === 'laporan' ? 'bg-white' : ''}`}
                        onPress={() => setActivePage('laporan')}
                    >
                        <Text>BUAT LAPORAN</Text>
                    </TouchableOpacity>
                </View>
                {/* search */}
                <View className="mt-7 flex-row items-center gap-2">
                    <View className="flex-1 border-2 border-white h-14 px-2 rounded-lg flex-row items-center gap-2">
                        <Feather name="search" size={24} color="white" />
                        <TextInput
                            className="flex-1 text-white"
                            placeholder="Cari apa saja..."
                            placeholderTextColor="#FFFFFF"
                            value={searchText}
                            onChangeText={setSearchText}
                        />
                    </View>

                    <View className="w-14 border-2 border-white h-14 justify-center items-center rounded-lg">
                        <Feather name="menu" size={24} color="white" />
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

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    buttonGroup: {
        gap: 10,
        marginBottom: 16,
    },
    imageScroll: {
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        borderRadius: 8,
    },
});

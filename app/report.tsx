import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

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

    const renderContent = () => {
        switch (activePage) {
            case 'regular':
                return <Text className="p-4">Ini halaman Regular</Text>;
            case 'prioritas':
                return <Text className="p-4">Ini halaman Prioritas</Text>;
            case 'laporan':
                return <View style={styles.container}>
                    <Text style={styles.title}>Building</Text>

                    <View style={styles.buttonGroup}>
                        <Button title="Ambil Foto dari Kamera" onPress={openCamera} />
                        <Button title="Pilih dari Galeri" onPress={openGallery} />
                    </View>

                    <ScrollView horizontal style={styles.imageScroll}>
                        {images.map((img, index) => (
                            <Image
                                key={index}
                                source={{ uri: img.uri }}
                                style={styles.image}
                            />
                        ))}
                    </ScrollView>
                </View>
            default:
                return null;
        }
    };

    return (
        <LayoutPage>
            {/* multipages */}
            <View className="flex-1  bg-[#EBEEF0] rounded-lg">
                {/* Tab Navigation */}
                <View className="flex-row justify-between items-center py-3 px-5  rounded-lg ">
                    <TouchableOpacity
                        className={`py-2 px-4 rounded-lg shadow-2xl ${activePage === 'regular' ? 'bg-white' : ''}`}
                        onPress={() => setActivePage('regular')}
                    >
                        <Text>Regular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-2 px-4 rounded-lg shadow-2xl ${activePage === 'prioritas' ? 'bg-white' : ''}`}
                        onPress={() => setActivePage('prioritas')}
                    >
                        <Text>Prioritas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`py-2 px-4 rounded-lg shadow-2xl ${activePage === 'laporan' ? 'bg-white' : ''}`}
                        onPress={() => setActivePage('laporan')}
                    >
                        <Text>Buat laporan</Text>
                    </TouchableOpacity>
                </View>


            </View>

            <View className="mt-5 flex-row items-center gap-2">
                <View className="flex-1 border-2 border-gray-300 h-14 px-2 rounded-lg flex-row items-center gap-2">
                    <Feather name="search" size={24} color="gray" />
                    <TextInput
                        className="flex-1 text-gray-800"
                        placeholder="Cari apa saja..."
                        value={searchText}
                        onChangeText={setSearchText}
                    />
                </View>

                <View className="w-14 border-2 border-gray-300 h-14 justify-center items-center rounded-lg">
                    <Feather name="menu" size={24} color="black" />
                </View>
            </View>

            {/* Content */}
            <View className="bg-white rounded-lg">
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

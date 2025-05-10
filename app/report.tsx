import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

// Dummy data
const dummyData = [
    { id: '1', name: 'Baju Katun' },
    { id: '2', name: 'Celana Jeans' },
    { id: '3', name: 'Sepatu Sneakers' },
    { id: '4', name: 'Jaket Hoodie' },
    { id: '5', name: 'Kaos Polos' },
];



const reportScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [activePage, setActivePage] = useState<'regular' | 'prioritas' | 'laporan'>('regular');

    const renderContent = () => {
        switch (activePage) {
            case 'regular':
                return <Text className="p-4">Ini halaman Regular</Text>;
            case 'prioritas':
                return <Text className="p-4">Ini halaman Prioritas</Text>;
            case 'laporan':
                return <Text className="p-4">Ini halaman Buat Laporan</Text>;
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

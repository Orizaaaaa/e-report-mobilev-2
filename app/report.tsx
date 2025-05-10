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
    const navigationScreen = (value: string) => {
        if (value === 'priority') {
            return 'priorityScreen'
        } else {
            return 'regularScreen'
        }
    }

    const [searchText, setSearchText] = useState('');
    const filteredData = dummyData.filter(item =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
    );


    return (
        <LayoutPage>
            <View className='w-full bg-[#EBEEF0]  rounded-lg'>
                <View className='flex-row justify-between items-center py-2 px-5'>
                    <TouchableOpacity className='bg-white py-2 px-4 rounded-lg shadow-2xl'>
                        <Text>Regular</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text>Prioritas</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
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


        </LayoutPage>
    )
}

export default reportScreen
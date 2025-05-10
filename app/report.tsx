import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage'
import { Feather } from '@expo/vector-icons'
import { Text, TouchableOpacity, View } from 'react-native'


const reportScreen = () => {
    const navigationScreen = (value: string) => {
        if (value === 'priority') {
            return 'priorityScreen'
        } else {
            return 'regularScreen'
        }
    }
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

            <View className="mt-5 flex flex-row items-center  gap-2">
                <View className="flex-1 border-2 border-gray-300 h-14 justify-center px-2 rounded-lg">
                    <View className="flex-row items-center gap-2">
                        <Feather name="search" size={24} color="gray" />
                        <Text className="text-gray-400" >Cari apa saja...</Text>
                    </View>
                </View>
                <View className="w-24 border-2 border-gray-300 h-14 justify-center items-center rounded-lg">
                    <Feather name="menu" size={24} color="black" />
                </View>
            </View>
        </LayoutPage>
    )
}

export default reportScreen
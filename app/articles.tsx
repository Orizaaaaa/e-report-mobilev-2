import CardReportScroll from '@/components/fragments/CardReport/CardReportScroll'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TextInput, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

type Props = {}

const articles = (props: Props) => {
    const router = useRouter()
    return (
        <View className='pt-14 px-2' >
            <View className='flex-row items-center justify-between bg-white p-3 rounded-full' >
                <Ionicons name="chevron-back" size={24} color="black" onPress={() => { router.back() }} />
                <Text className='text-xl font-medium' >Articles</Text>
                <Ionicons name="filter" size={24} color="black" />
            </View>

            <View className="mt-3 py-2">
                <View className="flex-row items-center  rounded-xl px-3 py-2 bg-white">
                    <Ionicons name="search" size={20} color="gray" />
                    <TextInput
                        className="flex-1 pl-2 py-2"
                        placeholder="Cari sesuatu..."
                        placeholderTextColor="gray"
                    />
                </View>
            </View>
            <ScrollView className='px-2'>
                <CardReportScroll image={require('../assets/images/demo.png')} />
            </ScrollView>
        </View>
    )
}

export default articles
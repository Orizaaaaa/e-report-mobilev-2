import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import DetailReport from '@/components/fragments/DetailReport/DetailReport'
import { MaterialIcons, Octicons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'

type Props = {}

const ReportDetailAdmin = (props: Props) => {
    const imagesCaraosel = [
        require('../../../assets/images/demo.png'),
        require('../../../assets/images/study1.png'),
        require('../../../assets/images/demo.png'),
    ];
    return (
        <ScrollView className='pt-16 px-3'>
            <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full">
                <ButtonBack colorIcon="#FF840C" />
                <Octicons name="report" size={20} color="gray" />
            </View>
            <DetailReport imageCaraosel={imagesCaraosel} />

            <View className='flex-row mt-5' >
                <TouchableOpacity className='flex-row items-center gap-2 mt-4 bg-primaryNavy py-2 px-4 rounded-full ' >
                    <MaterialIcons name="pending-actions" size={20} color="white" />
                    <Text className='text-white' >Tindak</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default ReportDetailAdmin
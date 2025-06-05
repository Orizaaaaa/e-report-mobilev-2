import { ReportDescriptionInputProps } from '@/utils/helper'
import React from 'react'
import { Text, TextInput, View } from 'react-native'

type Props = {}

const DescriptionInput: React.FC<ReportDescriptionInputProps> = ({ value, onChangeText }) => {
    return (
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
    )
}

export default DescriptionInput
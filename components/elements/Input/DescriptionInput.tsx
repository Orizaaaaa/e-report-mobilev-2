import { ReportDescriptionInputProps } from '@/utils/helper'
import React from 'react'
import { Text, TextInput, View } from 'react-native'

type Props = {}

const DescriptionInput: React.FC<ReportDescriptionInputProps> = ({ value, onChangeText, title, placeholderText }) => {
    return (
        <View className="mt-7">
            <Text className="text-gray-500 mb-2">{title}</Text>
            <TextInput
                className="border-2 border-gray-300 rounded-lg p-3" // className dari user
                placeholder={placeholderText}
                placeholderTextColor={'gray'}
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
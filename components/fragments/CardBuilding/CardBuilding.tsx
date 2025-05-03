import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
    title: string
    desc: string
    location: any

}

const CardBuilding = ({ title, desc, location }: Props) => {
    return (
        <View className="w-1/2 px-1 mb-2">
            <View className="bg-slate-300 flex-1 p-3 rounded-lg">
                <View className="bg-white rounded-lg h-20 mb-3">
                </View>
                <Text className="font-medium">{title}</Text>
                <Text className="text-sm text-gray-600">{desc}</Text>
                <TouchableOpacity className="bg-primary p-2 mt-2 rounded-lg">
                    <Text onPress={() => { location() }} className="text-sm text-center text-white">Selengkap nya</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default CardBuilding
import { formatTanggalIndonesia, truncateText } from '@/utils/helper'
import React from 'react'
import { Image, Text, View } from 'react-native'

type Props = {
    imageUrl: string
    description: string
    date: string
    user: string
}

const NotifReportCard = ({ imageUrl, description, date, user }: Props) => {
    return (
        <View>
            <View className="flex-row gap-3 mb-5">
                <View className="w-16 h-16 rounded-xl">
                    <Image
                        className="w-full h-full rounded-full"
                        source={{ uri: imageUrl }}
                        resizeMode="cover"
                    />
                </View>
                <View className="flex-1 mt-1">
                    <Text className="text-sm text-wrap">{user}</Text>
                    <Text className="text-xs text-wrap">
                        {truncateText(description, 95)}
                    </Text>
                    <Text className="text-xs text-slate-400">{formatTanggalIndonesia(date)}</Text>
                </View>
            </View>
        </View>
    )
}

export default NotifReportCard
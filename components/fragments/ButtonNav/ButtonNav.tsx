import { Ionicons } from '@expo/vector-icons'
import { useRoute } from '@react-navigation/native'
import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

type Props = {
    onPress: () => void
    title: string
    icon: any
}

const ButtonNav = ({ onPress, title, icon }: Props) => {
    const route = useRoute()

    // cek apakah nama route mengandung "bya"
    const isActive = route.name.toLowerCase().includes(title.toLowerCase())

    return (
        <TouchableOpacity
            className={`flex-row items-center py-3 px-3 rounded-xl ${isActive ? 'bg-[#2AA8E1]' : ''
                }`}
            onPress={onPress}
        >
            <Ionicons name={icon} size={22} color={`${isActive ? 'white' : 'black'}`} />
            <Text className={`ml-3 text-base  ${isActive ? 'text-white' : 'text-black'}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default ButtonNav

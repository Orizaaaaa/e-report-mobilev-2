import { Ionicons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { TouchableOpacity } from 'react-native'


type Props = {
    className?: string
    colorIcon?: string
    bgColor?: string
}
const ButtonBack = ({ className, colorIcon = 'black', bgColor = 'bg-light' }: Props) => {
    const navigate: any = useNavigation()
    console.log('canGoBack:', navigate.canGoBack())

    return (
        <TouchableOpacity onPress={() => navigate.goBack()} className={` rounded-full ${bgColor} flex justify-center items-center ${className}`} >
            <Ionicons name="chevron-back-outline" size={28} color={colorIcon} />
        </TouchableOpacity>
    )
}

export default ButtonBack
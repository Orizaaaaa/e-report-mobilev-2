import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

type Props = {
    className: string
    text: string
    onPress: () => void
}

const ButtonPrimary = ({ className, text, onPress }: Props) => {
    return (
        <TouchableOpacity className={` bg-primaryNavy  ${className}`} onPress={onPress} >
            <Text className='text-white text-center text-sm' >{text}</Text>
        </TouchableOpacity>
    )
}

export default ButtonPrimary
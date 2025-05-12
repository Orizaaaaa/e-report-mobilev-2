import React from 'react'
import { Text, TouchableOpacity } from 'react-native'

type Props = {
    className: string
    text: string
    onPress: () => void
}

const ButtonSecondary = ({ className, text, onPress }: Props) => {
    return (
        <TouchableOpacity className={` border-2 border-primary ${className}`} onPress={onPress} >
            <Text className='text-primary text-center' >{text}</Text>
        </TouchableOpacity>
    )
}

export default ButtonSecondary
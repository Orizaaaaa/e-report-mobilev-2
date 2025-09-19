import { Entypo, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
    value: string
    placeholder?: string
    onChangeText: (text: string) => void
    isPass?: boolean
    border?: string;
    keyboardType?: any
    maxLength?: number
}

const AuthInput = ({ value, placeholder, onChangeText, isPass, border = 'border-gray-200', keyboardType, maxLength }: Props) => {
    const [showPass, setShowPass] = useState(true)
    const icons = (placeholder: any) => {
        if (placeholder === 'Email') {
            return 'email';
        } else if (placeholder === 'Password') {
            return 'lock';
        } else if (placeholder === 'Nama Lengkap') {
            return 'person';
        } else if (placeholder === 'NIK (Nomor Induk Kependudukan)') {
            return 'badge';
        } else if (placeholder === 'Nomor Telepon') {
            return 'phone';
        } else if (placeholder === 'Lokasi') {
            return 'location-on';
        } else if (placeholder === 'Nama') {
            return 'person';
        } else {
            return 'help-outline'; // fallback icon
        }

    }
    return (
        <View
            className={`border rounded-2xl px-4 py-2 flex-row items-center justify-between space-x-4 ${border}`}
        >
            <MaterialIcons name={icons(placeholder)} size={24} color="gray" />

            <TextInput
                className="flex-1 text-base text-black"
                placeholder={placeholder}
                placeholderTextColor="gray" // <-- Tambahan ini
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={isPass ? showPass : undefined}
                keyboardType={keyboardType}
                maxLength={maxLength}
                autoCapitalize="none"
            />

            {isPass && (
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                    <Entypo
                        name={showPass ? 'eye-with-line' : 'eye'}
                        size={24}
                        color="gray"
                    />
                </TouchableOpacity>
            )}
        </View>

    )
}

export default AuthInput
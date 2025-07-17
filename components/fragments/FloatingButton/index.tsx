import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

type Props = {
    onPress?: () => void;
    icon: React.ReactNode;
    label?: string;
    className?: string;
};

const Colors = {
    primaryNavy: '#205072',
    primaryWhite: 'white',
    primaryBlack: '#20BEC6',
};

const FloatingButton: React.FC<Props> = ({ onPress, icon, label, className }) => {
    return (
        <View className="absolute bottom-28 right-6 z-50 items-center">
            <TouchableOpacity
                onPress={onPress}
                className={`bg-green-500 w-16 h-16 rounded-full items-center justify-center shadow-lg ${className}`}
                activeOpacity={0.8}
            >
                {icon}
            </TouchableOpacity>
            <View className='flex-col items-center'>
                <Text style={{
                    color: Colors.primaryNavy,
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 4,
                }}>
                    Konsultasikan
                </Text>
                <Text style={{
                    color: Colors.primaryNavy,
                    fontSize: 12,
                    fontWeight: 'bold',
                }}>
                    Sekarang !
                </Text>
            </View>
        </View>
    );
};

export default FloatingButton;

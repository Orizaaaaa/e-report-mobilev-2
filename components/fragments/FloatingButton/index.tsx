
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

type Props = {
    onPress?: any;
    children: React.ReactNode;
    className?: string; // bisa override style dari luar jika perlu
};

const FloatingButton: React.FC<Props> = ({ onPress, children, className }) => {
    return (
        <View className="absolute bottom-32 right-6 z-50">
            <TouchableOpacity
                onPress={onPress}
                className={
                    `bg-white w-16 h-16 rounded-full items-center justify-center shadow-lg ${className}`
                }
                activeOpacity={0.8}
            >
                {children}
            </TouchableOpacity>
        </View>
    );
};

export default FloatingButton;


import React from 'react';
import { GestureResponderEvent, TouchableOpacity, View } from 'react-native';

type Props = {
    onPress?: (event: GestureResponderEvent) => void;
    children: React.ReactNode;
    className?: string; // bisa override style dari luar jika perlu
};

const FloatingButton: React.FC<Props> = ({ onPress, children, className }) => {
    return (
        <View className="absolute bottom-36 right-6 z-50">
            <TouchableOpacity
                onPress={onPress}
                className={
                    `bg-blue-600 w-16 h-16 rounded-full items-center justify-center shadow-lg ${className}`
                }
                activeOpacity={0.8}
            >
                {children}
            </TouchableOpacity>
        </View>
    );
};

export default FloatingButton;

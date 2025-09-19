import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    total: number | string;
    title: string;
    icon?: any
};


export default function Card({ total, title, icon }: Props) {
    return (
        <View
            className="w-[48%] bg-primaryNavy p-3 rounded-xl mb-4"
            style={styles.shadowStyle}
        >
            <View className="absolute -top-5 -left-5 w-32 h-32 bg-white/10 rounded-full" />
            <View className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full" />
            <View className="absolute top-10 right-5 w-16 h-16 bg-white/10 rounded-full" />

            {/* Konten Utama */}
            <View className="bg-white/30 rounded-xl self-start p-2 mb-2">
                {icon}
            </View>
            <Text className="text-3xl font-semibold text-white">{total}</Text>
            <Text className="text-sm text-white">{title}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    shadowStyle: {
        // iOS Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        // Android Shadow (elevation)
        elevation: 8,
    },
});

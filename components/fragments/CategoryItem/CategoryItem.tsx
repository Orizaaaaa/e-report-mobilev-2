// File: screens/report/components/CategoryItem.tsx
import { Category } from '@/utils/helper';
import { Image } from 'expo-image';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface CategoryItemProps {
    category: Category;
    isActive: boolean;
    onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onPress }) => (
    <View className="items-center px-2">
        <TouchableOpacity
            onPress={onPress}
            className={`
                w-20 h-20 rounded-full items-center justify-center
                border-2
                ${isActive ? 'border-primaryOrange bg-orange-50' : 'border-gray-300 bg-white'}
            `}
        >
            <Image
                source={{ uri: category.image }}
                style={{ width: 55, height: 55, resizeMode: 'contain' }}
                cachePolicy="disk" // penting agar dicache ke disk
            />
        </TouchableOpacity>

        {/* Tampilkan text hanya jika diklik */}
        {isActive && (
            <Text
                className="mt-2 text-xs text-center text-primaryOrange font-semibold"
                numberOfLines={2}
            >
                {category.name}
            </Text>
        )}
    </View>
);

export default CategoryItem;

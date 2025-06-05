// File: screens/report/components/CategoryItem.tsx
import { Category } from '@/utils/helper';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';


interface CategoryItemProps {
    category: Category;
    isActive: boolean;
    onPress: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ category, isActive, onPress }) => (
    <View className="px-1">
        <TouchableOpacity
            onPress={onPress}
            className={`p-3 border-2 rounded-lg items-center w-24 h-24 justify-center 
                        ${isActive ? 'border-primaryOrange bg-orange-50' : 'border-gray-300 bg-white'}`}
        >
            <category.Icon width={32} height={32} />
            <Text
                className={`mt-1 text-xs text-center ${isActive ? 'text-primaryOrange font-semibold' : 'text-gray-700'}`}
                numberOfLines={2}
            >
                {category.name}
            </Text>
        </TouchableOpacity>
    </View>
);

export default CategoryItem;
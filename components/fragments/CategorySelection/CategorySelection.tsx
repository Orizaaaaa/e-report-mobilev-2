// File: screens/report/components/CategorySelection.tsx
import { Category } from '@/utils/helper';
import React from 'react';
import { ScrollView as RNScrollView, Text, View } from 'react-native'; // Menggunakan RNScrollView dari react-native
import CategoryItem from '../CategoryItem/CategoryItem';


interface CategorySelectionProps {
    categories: Category[];
    activeCategoryValue: string | null;
    onSelectCategory: (categoryValue: string) => void;
}

const CategorySelection: React.FC<CategorySelectionProps> = ({ categories, activeCategoryValue, onSelectCategory }) => (
    <View className="mt-7">
        <Text className=" mb-2 text-gray-500">Kategori Laporan</Text>
        <RNScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
            {categories.map((cat) => (
                <CategoryItem
                    key={cat.id}
                    category={cat}
                    isActive={activeCategoryValue === cat.value}
                    onPress={() => onSelectCategory(cat.value)}
                />
            ))}
        </RNScrollView>
    </View>
);

export default CategorySelection;
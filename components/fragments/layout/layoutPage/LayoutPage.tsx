import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
const { height } = Dimensions.get('window');
type Props = {}

const LayoutPage = ({ children }: any) => {
    return (
        <ScrollView className='pt-4 px-2 bg-white' style={{ height: height }} >
            <View className="mb-32">
                {children}
            </View>
        </ScrollView>
    )
}

export default LayoutPage
import React from 'react';
import { Dimensions, ScrollView, View } from 'react-native';
const { height } = Dimensions.get('window');
type Props = {}

const LayoutPage = ({ children, padding = 'pt-4 px-2' }: any) => {
    return (
        <ScrollView keyboardShouldPersistTaps="handled" className={` ${padding} bg-white`} style={{ height: height }} >
            <View className="mb-32">
                {children}
            </View>
        </ScrollView>
    )
}

export default LayoutPage
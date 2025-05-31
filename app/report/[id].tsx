import { useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function ReportDetail() {
    const { id } = useLocalSearchParams();

    return (
        <>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Report Detail for ID: {id}</Text>
            </View>
        </>

    );
}
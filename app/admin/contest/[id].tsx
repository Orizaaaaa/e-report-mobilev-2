import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

type Props = {}

const DetailContestAdmin = (props: Props) => {
    const { id } = useLocalSearchParams();
    return (
        <View>
            <Text>DetailContestAdmin {id}</Text>
        </View>
    )
}

export default DetailContestAdmin
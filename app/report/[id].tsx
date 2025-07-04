import DetailReport from '@/components/fragments/DetailReport/DetailReport';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Linking, ScrollView } from 'react-native';

export default function ReportDetail() {
    const { width } = Dimensions.get('window');
    const { id } = useLocalSearchParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const imagesCaraosel = [
        require('../../assets/images/demo.png'),
        require('../../assets/images/study1.png'),
        require('../../assets/images/demo.png'),
    ];
    const selectedLocation = {
        latitude: -6.175392,
        longitude: 106.827153,
    };
    const openInGoogleMaps = () => {
        if (selectedLocation) {
            const { latitude, longitude } = selectedLocation;
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url).catch(err => console.error('Gagal membuka Google Maps:', err));
        } else {
            alert('Lokasi belum dipilih');
        }
    };

    return (
        <ScrollView className='pt-16 px-3'>
            {/* <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full">
                <ButtonBack colorIcon="#FF840C" />
                <Octicons name="report" size={20} color="gray" />
            </View> */}

            <DetailReport imageCaraosel={imagesCaraosel} />



        </ScrollView>
    );
}
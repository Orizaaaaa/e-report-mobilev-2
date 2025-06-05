// File: screens/report/components/LocationPicker.tsx
import type { SelectedLocationType } from '@/utils/helper'; // Pastikan path ini benar
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

interface LocationPickerProps {
    selectedLocation: SelectedLocationType | null;
    selectedAddress: string | null;
    onMapPress: (event: any) => void; // Ganti 'any' dengan tipe event MapView yang benar jika diketahui
    onOpenFullScreenMap: () => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
    selectedLocation,
    selectedAddress,
    onMapPress,
    onOpenFullScreenMap,
}) => {
    // Koordinat pusat perkiraan untuk Bandung dan delta untuk cakupan kota
    const bandungRegion: Region = {
        latitude: -6.917464, // Latitude Bandung
        longitude: 107.619123, // Longitude Bandung
        latitudeDelta: 0.15,  // Sesuaikan untuk cakupan area Bandung (lebih kecil = lebih zoom)
        longitudeDelta: 0.12, // Sesuaikan untuk cakupan area Bandung
    };

    // Jika ada lokasi yang dipilih, fokus ke sana dengan zoom lebih dekat.
    // Jika tidak, gunakan region default Bandung.
    const currentRegion: Region = selectedLocation
        ? { ...selectedLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 } // Zoom sangat dekat pada marker
        : bandungRegion; // Default ke area Bandung

    return (
        <View className="mt-4">
            <Text className="text-base font-semibold mb-1 text-gray-700">Lokasi Laporan</Text>
            <View className="h-40 w-full rounded-xl overflow-hidden relative border-2 border-gray-300">
                <MapView
                    style={{ flex: 1 }}
                    region={currentRegion} // Gunakan region yang sudah disesuaikan
                    initialRegion={bandungRegion} // Set initialRegion ke Bandung agar peta pertama kali muncul di Bandung
                    onPress={onMapPress}
                // Untuk membatasi scroll keluar dari area tertentu (opsional, perlu pengujian lebih lanjut):
                // camera={{
                //     center: { latitude: bandungRegion.latitude, longitude: bandungRegion.longitude },
                //     pitch: 0,
                //     heading: 0,
                //     altitude: 15000, // Sesuaikan ketinggian untuk cakupan zoom
                //     zoom: undefined // Bisa juga menggunakan zoom level jika altitude tidak diinginkan
                // }}
                // minZoomLevel={10} // Batas zoom out (opsional)
                // maxZoomLevel={18} // Batas zoom in (opsional)
                >
                    {selectedLocation && <Marker coordinate={selectedLocation} title="Lokasi laporan" />}
                </MapView>
                <TouchableOpacity
                    className="absolute bottom-2 right-2 bg-primaryNavy bg-opacity-80 px-3 py-1.5 rounded-md shadow-md"
                    onPress={onOpenFullScreenMap}
                >
                    <Text className="text-white text-sm font-medium">Pilih di Peta Besar</Text>
                </TouchableOpacity>
            </View>
            {selectedLocation && (
                <Text className="mt-2 text-sm text-gray-600">
                    Koordinat: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                </Text>
            )}
            {selectedAddress && (
                <Text className="mt-1 text-sm text-gray-600">Alamat: {selectedAddress}</Text>
            )}
        </View>
    );
};

export default LocationPicker;
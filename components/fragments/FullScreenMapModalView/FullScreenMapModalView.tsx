// File: screens/report/components/FullScreenMapModalView.tsx
import { NominatimSuggestion, SelectedLocationType } from '@/utils/helper';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Modal, Pressable, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';


interface FullScreenMapModalViewProps {
    visible: boolean;
    onClose: () => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    suggestions: NominatimSuggestion[];
    onSuggestionPress: (item: NominatimSuggestion) => void;
    selectedLocation: SelectedLocationType | null;
    onMapPress: (event: any) => void; // Ganti 'any' dengan tipe event MapView
    onConfirmLocation: () => void;
}

const FullScreenMapModalView: React.FC<FullScreenMapModalViewProps> = ({
    visible,
    onClose,
    searchQuery,
    onSearchQueryChange,
    suggestions,
    onSuggestionPress,
    selectedLocation,
    onMapPress,
    onConfirmLocation
}) => {
    const initialModalRegion: Region = selectedLocation
        ? { ...selectedLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 }
        : { latitude: -6.914744, longitude: 107.60981, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }; // Default Bandung

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
            <View className="flex-1">
                <View className="absolute top-16 left-4 right-4 z-10 bg-white p-2 rounded-xl shadow-lg">
                    <View className='flex-row items-center' >
                        <Ionicons name="search" size={24} color="gray" />
                        <TextInput
                            placeholder="Cari nama jalan atau tempat..."
                            value={searchQuery}
                            onChangeText={onSearchQueryChange}
                            className=" p-2.5 rounded-lg text-sm"
                        />
                    </View>

                    {suggestions.length > 0 && (
                        <FlatList
                            data={suggestions}
                            keyExtractor={(item) => item.place_id.toString()}
                            renderItem={({ item }) => (
                                <Pressable onPress={() => onSuggestionPress(item)} className="p-2.5 border-b border-gray-200">
                                    <Text className="text-sm text-gray-700">{item.display_name}</Text>
                                </Pressable>
                            )}
                            style={{ maxHeight: 200 }}
                        />
                    )}
                </View>

                <MapView
                    style={{ flex: 1 }}
                    initialRegion={initialModalRegion}
                    region={selectedLocation ? { ...selectedLocation, latitudeDelta: 0.005, longitudeDelta: 0.005 } : undefined}
                    onPress={onMapPress}
                    showsUserLocation={true}
                >
                    {selectedLocation && <Marker coordinate={selectedLocation} title="Lokasi laporan" />}
                </MapView>

                <TouchableOpacity
                    className="absolute bottom-6 right-4 bg-primaryNavy px-4 py-2 rounded-lg shadow-md"
                    onPress={onClose}
                >
                    <Text className="text-white text-base ">Tutup Peta</Text>
                </TouchableOpacity>
                {selectedLocation && (
                    <TouchableOpacity
                        className="absolute bottom-6 left-4 bg-primaryNavy px-4 py-2 rounded-lg shadow-md"
                        onPress={onConfirmLocation}
                    >
                        <Text className="text-white ">Konfirmasi Lokasi Ini</Text>
                    </TouchableOpacity>
                )}
            </View>
        </Modal>
    );
};

export default FullScreenMapModalView;
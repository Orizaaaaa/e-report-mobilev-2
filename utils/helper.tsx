import * as ImagePicker from 'expo-image-picker';
import { RelativePathString, router } from 'expo-router';
export interface FormState {
    desc: string;
    images: ImagePicker.ImagePickerAsset[];
    location: Array<{ lat: number; long: number; adress: string }>;
    category: string;
}
export interface SelectedLocationType { // Diberi nama yang lebih spesifik
    latitude: number;
    longitude: number;
}
export interface Category {
    id: string;
    name: string;
    Icon: React.FC<any>;
    value: string;
}


export const movePage = (page: string) => {
    // Navigasi ke halaman detail dengan ID
    router.push(`${page}` as RelativePathString);
};

export interface ReportDescriptionInputProps {
    value: string;
    onChangeText: (text: string) => void;
}

// File: screens/report/types/helper.ts




export interface SelectedLocationType {
    latitude: number;
    longitude: number;
}


// Anda juga bisa menambahkan tipe lain yang digunakan di beberapa tempat di sini
// Contoh: tipe untuk item suggestion dari Nominatim jika Anda memiliki strukturnya
export interface NominatimSuggestion {
    place_id: number;
    licence: string;
    osm_type: string;
    osm_id: number;
    boundingbox: string[];
    lat: string;
    lon: string;
    display_name: string;
    class: string;
    type: string;
    importance: number;
    icon?: string; // Optional
    // tambahkan properti lain jika ada
}
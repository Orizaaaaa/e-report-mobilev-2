import * as ImagePicker from 'expo-image-picker';
export interface FormState {
    desc: string;
    images: ImagePicker.ImagePickerAsset[];
    location: Array<{ lat: number; long: number; adress: string }>;
    category: string;
    anonim: boolean;
    typeReport: string
    status: string
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


export interface ReportDescriptionInputProps {
    value: string;
    onChangeText: (text: string) => void;
    title: string
    placeholderText?: string
}

// File: screens/report/types/helper.ts


export const formatDate = (day: { day: number; month: number; year: number }) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(day.day)}-${pad(day.month)}-${day.year}`;
};

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
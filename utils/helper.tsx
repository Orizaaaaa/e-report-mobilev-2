import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
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
    value: string;
    image?: string
}


export interface ReportDescriptionInputProps {
    value: string;
    onChangeText: (text: string) => void;
    title: string
    placeholderText?: string
}

// File: screens/report/types/helper.ts

export const formatDateContest = (tanggal?: string) => {
    if (!tanggal || typeof tanggal !== 'string') {
        return { day: '', monthName: '' }; // atau return null jika ingin handle di tempat lain
    }

    const [day, month, year] = tanggal.split('-');
    const bulanIndo = [
        '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    return {
        day,
        monthName: bulanIndo[parseInt(month, 10)] || ''
    };
};


export const capitalizeEachWordWithLimit = (text?: string, maxLength: number = 50): string => {
    if (!text || typeof text !== 'string') return '';

    const capitalized = text
        .toLowerCase()
        .replace(/\b\w/g, char => char.toUpperCase());

    if (capitalized.length > maxLength) {
        return capitalized.slice(0, maxLength).trimEnd() + '...';
    }

    return capitalized;
};


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

export const getFirstTwoWords = (fullName?: string): string => {
    if (!fullName || typeof fullName !== 'string') return '';
    return fullName.trim().split(' ').slice(0, 2).join(' ');
};



export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
    if (!text) return '';

    if (text.length > maxLength) {
        return text.slice(0, maxLength) + suffix;
    }

    return text;
}

export function formatTanggalIndonesia(isoDate: string): string {
    const date = new Date(isoDate);

    const bulanIndo = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    const tanggal = date.getDate();
    const bulan = bulanIndo[date.getMonth()];
    const tahun = date.getFullYear();

    return `${tanggal} ${bulan} ${tahun}`;
}


export const CATEGORIES_DATA: Category[] = [
    { id: 'lainnya', name: 'lainnya', value: 'lainnya', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FGroup%20172.webp?alt=media&token=09135d68-f852-417b-887e-09663540933f' },
    { id: 'kriminal', name: 'kriminal', value: 'kriminal', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FVector.webp?alt=media&token=90e59ea8-d700-455e-9593-ed1eb59eccaa' },
    { id: 'jalan', name: 'Jalan Rusak', value: 'Jalan Rusak', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FVector-2.webp?alt=media&token=b445286e-7120-4ecc-b78f-ac9e4adee946' },
    { id: 'lingkungan', name: 'lingkungan', value: 'lingkungan', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FVector-1.webp?alt=media&token=9f4da080-cbde-4c1c-822e-211f4198cb1b' },
    { id: 'sampah', name: 'Sampah / Kebersihan', value: 'Sampah', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FGroup%20170.webp?alt=media&token=74be29fe-9ae3-43e4-b56f-2915fb1539da' },
    { id: 'taman', name: 'taman', value: 'taman', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FGroup%20171.webp?alt=media&token=100001da-fceb-4d13-b346-cff40dd7876d' },
    { id: 'kesehatan', name: 'Kesehatan Masyarakat', value: 'Kesehatan', image: 'https://firebasestorage.googleapis.com/v0/b/next-app-8f4f7.appspot.com/o/category%2FGroup%20169.webp?alt=media&token=76c72b10-0efb-487c-8788-224443381137' },
];

export const STATUS_LIST = [
    { label: 'Tidak valid', value: 'tidak valid', icon: <Feather name="x-circle" size={18} color="black" /> },
    { label: 'Menunggu', value: 'menunggu', icon: <MaterialIcons name="pending-actions" size={18} color="white" /> },
    { label: 'Di proses', value: 'di proses', icon: <MaterialCommunityIcons name="archive-cog-outline" size={18} color="black" /> },
    { label: 'Selesai', value: 'selesai', icon: <MaterialCommunityIcons name="archive-check-outline" size={18} color="black" /> },
];

export const PAGES = [
    { label: 'REGULER', value: 'regular' as const },
    { label: 'PRIORITAS', value: 'prioritas' as const },
    { label: 'BUAT LAPORAN', value: 'laporan' as const },
];

export const IMAGES_CARAOSEL = [
    require('../assets/images/demo.png'),
    require('../assets/images/study1.png'),
    require('../assets/images/demo.png'),
];



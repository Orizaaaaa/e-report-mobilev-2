import { db } from '@/database/firebase'
import { movePage } from '@/utils/helper'
import { MaterialIcons } from '@expo/vector-icons'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'
import React, { useCallback, useState } from 'react'
import { Alert, Image, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import { ScrollView, Text } from 'react-native-gesture-handler'

type Props = {}

const DetailArticle = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const { id } = useLocalSearchParams();
    const doctorId = id;
    const [data, setData] = useState({} as any)
    console.log('lokasi bos', id);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchReport = async () => {
                try {
                    const docRef = doc(db, 'doctors', doctorId as string);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists() && isActive) {
                        const dataDetail: any = docSnap.data();
                        setData(dataDetail);
                    } else {
                        console.warn('Laporan tidak ditemukan');
                    }
                } catch (err) {
                    console.error('Gagal fetch laporan:', err);
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            if (doctorId) fetchReport();

            return () => {
                isActive = false; // cegah update state jika halaman unfocus
            };
        }, [doctorId])
    );

    const formatDate = (timestamp: any) => {
        if (!timestamp) return '-';

        // Convert Firebase Timestamp to Date object
        const date = timestamp.toDate();

        // Format to Indonesian date
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const handleDelete = async () => {
        // Tampilkan alert konfirmasi terlebih dahulu
        Alert.alert(
            "Konfirmasi Hapus",
            "Apakah Anda yakin ingin menghapus data ini?",
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Hapus",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'doctors', doctorId as string));
                            console.log('Dokter berhasil dihapus');
                            // Tambahkan alert sukses jika perlu
                            Alert.alert("Sukses", "Data dokter berhasil dihapus");
                            router.push('/admin/doctors');
                        } catch (error) {
                            console.error('Gagal menghapus dokter:', error);
                            // Tambahkan alert error
                            Alert.alert("Error", "Gagal menghapus data dokter");
                        }
                    }
                }
            ]
        );
    };

    console.log(data);
    console.log(id);

    return (
        <ScrollView >
            <View className='mt-16 px-4 flex-1'  >
                <MaterialIcons className='mb-5' name="arrow-back-ios-new" size={24} color="black" />
                <Image
                    source={{ uri: data.icon }}
                    style={{
                        width: '100%',
                        height: 500,
                        borderRadius: 10
                    }}
                    className='relative'
                    resizeMode="cover"
                />
                <Text className='mt-5 text-[#205072]' >{data.title}</Text>
                <Text className='mt-1 text-sm font-light text-[#205072]' >{data.description}</Text>
                <Text className='mt-1 text-sm font-light text-[#205072]' >{data.hari}</Text>
                <Text className='mt-1 text-sm font-light text-[#205072]' >{data.jam}</Text>

                <View className='mt-2' >
                    <Text className='text-sm font-light' >Di publikasi {formatDate(data.createdAt)}</Text>
                </View>


                <View className="flex-row mt-5 gap-3">
                    <TouchableOpacity onPress={() => movePage(`/admin/doctors/${id}/edit`)} className="flex-1 bg-green-700 px-6 py-3 rounded-lg items-center">
                        <Text className="text-white font-medium">Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleDelete} className="flex-1 bg-red-700 px-6 py-3 rounded-lg items-center">
                        <Text className="text-white font-medium">Hapus</Text>
                    </TouchableOpacity>
                </View>




            </View>

        </ScrollView>
    )
}

export default DetailArticle
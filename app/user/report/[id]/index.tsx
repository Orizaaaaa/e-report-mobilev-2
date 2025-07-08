import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import DetailReport from '@/components/fragments/DetailReport/DetailReport'
import { db } from '@/lib/firebase/firebase'
import { Octicons } from '@expo/vector-icons'
import BottomSheet from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

type ReportData = {
    desc: string
    email: string
    images: string[]
    location: {
        adress: string
        lat: number
        long: number
    }[]
    typeReport: string
    uid: string
    status: string
    createdAt: string
    reason?: string
    bukti_selesai?: string
    name: string
    anonim: boolean
    updatedAt: string
}

const ReportDetailAdmin = () => {
    const { id } = useLocalSearchParams()
    const reportId = id as string

    const [reportData, setReportData] = useState<ReportData | null>(null)
    const [loading, setLoading] = useState(true)

    const [form, setForm] = useState({
        status: '',
        image: '',
        reason: '',
    })

    const bottomSheetRef = useRef<BottomSheet>(null)
    const snapPoints = useMemo(() => ['30%'], [])

    const handleChange = (key: keyof typeof form, value: string | number) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })

        if (!result.canceled) {
            const imageUri = result.assets[0].uri
            handleChange('image', imageUri)
        }
    }

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchReport = async () => {
                try {
                    const docRef = doc(db, 'reports', reportId);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists() && isActive) {
                        const data = docSnap.data();
                        setReportData(data as ReportData);
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

            if (reportId) fetchReport();

            return () => {
                isActive = false; // cegah update state jika halaman unfocus
            };
        }, [reportId])
    );


    console.log(reportData);


    return (
        <SafeAreaView className="flex-1 pt-5">
            <ScrollView className="px-3">
                <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full">
                    <ButtonBack colorIcon="#FF840C" />
                    <Octicons onPress={() => router.push(`/user/report/${id}/edit`)} name="report" size={20} color="gray" />
                </View>

                {loading ? (
                    <View className="mt-10 items-center justify-center">
                        <ActivityIndicator size="large" color="#FF840C" />
                        <Text className="mt-2 text-gray-500">Memuat detail laporan...</Text>
                    </View>
                ) : reportData ? (
                    <>
                        <DetailReport
                            updatedAt={reportData.updatedAt}
                            anonim={reportData.anonim}
                            userName={reportData.name}
                            imageCaraosel={reportData.images}
                            desc={reportData.desc}
                            location={reportData.location[0]}
                            typeReport={reportData.typeReport}
                            status={reportData.status}
                            createdAt={reportData.createdAt}
                            bukti_penyelesaian={reportData.bukti_selesai}
                            reason={reportData.reason}
                        />
                    </>
                ) : (
                    <Text className="text-red-500 mt-10 text-center">Data laporan tidak ditemukan.</Text>
                )}


            </ScrollView>


        </SafeAreaView>
    )
}

export default ReportDetailAdmin

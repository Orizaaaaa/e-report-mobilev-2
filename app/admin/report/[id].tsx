import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import DetailReport from '@/components/fragments/DetailReport/DetailReport'
import { db, storage } from '@/lib/firebase/firebase'
import { FontAwesome, Ionicons, MaterialIcons, Octicons } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import * as ImagePicker from 'expo-image-picker'
import { useLocalSearchParams } from 'expo-router'
import { deleteField, doc, getDoc, updateDoc } from 'firebase/firestore'
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
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
    bukti_selesai?: string
    reason?: string
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
    const openBottomSheet = () => bottomSheetRef.current?.expand()
    const handleSheetChanges = useCallback((index: number) => {
        console.log('BottomSheet index:', index)
    }, [])

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

    const handleSelectStatus = (status: string) => {
        setForm(prev => ({ ...prev, status }))
    }

    const fetchReport = async () => {
        try {
            const docRef = doc(db, 'reports', reportId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setReportData(data as ReportData);
            } else {
                console.warn('Laporan tidak ditemukan');
            }
        } catch (err) {
            console.error('Gagal fetch laporan:', err);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (reportId) fetchReport()
    }, [reportId])

    const handleStatus = async () => {
        if (!form.status) {
            alert('Pilih status terlebih dahulu');
            return;
        }

        if (form.status.toLowerCase() === 'tidak valid' && !form.reason.trim()) {
            alert('Alasan harus diisi untuk status Tidak Valid');
            return;
        }

        try {
            setLoading(true);
            bottomSheetRef.current?.close();
            const docRef = doc(db, 'reports', reportId);

            const updateData: any = {
                status: form.status,
                updatedAt: new Date().toISOString(),
            };

            const previousStatus = reportData?.status?.toLowerCase();

            // === Jika status sekarang "selesai"
            if (form.status.toLowerCase() === 'selesai') {
                if (form.image) {
                    const fileName = 'bukti_selesai.jpg';
                    const imageRef = ref(storage, `reports/${reportId}_${fileName}`);

                    // Upload bukti_selesai.jpg
                    const response = await fetch(form.image);
                    const blob = await response.blob();
                    await uploadBytes(imageRef, blob);

                    const imageUrl = await getDownloadURL(imageRef);
                    updateData.bukti_selesai = imageUrl;
                }
            }

            // === Jika status sebelumnya adalah "selesai" dan sekarang BUKAN
            if (previousStatus === 'selesai' && form.status.toLowerCase() !== 'selesai') {
                // Hapus field di Firestore
                updateData.bukti_selesai = deleteField();

                // Hapus file dari Storage
                const imageRef = ref(storage, `reports/${reportId}_bukti_selesai.jpg`);
                try {
                    await deleteObject(imageRef);
                } catch (err) {
                    console.warn('⚠️ Gagal menghapus bukti_selesai di Storage (mungkin sudah terhapus)');
                }
            }

            if (form.reason) {
                updateData.reason = form.reason;
            }

            await updateDoc(docRef, updateData);
            alert('Status berhasil disimpan');

            setReportData(prev => {
                if (!prev) return null;

                const updatedData = {
                    ...prev,
                    status: form.status,
                    updatedAt: new Date().toISOString(),
                    reason: form.reason || prev?.reason,
                };

                // Tambah atau hapus `bukti_selesai` di state sesuai status baru
                if (form.status.toLowerCase() === 'selesai' && form.image) {
                    updatedData.bukti_selesai = updateData.bukti_selesai;
                } else if (previousStatus === 'selesai' && form.status.toLowerCase() !== 'selesai') {
                    delete updatedData.bukti_selesai;
                }

                return updatedData;
            });

            setForm({ status: '', image: '', reason: '' });

        } catch (error) {
            console.error('❌ Gagal menyimpan status:', error);
            alert('Terjadi kesalahan saat menyimpan status');
        } finally {
            setLoading(false);
        }
    };




    console.log('data', reportData);
    console.log('ini form nya', form);


    const renderAdditionalField = () => {
        if (form.status === 'Selesai') {
            return (
                <View className="mt-4">
                    <Text className="text-gray-500 mb-2">Masukan Bukti Penyelesaian</Text>
                    <TouchableOpacity
                        onPress={handlePickImage}
                        className="w-full h-48 rounded-xl justify-center items-center border-2 border-dotted border-gray-400 relative"
                        activeOpacity={1}
                    >
                        {form.image ? (
                            <>
                                <Image
                                    source={{ uri: form.image }}
                                    className="w-full h-full rounded-xl"
                                    resizeMode="cover"
                                />
                                <TouchableOpacity
                                    onPress={() => handleChange('image', '')}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow"
                                >
                                    <Ionicons name="close" size={20} color="black" />
                                </TouchableOpacity>
                            </>
                        ) : (
                            <FontAwesome name="image" size={24} color="gray" />
                        )}
                    </TouchableOpacity>
                </View>
            )
        }

        if (form.status === 'Tidak valid') {
            return (
                <View className="mt-4">
                    <Text className="text-sm font-semibold mb-1">Alasan:</Text>
                    <TextInput
                        placeholder="Masukkan alasan kenapa tidak valid"
                        value={form.reason}
                        onChangeText={handleChange.bind(null, 'reason')}
                        className="border border-gray-300 rounded-md px-3 py-2"
                    />
                </View>
            )
        }

        return null
    }

    console.log(reportData);

    const statuses = ['Menunggu', 'Di proses', 'Selesai', 'Tidak valid']

    return (
        <SafeAreaView className="flex-1 pt-5">
            <ScrollView className="px-3">
                <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full">
                    <ButtonBack colorIcon="#FF840C" />
                    <Octicons name="report" size={20} color="gray" />
                </View>

                {loading ? (
                    <View className="mt-10 items-center justify-center">
                        <ActivityIndicator size="large" color="#FF840C" />
                        <Text className="mt-2 text-gray-500">Memuat detail laporan...</Text>
                    </View>
                ) : reportData ? (
                    <>
                        <DetailReport
                            imageCaraosel={reportData.images}
                            desc={reportData.desc}
                            location={reportData.location[0]}
                            typeReport={reportData.typeReport}
                            status={reportData.status}
                            createdAt={reportData.createdAt}
                            bukti_penyelesaian={reportData.bukti_selesai}
                        />
                        <View className="flex-row my-5">
                            <TouchableOpacity
                                className="flex-row items-center gap-2 mt-4 bg-primaryNavy py-2 px-4 rounded-full"
                                onPress={openBottomSheet}
                            >
                                <MaterialIcons name="pending-actions" size={20} color="white" />
                                <Text className="text-white">Tindak</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                    <Text className="text-red-500 mt-10 text-center">Data laporan tidak ditemukan.</Text>
                )}


            </ScrollView>

            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                onChange={handleSheetChanges}
                enablePanDownToClose
            >
                <BottomSheetView className="p-4">
                    <Text className="text-lg font-semibold mb-4">Tindak Laporan</Text>

                    {statuses.map(status => (
                        <TouchableOpacity
                            key={status}
                            onPress={() => handleSelectStatus(status)}
                            className="flex-row items-center mb-3"
                        >
                            <View
                                className={`w-6 h-6 rounded-full border-2 mr-2 ${form.status === status ? 'border-gray-400 bg-primaryNavy' : 'border-gray-400'
                                    }`}
                            />
                            <Text className="text-base">{status}</Text>
                        </TouchableOpacity>
                    ))}

                    {renderAdditionalField()}

                    <TouchableOpacity onPress={handleStatus} className="mt-6 bg-primaryNavy rounded-full py-3 items-center">
                        <Text className="text-white font-semibold">Simpan Status</Text>
                    </TouchableOpacity>
                </BottomSheetView>
            </BottomSheet>
        </SafeAreaView>
    )
}

export default ReportDetailAdmin

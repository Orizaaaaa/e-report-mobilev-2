// File: EditReportPage.tsx
import { uploadImagesToStorage } from '@/api/api';
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonBack from '@/components/elements/buttonBack/ButtonBack';
import DescriptionInput from '@/components/elements/Input/DescriptionInput';
import CategorySelection from '@/components/fragments/CategorySelection/CategorySelection';
import ImageUploadSection from '@/components/fragments/ImageUpload/ImageUploadSection';
import { db } from '@/lib/firebase/firebase';
import { CATEGORIES_DATA } from '@/utils/helper';
import { Octicons } from '@expo/vector-icons';

import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Switch, Text, TextInput, View } from 'react-native';

const MAX_IMAGES = 4;

export interface FormState {
    desc: string;
    images: ImagePicker.ImagePickerAsset[];
    location: Array<{ lat: number; long: number; adress: string }>;
    category: string;
    typeReport: string;
    status: string;
    anonim: boolean;
}

const EditReportPage = () => {
    const pathname = usePathname();
    console.log('lokasi bos:', pathname);

    const { id } = useLocalSearchParams();
    console.log('lokasi bos', pathname);

    const reportId = id as string;
    const router = useRouter();

    const [form, setForm] = useState<FormState>({
        desc: '',
        images: [],
        location: [{ lat: 0, long: 0, adress: '' }],
        category: '',
        typeReport: '',
        status: 'menunggu',
        anonim: false,
    });

    const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
    const [mainImageIndex, setMainImageIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            const ref = doc(db, 'reports', reportId);
            const snap = await getDoc(ref);
            if (snap.exists()) {
                const data = snap.data();

                setForm({
                    desc: data.desc || '',
                    images: data.images || [],
                    location: data.location || [{ lat: 0, long: 0, adress: '' }],
                    category: data.category || '',
                    typeReport: data.typeReport || '',
                    status: data.status || 'menunggu',
                    anonim: data.anonim || false,
                });

                // Konversi gambar dari string ke ImagePickerAsset
                const convertedImages = (data.images || []).map((uri: string): ImagePicker.ImagePickerAsset => ({
                    uri,
                    width: 1000,
                    height: 1000,
                    type: 'image',
                    fileName: uri.split('/').pop() || 'image.jpg',
                    assetId: null,
                }));

                setImages(convertedImages);
                setQuery(data.location?.[0]?.adress || '');
                setActiveCategory(data.category || null);
            }
            setLoading(false);
        };

        fetchReport();
    }, [reportId]);

    // Sinkronisasi form.images dengan state images
    useEffect(() => {
        setForm(prevForm => ({ ...prevForm, images }));
    }, [images]);

    const handleImagePickerResponse = (result: ImagePicker.ImagePickerResult) => {
        if (!result.canceled) {
            const newAssets = result.assets;
            const totalAfterAdd = images.length + newAssets.length;

            if (totalAfterAdd <= MAX_IMAGES) {
                setImages(prev => [...prev, ...newAssets]);
            } else {
                const remainingSlots = MAX_IMAGES - images.length;
                if (remainingSlots > 0) {
                    setImages(prev => [...prev, ...newAssets.slice(0, remainingSlots)]);
                    Alert.alert('Maksimal Gambar', `Hanya ${remainingSlots} gambar berhasil ditambahkan. Maksimal ${MAX_IMAGES} gambar.`);
                } else {
                    Alert.alert('Maksimal Gambar', `Anda sudah mengunggah maksimal ${MAX_IMAGES} gambar.`);
                }
            }
        }
    };

    const openCamera = useCallback(async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses kamera diperlukan!');
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        handleImagePickerResponse(result);
    }, [images]);

    const openGallery = useCallback(async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Izin Diperlukan', 'Izin untuk mengakses galeri diperlukan!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1
        });
        handleImagePickerResponse(result);
    }, [images]);

    const deleteImage = useCallback((indexToDelete: number) => {
        setImages(currentImages => {
            const updatedImages = currentImages.filter((_, idx) => idx !== indexToDelete);
            if (mainImageIndex === indexToDelete) {
                setMainImageIndex(updatedImages.length > 0 ? 0 : 0);
            } else if (mainImageIndex > indexToDelete) {
                setMainImageIndex(prevIndex => prevIndex - 1);
            } else if (mainImageIndex >= updatedImages.length && updatedImages.length > 0) {
                setMainImageIndex(updatedImages.length - 1);
            }
            return updatedImages;
        });
    }, [mainImageIndex]);

    const handleUpdate = async () => {
        setLoadingSubmit(true);
        try {
            const existingImageUrls = form.images.map(img => img.uri);
            const newImages = images.filter(img => !existingImageUrls.includes(img.uri));
            const newImageUrls = await uploadImagesToStorage(newImages.map(img => img.uri), 'edited-reports');

            const finalImageUrls = images.map(img => {
                return existingImageUrls.includes(img.uri) ? img.uri : newImageUrls.shift();
            }).filter(Boolean);

            const updatedData = {
                ...form,
                images: finalImageUrls,
                category: activeCategory,
            };

            await updateDoc(doc(db, 'reports', reportId), updatedData);
            Alert.alert('Sukses', 'Laporan berhasil diperbarui');
            router.back();
        } catch (err) {
            console.error(err);
            Alert.alert('Gagal', 'Gagal memperbarui laporan');
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleCategorySelect = (val: string) => {
        setActiveCategory(val);
        setForm(prev => ({ ...prev, category: val }));
    };

    return (
        <ScrollView className=' px-3 mt-12'>
            {loading ? (
                <ActivityIndicator size="large" color="#1E2A38" />
            ) : (
                < >
                    <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full mb-3">
                        <ButtonBack colorIcon="#FF840C" />
                        <Octicons onPress={() => router.push(`/user/report/${id}/edit`)} name="report" size={20} color="gray" />
                    </View>
                    <ImageUploadSection
                        images={images}
                        mainImageIndex={mainImageIndex}
                        onSetMainImageIndex={setMainImageIndex}
                        onOpenCamera={openCamera}
                        onOpenGallery={openGallery}
                        onDeleteImage={deleteImage}
                    />

                    <DescriptionInput
                        title='Deskripsi Laporan'
                        placeholderText='Masukkan deskripsi laporan...'
                        value={form.desc}
                        onChangeText={(text) => setForm(prev => ({ ...prev, desc: text }))}
                    />

                    <View className="mt-8">
                        <Text className='mb-2 text-gray-500'>Lokasi Kejadian</Text>
                        <TextInput
                            placeholderTextColor={'gray'}
                            placeholder="Masukkan lokasi kejadian..."
                            value={query}
                            onChangeText={(text) => {
                                setQuery(text);
                                setForm(prev => ({
                                    ...prev,
                                    location: [{ lat: 0, long: 0, adress: text }],
                                }));
                            }}
                            className="border border-gray-300 rounded-md p-3 text-base mb-4"
                        />
                    </View>

                    <CategorySelection
                        categories={CATEGORIES_DATA}
                        activeCategoryValue={activeCategory}
                        onSelectCategory={handleCategorySelect}
                    />

                    <View className="flex-row items-center justify-between mt-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <View className="flex-1">
                            <Text className="text-base font-medium text-gray-800">Laporkan sebagai Anonim</Text>
                            <Text className="text-sm text-gray-500">Identitas Anda tidak akan ditampilkan</Text>
                        </View>
                        <Switch
                            trackColor={{ false: "#e5e7eb", true: "#1E2A38" }}
                            thumbColor={"#ffffff"}
                            ios_backgroundColor="#e5e7eb"
                            onValueChange={(value) => setForm(prev => ({ ...prev, anonim: value }))}
                            value={form.anonim}
                            className="ml-2"
                        />
                    </View>

                    <View className='flex-row justify-end'>
                        {loadingSubmit ? (
                            <View className='px-6 py-4 mt-6 mb-6 rounded-lg bg-primaryNavy'>
                                <ActivityIndicator size="large" color="white" />
                            </View>
                        ) : (
                            <ButtonPrimary
                                text="Simpan Perubahan"
                                className="px-6 py-4 mt-6 mb-6 rounded-lg"
                                onPress={handleUpdate}
                            />
                        )}
                    </View>
                </>
            )}
        </ScrollView>
    );
};

export default EditReportPage;

// File: screens/report/components/ImageUploadSection.tsx
import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import ButtonSecondary from '@/components/elements/Button/ButtonSecondary';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import React from 'react';
import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ImageUploadSectionProps {
    images: ImagePicker.ImagePickerAsset[];
    mainImageIndex: number;
    onSetMainImageIndex: (index: number) => void;
    onOpenCamera: () => void;
    onOpenGallery: () => void;
    onDeleteImage: (index: number) => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
    images,
    mainImageIndex,
    onSetMainImageIndex,
    onOpenCamera,
    onOpenGallery,
    onDeleteImage,
}) => {
    const imageSlots = [0, 1, 2, 3];

    const handleThumbnailPress = (index: number) => {
        if (images[index]) {
            onSetMainImageIndex(index);
        } else {
            if (images.length < 4) {
                Alert.alert(
                    "Pilih Sumber Gambar",
                    "Ambil gambar dari kamera atau galeri?",
                    [
                        { text: "Kamera", onPress: onOpenCamera },
                        { text: "Galeri", onPress: onOpenGallery },
                        { text: "Batal", style: "cancel" }
                    ]
                );
            } else {
                Alert.alert("Penuh", "Anda sudah mengunggah 4 gambar.");
            }
        }
    };

    return (
        <View>
            <View
                className={`w-full h-40 rounded-xl justify-center items-center ${images[mainImageIndex] ? '' : 'border-2 border-dotted border-gray-400'}`}
            >
                {images.length > 0 && images[mainImageIndex] ? (
                    <Image
                        source={{ uri: images[mainImageIndex].uri }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <AntDesign name="pluscircleo" size={30} color="gray" />
                )}
            </View>

            <View className="flex-row flex-wrap justify-start -mx-1 mt-2">
                {imageSlots.map(index => (
                    <View key={index} className="basis-1/4 px-1 mb-2">
                        <TouchableOpacity
                            className="relative"
                            onPress={() => handleThumbnailPress(index)}
                            onLongPress={() => {
                                if (images[index]) onDeleteImage(index);
                            }}
                        >
                            <View
                                className={`aspect-square rounded-lg justify-center items-center overflow-hidden ${images[index] ? '' : 'border-2 border-dotted border-gray-300'}`}
                            >
                                {images[index] ? (
                                    <Image
                                        source={{ uri: images[index].uri }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <AntDesign name="plus" size={24} color="gray" />
                                )}
                            </View>
                            {images[index] && (
                                <TouchableOpacity
                                    style={styles.deleteImageIcon}
                                    onPress={() => onDeleteImage(index)}
                                >
                                    <AntDesign name="closecircle" size={18} color="white" />
                                </TouchableOpacity>
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            {images.length > 0 && (
                <>
                    <Text className='text-xs italic text-gray-600 mt-1'>
                        * Tekan thumbnail untuk mengganti gambar utama.
                    </Text>
                    <Text className='text-xs italic text-red-600'>
                        * Tekan lama thumbnail atau ikon (x) untuk menghapus gambar.
                    </Text>
                </>
            )}
            {images.length >= 4 && (
                <Text className="text-xs italic text-red-700 mt-1">
                    * Bukti laporan maksimal 4 gambar.
                </Text>
            )}

            <View className="flex-row justify-between mt-3">
                <View className="w-[48%]">
                    <ButtonPrimary text="Buka Kamera" className="p-2 rounded-lg border-2 border-primaryNavy" onPress={onOpenCamera} />
                </View>
                <View className="w-[48%]">
                    <ButtonSecondary text="Buka Galeri" className="p-2 rounded-lg" onPress={onOpenGallery} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    deleteImageIcon: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 10,
        padding: 2,
    },
});

export default ImageUploadSection;
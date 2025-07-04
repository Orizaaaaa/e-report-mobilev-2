import ButtonPrimary from '@/components/elements/Button/ButtonPrimary';
import { EvilIcons, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, View } from 'react-native';

type ContestData = {
    image: string;
    location: string;
    title: string;
    desc: string;
    date: string;
    audiens: number;
    userAudiens: { name: string; uid: string }[]; // bisa disesuaikan dengan struktur kamu
};

type Props = {
    contest: ContestData;
    textButton: string;
    handlePres?: () => void;
    styleButton?: string;
    disabled?: boolean;
};

const CardContest = ({ contest, textButton, handlePres, styleButton, disabled }: Props) => {
    const pesertaSaatIni = contest.userAudiens?.length || 0;
    const totalPeserta = contest.audiens;
    const progress = Math.min(pesertaSaatIni / totalPeserta, 1);

    return (
        <View className="w-full space-y-5 mb-10">
            {/* Gambar */}
            <View className="h-32">
                <Image
                    className="w-full h-full rounded-t-3xl"
                    source={{ uri: contest.image }}
                    resizeMode="cover"
                />
                <View className="absolute bottom-2 right-3">
                    <View className="flex-row justify-center items-center bg-slate-50 py-1 px-2 rounded-xl">
                        <EvilIcons name="location" size={15} color="black" />
                        <Text className="text-sm font-light">{contest.location || 'Lokasi belum diatur'}</Text>
                    </View>
                </View>
            </View>

            {/* Konten */}
            <View className="bg-white rounded-b-3xl px-3 pt-3 pb-5 shadow-md shadow-black/30">

                <Text className="text-sm font-light">{contest.desc}</Text>

                <View className="w-full mt-4">
                    <View className="flex-row items-center gap-1 mb-1">
                        <Text className="text-sm font-light text-gray-500">{contest.date}</Text>
                        <Ionicons name="time-outline" size={15} color="gray" />
                    </View>

                    <View className="flex-row justify-between mb-1">
                        <Text className="text-sm text-gray-800">
                            Peserta: {pesertaSaatIni} / {totalPeserta}
                        </Text>
                        <Text className="text-sm text-gray-800">
                            {Math.round(progress * 100)}%
                        </Text>
                    </View>

                    <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <View
                            className="h-full bg-primaryOrange"
                            style={{ width: `${progress * 100}%` }}
                        />
                    </View>

                    <ButtonPrimary
                        disabled={disabled}
                        className={`mt-4 py-2 rounded-xl ${styleButton}`}
                        text={textButton}
                        onPress={handlePres}
                    />
                </View>
            </View>
        </View>
    );
};

export default CardContest;

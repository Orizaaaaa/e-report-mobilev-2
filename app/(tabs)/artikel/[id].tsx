import { db } from '@/database/firebase'
import { Ionicons, MaterialIcons } from '@expo/vector-icons'
import { useFocusEffect, useLocalSearchParams } from 'expo-router'
import { doc, getDoc } from 'firebase/firestore'
import React, { useCallback, useState } from 'react'
import { Image } from 'react-native'
import { View } from 'react-native-animatable'
import { ScrollView, Text } from 'react-native-gesture-handler'

type Props = {}

const DetailArticle = (props: Props) => {
    const [loading, setLoading] = useState(true);
    const { id } = useLocalSearchParams();
    const articleId = id;
    const [data, setData] = useState({} as any)
    console.log('lokasi bos', id);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const fetchReport = async () => {
                try {
                    const docRef = doc(db, 'articles', articleId as string);
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

            if (articleId) fetchReport();

            return () => {
                isActive = false; // cegah update state jika halaman unfocus
            };
        }, [articleId])
    );

    console.log(data);

    return (
        <ScrollView >
            <View className='mt-16 px-4 flex-1'  >
                <MaterialIcons className='mb-5' name="arrow-back-ios-new" size={24} color="black" />
                <Image
                    source={{ uri: data.image }}
                    style={{
                        width: '100%',
                        height: 125,
                        borderRadius: 10
                    }}
                    className='relative'
                    resizeMode="cover"
                />
                <Text className='mt-5 text-[#205072]' >{data.title}</Text>

                <View className='mt-4 flex-row items-center gap-4'>
                    <Ionicons name="person" size={30} color="#16a34a" />
                    <View>
                        <Text className='text-sm font-light' >Dr Kemem</Text>
                        <Text className='text-sm font-light' >Dr Sepesialis gigi umum</Text>
                    </View>

                </View>

                <View className='mt-5' >
                    <Text className='text-sm font-light' >Oleh diidng</Text>
                    <Text className='text-sm font-light' >Di publikasi 10 agustus 2021</Text>
                </View>

                <Text className='mt-6 text-sm font-light text-[#205072]' >{data.desc}</Text>

            </View>

        </ScrollView>
    )
}

export default DetailArticle
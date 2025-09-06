import { db } from '@/database/firebase';
import { useFocusEffect } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useCallback, useState } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type Props = {
    handlePress?: () => void;
};

const { width: screenWidth } = Dimensions.get('window');


const imagesCarousel = [
    require('../../../assets/images/promo1.jpeg'),
    require('../../../assets/images/promo2.jpeg'),
    require('../../../assets/images/promo3.jpeg'),
    require('../../../assets/images/promo4.jpeg'),
    require('../../../assets/images/promo5.jpeg'),
];

const { width } = Dimensions.get('window');

const Promo = ({ handlePress }: Props) => {
    const [promo, setPromo] = useState([] as any[]);
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchPromoImages = async () => {
                try {

                    const snapshot = await getDocs(collection(db, 'promo'));

                    if (isActive) {
                        const imageArray = snapshot.docs.map(doc => doc.data().image)
                            .filter(image => image && typeof image === 'string');

                        setPromo(imageArray);
                    }
                } catch (err) {
                    console.error('❌ Gagal mengambil promo:', err);
                } finally {
                    if (isActive) {
                        return () => {
                            isActive = false;
                        };
                    }
                }
            };

            fetchPromoImages();

            return () => {
                isActive = false;
            };
        }, [])
    );
    const [activeIndex, setActiveIndex] = useState(0);
    console.log(promo);



    return (
        <View style={{ marginTop: 10, marginBottom: 10, width: '100%' }}>
            <Carousel
                loop
                autoPlay
                autoPlayInterval={3000}
                width={width}
                height={120}
                data={promo}
                scrollAnimationDuration={1000}
                onSnapToItem={(index) => setActiveIndex(index)}
                mode="parallax"
                modeConfig={{
                    parallaxScrollingScale: 0.9,
                    parallaxScrollingOffset: 50,
                }}
                style={{
                    alignSelf: 'center',
                }}
                pagingEnabled={true}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        // style={{ paddingHorizontal: 0 }}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={{ uri: item }}
                            style={{
                                width: '100%',
                                height: 120,
                                borderRadius: 20,

                            }}
                            resizeMode="cover"
                        />
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

export default Promo;

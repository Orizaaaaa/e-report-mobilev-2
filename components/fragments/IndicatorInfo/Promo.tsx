import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type Props = {
    handlePress: () => void;
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
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <View style={{ marginTop: 10, marginBottom: 10, width: '100%' }}>
            <Carousel
                loop
                autoPlay
                autoPlayInterval={3000}
                width={width}
                height={120}
                data={imagesCarousel}
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
                        onPress={handlePress}
                        // style={{ paddingHorizontal: 0 }}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={item}
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

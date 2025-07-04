import React, { useState } from 'react';
import { Dimensions, Image, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type Props = {
    handlePress: () => void;
};

const imagesCarousel = [
    require('../../../assets/images/demo.png'),
    require('../../../assets/images/study1.png'),
    require('../../../assets/images/demo.png'),
];

const { width } = Dimensions.get('window');

const Promo = ({ handlePress }: Props) => {
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <View style={{ marginTop: 10, marginBottom: 30 }}>
            <Carousel
                loop
                autoPlay
                autoPlayInterval={3000}
                width={width - 24}
                height={130}
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
                pagingEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={handlePress}
                        style={{ paddingHorizontal: 5 }}
                        activeOpacity={0.9}
                    >
                        <Image
                            source={item}
                            style={{
                                width: '100%',
                                height: 130,
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

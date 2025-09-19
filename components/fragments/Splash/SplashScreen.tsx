import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, Text } from 'react-native';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import Icon from '../../../assets/images/textIcon.svg';

const SplashScreen = () => {
    const router = useRouter();
    const { height } = Dimensions.get('window');

    const scale = useSharedValue(0.5);
    const opacity = useSharedValue(0);

    const iconTranslateY = useSharedValue(0);
    const textOpacity = useSharedValue(0);
    const screenTranslateY = useSharedValue(0);

    useEffect(() => {
        // Step 1: Icon fade in + scale
        scale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
        opacity.value = withTiming(1, { duration: 800 });

        // Step 2: Delay lalu icon naik dan teks muncul
        setTimeout(() => {
            // Reduced the translateY value from -50 to -20 for less distance
            iconTranslateY.value = withTiming(-20, { duration: 800, easing: Easing.out(Easing.exp) });
            textOpacity.value = withTiming(1, { duration: 800 });

            // Step 3: Delay lagi, lalu layar geser ke atas dan navigasi
            setTimeout(() => {
                screenTranslateY.value = withTiming(-height, { duration: 800, easing: Easing.inOut(Easing.ease) }, (finished) => {
                    if (finished) {
                        runOnJS(router.replace)('/'); // index page
                    }
                });
            }, 2000);
        }, 1200);
    }, []);

    const iconStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }, { translateY: iconTranslateY.value }],
        opacity: opacity.value,
    }));

    const textStyle = useAnimatedStyle(() => ({
        opacity: textOpacity.value,
        // Added marginTop to bring text closer to the icon
        marginTop: 10,
    }));

    const screenStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: screenTranslateY.value }],
    }));

    return (
        <Animated.View
            style={screenStyle}
            className="h-full w-full bg-white justify-center items-center"
        >
            <Animated.View style={iconStyle}>
                <Icon height={30} width={150} />
            </Animated.View>

            <Animated.View style={textStyle}>
                <Text className="text-center text-base text-black px-4">
                    Laporkan dengan Hati,Direspon dengan <Text className='text-primaryOrange'>Senyuman!</Text>
                </Text>
            </Animated.View>
        </Animated.View>
    );
};

export default SplashScreen;
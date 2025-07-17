import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

// Cegah splash screen auto-hide
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            // Simulasi loading, misal fetch atau delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            setAppIsReady(true);
            await SplashScreen.hideAsync(); // Sembunyikan splash manual
        }

        prepare();
    }, []);

    if (!appIsReady) return null;

    return (
        <View style={{ flex: 1 }}>
            <Slot />
        </View>
    );
}

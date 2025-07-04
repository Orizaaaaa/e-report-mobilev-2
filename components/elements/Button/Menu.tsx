// components/elements/Button/Menu.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';

export default function AppLayout() {
    const [index, setIndex] = useState(2);

    const [routes] = useState([
        { key: 'home', title: 'Home', icon: 'home-outline' },
        { key: 'artikel', title: 'Artikel', icon: 'file-document-outline' },
        { key: 'prediksi', title: 'Prediksi', icon: 'magnify' },
        { key: 'profile', title: 'Profil', icon: 'account-outline' },
    ]);

    const Dummy = () => null;

    const renderScene = BottomNavigation.SceneMap({
        home: Dummy,
        artikel: Dummy,
        prediksi: Dummy,
        profile: Dummy,
    });

    return (
        <BottomNavigation
            navigationState={{ index, routes }}
            onIndexChange={(i) => {
                setIndex(i);
                const routeMap = ['/', '/artikel', '/predict', '/profile'];
                router.push(routeMap[i] as any);
            }}
            renderScene={renderScene}
            shifting={true}
            barStyle={{ backgroundColor: '#00A8A8' }}
            // 002B5A
            activeColor="#00A8A8"
            inactiveColor="#FFFFFF"
            renderIcon={({ route, focused, color }) => (
                <React.Fragment>
                    {/* @ts-ignore */}
                    {route.icon && React.createElement(require('react-native-vector-icons/MaterialCommunityIcons').default, {
                        name: route.icon,
                        color: color,
                        size: 24,
                    })}
                </React.Fragment>
            )}
        />
    );
}

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const iconMap = {
  index: 'home',
  report: 'camera-outline',
  profile: 'person-outline',
} as const;

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const iconName = iconMap[route.name as keyof typeof iconMap];
            return <Ionicons name={iconName} size={size} color={color} />;
          },

          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderRadius: 20,
            height: 70,
            paddingTop: 8,
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 10,
            marginBottom: 10,
            position: 'absolute',
            marginHorizontal: 10, // Android
          },

          headerShown: false,

          // Menambahkan pengaturan warna aktif dan tidak aktif untuk ikon
          tabBarActiveTintColor: '#102E50', // Warna ikon saat tab aktif
          tabBarInactiveTintColor: 'gray', // Warna ikon saat tab tidak aktif
        })}
      >
        <Tabs.Screen name="index" options={{ title: 'Beranda' }} />
        <Tabs.Screen name="report" options={{ title: 'Buat Laporan' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      </Tabs>
    </GestureHandlerRootView>
  );
}

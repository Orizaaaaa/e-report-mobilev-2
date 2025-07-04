

import FloatingButton from '@/components/fragments/FloatingButton';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import '../global.css';

const Colors = {
  primaryOrange: '#FF840C',
  primaryWhite: 'white',
  primaryBlack: '#20BEC6',
};

// Hanya dua tab sekarang: Beranda dan Prediksi
// kabeh halaman atau icon tunda didieu, jang nama icon pake expo icon (---oriza)
const tabs = [

  { name: '/articles', title: 'Artikel', icon: 'newspaper-outline' },
  { name: '/', title: 'Beranda', icon: 'home' },
  { name: '/profile', title: 'Profile', icon: 'person-circle-outline' },

];

const TabButton = ({ item, onPress, isFocused }: { item: any, onPress: () => void, isFocused: boolean }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabButton}>
      <Ionicons
        name={item.icon}
        size={24}
        color={isFocused ? Colors.primaryOrange : Colors.primaryWhite}
      />
      <Text style={[styles.tabText, { color: isFocused ? Colors.primaryOrange : Colors.primaryWhite }]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
};

export default function Layout() {
  const state = useNavigationState(state => state);
  const currentRoute = state.routes[state.index].name;
  const handleWhatsApp = () => {
    const phoneNumber = '6282119092160'; // ← Ganti dengan nomor WA tujuan (tanpa +, pakai 62 untuk Indonesia)
    const message = `Silahkan mengisi form pendaftaran !\n\nKami dari Klinik Harum Lembang ijin mengirimkan\n\nFormat Pendaftaran Pasien\n\nNama:\nNo KTP:\nTanggal Lahir:\nUmur:\nPekerjaan:\nAlamat:\nNo tlp:\n\nHari kedatangan:\nWaktu kedatangan:\nTindakan yang ingin dilakukan: Konsultasi / Sebutkan\nInstagram :`;

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(err =>
      console.error('Failed to open WhatsApp:', err)
    );
  };
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <FloatingButton onPress={handleWhatsApp}>
        <FontAwesome6 name="whatsapp" size={24} color="green" />
      </FloatingButton>

      {/* Simple Tab Bar dengan 2 tab */}
      <View style={styles.tabBar}>
        {tabs.map((item, index) => {
          const isFocused = currentRoute === item.name;

          return (
            <TabButton
              key={index}
              item={item}
              onPress={() => {
                const router = require('expo-router').router;
                router.push(`${item.name}`);
              }}
              isFocused={isFocused}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: Colors.primaryBlack,
    position: 'absolute',

    bottom: 15,
    borderRadius: 20,
    left: 15,
    right: 15,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '400',
  },
});
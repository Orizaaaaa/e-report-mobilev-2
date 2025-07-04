

import FloatingButton from '@/components/fragments/FloatingButton';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import '../global.css';

const Colors = {
  primaryOrange: '#FF840C',
  primaryWhite: 'white',
  primaryBlack: '#20BEC6',
};

// Hanya dua tab sekarang: Beranda dan Prediksi
const tabs = [
  { name: '/', title: 'Beranda', icon: 'home' },
  { name: '/predict', title: 'Prediksi', icon: 'analytics-outline' },
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

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />

      <FloatingButton onPress={() => console.log('Floating clicked')}>
        <FontAwesome6 name="whatsapp" size={24} color="black" />
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
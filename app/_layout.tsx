import { Ionicons } from '@expo/vector-icons';
import { useNavigationState } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

const Colors = {

  primaryOrange: '#FF840C',
  primaryBlue: '#40D8D4',
  primaryGreen: '#E2FA49',
  primaryWhite: 'white',
  primaryBlack: '#141414'
};

const animate1 = {
  0: { scale: 0.5, translateY: 7 },
  0.92: { translateY: -34 },
  1: { scale: 1.2, translateY: -24 }
};

const animate2 = {
  0: { scale: 1.2, translateY: -24 },
  1: { scale: 1, translateY: 7 }
};

const circle1 = {
  0: { scale: 0 },
  0.3: { scale: 0.9 },
  0.5: { scale: 0.2 },
  0.8: { scale: 0.7 },
  1: { scale: 1 }
};

const circle2 = {
  0: { scale: 1 },
  1: { scale: 0 }
};

const tabs = [
  { name: 'index', title: 'Beranda', icon: 'home' },
  { name: 'galery', title: 'Galeri', icon: 'images-outline' },
  { name: 'report', title: 'Laporan', icon: 'camera-outline' },
  { name: 'building', title: 'Bangunan', icon: 'business-outline' },
  { name: 'profile', title: 'Profile', icon: 'person-outline' },
];



// ... (Warna dan animasi tetap sama)

const TabButton = ({ item, onPress }: any) => {
  const state = useNavigationState(state => state);
  const currentRoute = state.routes[state.index].name;
  const focused = currentRoute === item.name;

  const viewRef = useRef<any>(null);
  const circleRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  const bgColor = Colors.primaryWhite;

  useEffect(() => {
    if (focused) {
      viewRef.current?.animate(animate1);
      circleRef.current?.animate(circle1);
      textRef.current?.transitionTo({ scale: 1 });
    } else {
      viewRef.current?.animate(animate2);
      circleRef.current?.animate(circle2);
      textRef.current?.transitionTo({ scale: 0 });
    }
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={styles.container}>
      <Animatable.View
        ref={viewRef}
        duration={1000}
        style={styles.container}>
        <View style={[styles.btn, { backgroundColor: bgColor }]}>
          <Animatable.View
            ref={circleRef}
            style={[styles.circle, { backgroundColor: Colors.primaryGreen }]}
          />
          <Ionicons
            name={item.icon}
            size={24}
            color={focused ? Colors.primaryBlack : Colors.primaryOrange}
          />
        </View>
        <Animatable.Text
          ref={textRef}
          style={[styles.text, { color: Colors.primaryBlack }]}>
          {item.title}
        </Animatable.Text>

      </Animatable.View>
    </TouchableOpacity>
  );
};

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarHideOnKeyboard: true
        }}
      >
        {tabs.map((tab, index) => (
          <Tabs.Screen
            key={index}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarButton: (props) => <TabButton {...props} item={tab} />
            }}
          />
        ))}
      </Tabs>
    </GestureHandlerRootView>
  );
}

// Styles tetap sama

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
  },
  tabBar: {
    height: 70,
    position: 'absolute',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: Colors.primaryWhite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: Colors.primaryWhite,
    backgroundColor: Colors.primaryWhite,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 25,
  },
  text: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 4
  }
});
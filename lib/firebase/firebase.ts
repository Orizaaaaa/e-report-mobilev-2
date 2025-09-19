import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCPwSB22fdeiEiTJC2stQ8p08fM9F9leHg",
    authDomain: "next-app-8f4f7.firebaseapp.com",
    databaseURL: "https://next-app-8f4f7-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "next-app-8f4f7",
    storageBucket: "next-app-8f4f7.appspot.com",
    messagingSenderId: "947104129441",
    appId: "1:947104129441:web:5308ba1fe28d9894acebe0"
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);

import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyD5bP1-dur3jiuOlANd27636kw8kOqlE0Y",
    authDomain: "klinik-harum.firebaseapp.com",
    projectId: "klinik-harum",
    storageBucket: "klinik-harum.firebasestorage.app",
    messagingSenderId: "736969242358",
    appId: "1:736969242358:web:68e61a7de544f770b99ed7",
    measurementId: "G-8SCHGZ6HVD"
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);


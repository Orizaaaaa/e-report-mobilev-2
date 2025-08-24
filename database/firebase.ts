
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";
//@ts-ignore
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyAx-wFdl3XMxSbCxJZQUHS7JCXT4C_mc3s",
    authDomain: "skrips-zain-strawberry.firebaseapp.com",
    databaseURL: "https://skrips-zain-strawberry-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "skrips-zain-strawberry",
    storageBucket: "skrips-zain-strawberry.firebasestorage.app",
    messagingSenderId: "395461719128",
    appId: "1:395461719128:web:6c7b9b7f182071e840862d",
    measurementId: "G-G4J89VW2SB"
};
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);


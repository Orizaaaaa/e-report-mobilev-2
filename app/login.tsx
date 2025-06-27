import { auth, db } from '@/lib/firebase/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity
} from 'react-native';


export default function LoginRegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);

    const signIn = async () => {
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const uid = result.user.uid;

            const userDoc = await getDoc(doc(db, 'users', uid));
            const role = userDoc.exists() ? userDoc.data().role : 'user';

            const userData = {
                uid,
                email: result.user.email,
                role,
            };
            await AsyncStorage.setItem('user', JSON.stringify(userData));
            console.log(userData);

            Alert.alert('Login Berhasil', userData.email ?? '');
        } catch (error: any) {
            Alert.alert('Gagal Login', error.message);
        }
    };

    const signUp = async () => {
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            const uid = result.user.uid;

            await setDoc(doc(db, 'users', uid), {
                email: result.user.email,
                role: 'user',
            });

            const userData = {
                uid,
                email: result.user.email,
                role: 'user',
            };


            await AsyncStorage.setItem('user', JSON.stringify(userData));

            Alert.alert('Akun Berhasil Dibuat', userData.email ?? '');
        } catch (error: any) {
            Alert.alert('Gagal Register', error.message);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
            <Text style={{ fontSize: 24, textAlign: 'center', marginBottom: 20 }}>
                {isRegistering ? 'Register' : 'Login'}
            </Text>

            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 10,
                }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{
                    borderWidth: 1,
                    borderColor: '#ccc',
                    borderRadius: 5,
                    padding: 10,
                    marginBottom: 20,
                }}
            />

            <TouchableOpacity
                onPress={isRegistering ? signUp : signIn}
                style={{
                    backgroundColor: '#007bff',
                    padding: 12,
                    borderRadius: 5,
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>
                    {isRegistering ? 'Register' : 'Login'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)} style={{ marginTop: 15 }}>
                <Text style={{ textAlign: 'center', color: '#007bff' }}>
                    {isRegistering
                        ? 'Sudah punya akun? Login di sini'
                        : 'Belum punya akun? Daftar di sini'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
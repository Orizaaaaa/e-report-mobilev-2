
import { auth } from '@/lib/firebase/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const signIn = async () => {
        try {
            const user = await signInWithEmailAndPassword(auth, email, password);
            alert('Sign in successful: ' + user.user.email);
        } catch (error: any) {
            alert('Sign in failed: ' + error.message);
        }
    };

    const signUp = async () => {
        try {
            const user = await createUserWithEmailAndPassword(auth, email, password);
            alert('Sign up successful: ' + user.user.email);
        } catch (error: any) {
            alert('Sign up failed: ' + error.message);
        }
    };

    return (
        <SafeAreaView>
            <Text>Login</Text>
            <TextInput placeholder="email" value={email} onChangeText={setEmail} />
            <TextInput placeholder="password" value={password} onChangeText={setPassword} secureTextEntry />
            <TouchableOpacity onPress={signIn}>
                <Text>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={signUp}>
                <Text>Make Account</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
import { uploadOneImageToStorage } from '@/api/api';
import AuthInput from '@/components/elements/AuthInput/AuthInput';
import { auth, db } from '@/lib/firebase/firebase';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
    createUserWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth';
import { collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Define interfaces for form data and validation errors
interface FormData {
    image: string;
    email: string;
    password: string;
    name: string;
    nik: string;
    phone: string;
    location: string;
    role: 'user' | 'admin' | 'editor';
}

interface ValidationErrors {
    email?: string;
    image?: string;
    password?: string;
    name?: string;
    nik?: string;
    phone?: string;
    location?: string;
    role?: string;
}

const RegisterScreen = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<FormData>({
        email: '',
        password: '',
        name: '',
        nik: '',
        image: '',
        phone: '',
        location: '',
        role: 'user', // Default role for registration
    });
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const handleInputChange = (field: keyof FormData, value: string) => {
        setForm(prevForm => ({
            ...prevForm,
            [field]: value,
        }));
        if (validationErrors[field]) {
            setValidationErrors(prevErrors => {
                const newErrors = { ...prevErrors };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });

        if (!result.canceled) {
            const imageUri = result.assets[0].uri;
            handleInputChange('image', imageUri);
        }
    };

    const validateForm = (): boolean => {
        let errors: ValidationErrors = {};
        let isValid: boolean = true;

        if (!form.email.trim()) {
            errors.email = 'Email tidak boleh kosong.';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(form.email)) {
            errors.email = 'Format email tidak valid.';
            isValid = false;
        }

        if (!form.password.trim()) {
            errors.password = 'Password tidak boleh kosong.';
            isValid = false;
        } else if (form.password.length < 6) {
            errors.password = 'Password minimal 6 karakter.';
            isValid = false;
        }

        if (!form.name.trim()) {
            errors.name = 'Nama tidak boleh kosong.';
            isValid = false;
        }
        if (!form.nik.trim()) {
            errors.nik = 'NIK tidak boleh kosong.';
            isValid = false;
        } else if (!/^\d{16}$/.test(form.nik)) {
            errors.nik = 'NIK harus 16 digit angka.';
            isValid = false;
        }
        if (!form.phone.trim()) {
            errors.phone = 'Nomor telepon tidak boleh kosong.';
            isValid = false;
        } else if (!/^\d{10,15}$/.test(form.phone)) {
            errors.phone = 'Format nomor telepon tidak valid.';
            isValid = false;
        }
        if (!form.location.trim()) {
            errors.location = 'Lokasi tidak boleh kosong.';
            isValid = false;
        }
        if (!form.image.trim()) {
            errors.location = 'Gambar tidak boleh kosong.';
            isValid = false;
        }
        if (!form.role.trim()) {
            errors.role = 'Role harus dipilih.';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };


    const signUp = async () => {
        setLoading(true);

        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const nik = form.nik.toString().trim();
            console.log("Memeriksa NIK:", nik);

            // 1. Cari NIK di koleksi nik-auth (karena disimpan sebagai field "NIK")
            const nikQuery = query(
                collection(db, "nik-auth"),
                where("NIK", "==", nik)
            );
            const querySnapshot = await getDocs(nikQuery);

            if (querySnapshot.empty) {
                setLoading(false);
                Alert.alert(
                    "Registrasi Gagal",
                    "NIK Anda tidak terdaftar dalam sistem. Silakan hubungi administrator."
                );
                return;
            }

            // 2. Cek apakah email sudah dipakai
            const emailQuery = query(
                collection(db, "users"),
                where("email", "==", form.email.trim().toLowerCase())
            );
            const emailSnapshot = await getDocs(emailQuery);

            if (!emailSnapshot.empty) {
                setLoading(false);
                Alert.alert("Registrasi Gagal", "Email sudah terdaftar");
                return;
            }

            // 3. Cek apakah NIK sudah dipakai di users
            const nikUserQuery = query(
                collection(db, "users"),
                where("nik", "==", nik)
            );
            const nikUserSnapshot = await getDocs(nikUserQuery);

            if (!nikUserSnapshot.empty) {
                setLoading(false);
                Alert.alert("Registrasi Gagal", "NIK sudah terdaftar");
                return;
            }

            // 4. Registrasi akun baru
            const result: UserCredential = await createUserWithEmailAndPassword(
                auth,
                form.email.trim().toLowerCase(),
                form.password
            );

            const uid: string = result.user.uid;
            console.log("User created with UID:", uid);

            // 5. Upload foto profil
            let downloadURL = "";
            if (form.image) {
                try {
                    downloadURL = await uploadOneImageToStorage(
                        form.image,
                        uid,
                        "users_profiles"
                    );
                } catch (uploadError) {
                    console.warn("Gagal upload gambar:", uploadError);
                    downloadURL = "https://via.placeholder.com/150";
                }
            }

            // 6. Simpan data user ke Firestore
            const userData = {
                image: downloadURL,
                email: form.email.trim().toLowerCase(),
                name: form.name.trim(),
                nik: nik,
                phone: form.phone.toString().trim(),
                location: form.location.trim(),
                role: form.role,
                createdAt: new Date(),
                updatedAt: new Date(),
                isActive: true
            };

            await setDoc(doc(db, "users", uid), userData);
            console.log("User data saved successfully");

            // 7. (opsional) update dokumen nik-auth yang ditemukan → kasih tanda registered
            try {
                const foundDoc = querySnapshot.docs[0];
                await setDoc(
                    doc(db, "nik-auth", foundDoc.id),
                    {
                        status: "registered",
                        registeredAt: new Date(),
                        registeredBy: uid
                    },
                    { merge: true }
                );
                console.log("NIK status updated");
            } catch (updateError) {
                console.warn("Gagal update status NIK:", updateError);
            }

            setLoading(false);
            Alert.alert("Sukses", "Registrasi berhasil!");
            router.push("/login");
        } catch (error: any) {
            setLoading(false);
            console.error("Error during registration:", error);

            if (error.code === "auth/email-already-in-use") {
                Alert.alert("Gagal Register", "Email sudah terdaftar");
            } else if (error.code === "auth/weak-password") {
                Alert.alert("Gagal Register", "Password terlalu lemah");
            } else if (error.code === "auth/invalid-email") {
                Alert.alert("Gagal Register", "Format email tidak valid");
            } else {
                Alert.alert(
                    "Gagal Register",
                    error.message || "Terjadi kesalahan saat registrasi"
                );
            }
        }
    };


    console.log(form);


    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            <ScrollView contentContainerClassName="flex-grow justify-center px-5 ">
                <Text className="text-3xl font-bold text-center mb-8 text-gray-800">
                    Buat Akun
                </Text>

                <View className='w-full flex items-center justify-center relative mb-4'>
                    <TouchableOpacity className='w-28 h-28 rounded-full border-2 bg-primary relative border-gray-400 p-2'
                        onPress={handlePickImage}>
                        {/* avatar section  */}

                        {form.image ? (
                            <Image
                                source={{ uri: form.image }}
                                className='w-full h-full rounded-full'
                                resizeMode='cover'
                            />
                        ) : (
                            <Image
                                source={require('@/assets/images/profile.png')} // GANTI PATH sesuai struktur file kamu
                                className='w-full h-full'
                                resizeMode='contain'
                            />
                        )}

                        <View className='h-7 w-7 bg-primary rounded-full absolute top-0 right-0 flex items-center justify-center z-10'>
                            <MaterialIcons name='edit' size={20} color='gray' />
                        </View>
                    </TouchableOpacity>
                </View>


                <View className='w-full flex items-start mb-2'>
                    <AuthInput
                        placeholder='NIK (Nomor Induk Kependudukan)'
                        value={form.nik}
                        onChangeText={(text) => handleInputChange('nik', text)}
                        isPass={false}
                        border={validationErrors.nik ? 'border-red-500' : 'border-gray-200'}
                        keyboardType='numeric'
                        maxLength={16}
                    />
                    {validationErrors.nik && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.nik}</Text>}
                </View>

                <View className='w-full flex items-start mb-2'>
                    <AuthInput
                        placeholder='Nama Lengkap'
                        value={form.name}
                        onChangeText={(text) => handleInputChange('name', text)}
                        isPass={false}
                        border={validationErrors.name ? 'border-red-500' : 'border-gray-200'}
                    />
                    {validationErrors.name && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.name}</Text>}
                </View>

                <View className='w-full flex items-start mb-2'>
                    <AuthInput
                        placeholder='Email'
                        value={form.email}
                        onChangeText={(text) => handleInputChange('email', text)}
                        isPass={false}
                        border={validationErrors.email ? 'border-red-500' : 'border-gray-200'}
                    />
                    {validationErrors.email && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.email}</Text>}
                </View>

                <View className='w-full flex items-start mb-2'>
                    <AuthInput
                        placeholder='Nomor Telepon'
                        value={form.phone}
                        onChangeText={(text) => handleInputChange('phone', text)}
                        isPass={false}
                        border={validationErrors.phone ? 'border-red-500' : 'border-gray-200'}
                        keyboardType='phone-pad'
                    />
                    {validationErrors.phone && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.phone}</Text>}
                </View>

                <View className='w-full flex items-start mb-2'>
                    <AuthInput
                        placeholder='Lokasi'
                        value={form.location}
                        onChangeText={(text) => handleInputChange('location', text)}
                        isPass={false}
                        border={validationErrors.location ? 'border-red-500' : 'border-gray-200'}
                    />
                    {validationErrors.location && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.location}</Text>}
                </View>

                <View className='w-full flex items-start mb-2'>
                    <AuthInput
                        placeholder='Password'
                        value={form.password}
                        onChangeText={(text) => handleInputChange('password', text)}
                        isPass={true}
                        border={validationErrors.password ? 'border-red-500' : 'border-gray-200'}
                    />
                    {validationErrors.password && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.password}</Text>}
                </View>


                {/* <View className="mb-5">
                    <Text className="text-base mb-2 text-gray-700 font-bold">Pilih Role:</Text>
                    <View className="flex-row justify-around mb-2">
                        {['user', 'admin', 'editor'].map((roleOption: string) => (
                            <TouchableOpacity
                                key={roleOption}
                                className={`py-2 px-4 rounded-full border border-blue-500 ${form.role === roleOption ? 'bg-blue-500' : 'bg-blue-100'}`}
                                onPress={() => handleInputChange('role', roleOption)}
                            >
                                <Text className={`font-bold ${form.role === roleOption ? 'text-white' : 'text-blue-500'}`}>
                                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {validationErrors.role && <Text className="text-red-500 text-xs mb-2 ml-1">{validationErrors.role}</Text>}
                </View> */}


                <TouchableOpacity
                    onPress={signUp}
                    disabled={loading}
                    className="bg-primaryNavy p-4 rounded-lg items-center mt-4 shadow-md"
                >
                    {loading ? <ActivityIndicator size="large" color="white" /> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Buat Akun</Text>}
                </TouchableOpacity>

                <TouchableOpacity className='mt-4' onPress={() => router.push('/login')}>
                    <Text className='text-slate-400 font-light' >Sudah punya akun? Masuk</Text>
                </TouchableOpacity>
            </ScrollView>

        </SafeAreaView>
    );
};

export default RegisterScreen;


import { uploadOneImageToStorage } from '@/api/api'; // atau sesuaikan path-mu
import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { db } from "@/lib/firebase/firebase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Type peserta (dari Firestore)
type Participant = {
    name: string;
    email: string;
    avatar?: string;
};

const DetailContestAdmin = () => {
    const { id } = useLocalSearchParams();
    const contestId: any = id
    const [loadingEdit, setLoadingEdit] = useState(false);
    const [contest, setContest] = useState<any>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editForm, setEditForm] = useState({
        desc: '',
        date: '',
        location: '',
        image: '',
    });



    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    console.log('iniiiii', contestId);

    useEffect(() => {
        const fetchContestDetail = async () => {
            try {
                setLoading(true);
                const docRef: any = doc(db, 'contest', contestId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const contestData: any = docSnap.data();
                    setContest(contestData);

                    // Ambil peserta dari userAudiens
                    const usersRef = collection(db, 'users');
                    const allUserDocs = await getDocs(usersRef);
                    const peserta: any = (contestData.userAudiens || []).map((name: string) => {
                        const found = allUserDocs.docs.find(user => {
                            const data = user.data();
                            return data.name === name || data.email === name;
                        });
                        return found ? {
                            name: found.data().name,
                            email: found.data().email,
                            avatar: found.data().image || 'https://i.pravatar.cc/150',
                        } : { name, email: name };
                    });

                    setParticipants(peserta);
                }
            } catch (err) {
                console.error("❌ Gagal mengambil detail lomba:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchContestDetail();
    }, [contestId]);

    const progress = contest?.userAudiens?.length && contest?.audiens
        ? Math.min(contest.userAudiens.length / contest.audiens, 1)
        : 0;

    const ParticipantCard = ({ participant }: { participant: Participant }) => (
        <View className="bg-white rounded-xl px-3 py-2 mb-4 flex-row items-center shadow shadow-black/10">
            <Image
                source={{ uri: participant.avatar || 'https://i.pravatar.cc/150' }}
                className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
                <Text className="text-base font-semibold">{participant.name}</Text>
                <Text className="text-sm text-gray-500">{participant.email}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center">
                <ActivityIndicator size="large" color="#FF840C" />
            </SafeAreaView>
        );
    }

    if (!contest) {
        return (
            <SafeAreaView className="flex-1 justify-center items-center px-3">
                <Text className="text-center text-gray-500">Lomba tidak ditemukan</Text>
            </SafeAreaView>
        );
    }

    const handleEdit = () => {
        async () => {
            try {
                const docRef = doc(db, 'contest', contestId);
                let updatedImageUrl = contest.image;

                // ✅ Jika gambar diubah (URI lokal berbeda dari yang lama)
                if (editForm.image && editForm.image !== contest.image && editForm.image.startsWith('file')) {
                    const userStr = await AsyncStorage.getItem('user');
                    const currentUser = userStr ? JSON.parse(userStr) : null;
                    updatedImageUrl = await uploadOneImageToStorage(editForm.image, currentUser.uid);
                }

                await updateDoc(docRef, {
                    desc: editForm.desc,
                    date: editForm.date,
                    location: editForm.location,
                    image: updatedImageUrl,
                });

                setContest((prev: { desc: string; date: string; location: string; image: string }) => ({
                    ...prev,
                    ...editForm,
                    image: updatedImageUrl,
                }));
                setEditModalVisible(false);
                Alert.alert('Berhasil', 'Data lomba berhasil diperbarui');
            } catch (err) {
                console.error('Gagal update:', err);
                Alert.alert('Error', 'Gagal memperbarui lomba');
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 mb-10 py-12 px-3">
            <View className="flex-row justify-between items-center px-4 bg-slate-200 p-3 rounded-full mb-5">
                <ButtonBack colorIcon="#FF840C" />
                <Ionicons name="medal-outline" size={20} color="gray" />
            </View>
            <View>
                <View className="h-52 mb-5">
                    <Image
                        className="w-full h-full rounded-3xl"
                        source={{ uri: contest.image }}
                        resizeMode="cover"
                    />
                </View>

                <View className="flex-row justify-end">
                    <TouchableOpacity onPress={() => {
                        setEditForm({
                            desc: contest.desc || '',
                            date: contest.date || '',
                            location: contest.location || '',
                            image: contest.image || '', // tambahkan ini
                        });

                        setEditModalVisible(true);
                    }}>
                        <Ionicons name="create-outline" size={30} color="#FF840C" />
                    </TouchableOpacity>
                </View>


                <View >


                    <View className="mb-5" >
                        <Text className="text-gray-400 text-sm">Deskripsi</Text>
                        <Text>{contest.desc}</Text>
                    </View>

                    <View className="mb-5" >
                        <Text className="text-gray-400 text-sm">Tanggal Mulai</Text>
                        <Text className="text-base">{contest.date}</Text>
                    </View>

                    <View className="mb-5" >
                        <Text className="text-gray-400 text-sm">Peserta</Text>
                        <View className="flex-row justify-between">
                            <Text className="text-sm text-gray-800">
                                {contest.userAudiens?.length || 0} / {contest.audiens}
                            </Text>
                            <Text className="text-sm text-gray-800">
                                {Math.round(progress * 100)}%
                            </Text>
                        </View>
                        <View className="h-4 bg-gray-200 rounded-full overflow-hidden mt-1">
                            <View
                                className="h-full bg-primaryOrange"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </View>
                    </View>

                    <View className="mb-5" >
                        <Text className="text-gray-400 text-sm">Lokasi</Text>
                        <Text className="text-base">{contest.location}</Text>
                    </View>

                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="flex-1">
                            <TextInput
                                placeholder="Cari peserta..."
                                placeholderTextColor={'gray'}
                                value={query}
                                onChangeText={setQuery}
                                className="bg-white p-3 rounded-full shadow shadow-black/10"
                            />
                        </View>

                        <MaterialCommunityIcons
                            name="progress-download"
                            size={33}
                            color="black"
                        />
                    </View>


                </View>
            </View>

            <FlatList
                data={filteredParticipants}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => <ParticipantCard participant={item} />}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">
                        Peserta tidak ditemukan
                    </Text>
                }
            />

            <Modal
                visible={editModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-black/40 px-4">
                    <View className="bg-white w-full rounded-xl p-4">
                        <Text className="text-lg font-semibold mb-4 text-center">Edit Lomba</Text>

                        {/* Gambar */}
                        <TouchableOpacity
                            onPress={async () => {
                                const result = await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                    quality: 1,
                                });

                                if (!result.canceled) {
                                    const uri = result.assets[0].uri;
                                    setEditForm(prev => ({ ...prev, image: uri }));
                                }
                            }}
                            className="mb-4 w-full h-40 rounded-xl justify-center items-center border-2 border-dashed border-gray-400 relative"
                        >
                            {editForm.image ? (
                                <>
                                    <Image
                                        source={{ uri: editForm.image }}
                                        className="w-full h-full rounded-xl"
                                        resizeMode="cover"
                                    />
                                    <View className="absolute bottom-2 right-2 bg-white p-1 rounded-full">
                                        <Ionicons name="camera" size={20} color="black" />
                                    </View>
                                </>
                            ) : (
                                <Ionicons name="image-outline" size={32} color="gray" />
                            )}
                        </TouchableOpacity>

                        {/* Deskripsi */}
                        <Text className="text-gray-500 mb-1">Deskripsi</Text>
                        <TextInput
                            className="border p-2 rounded-lg mb-3"
                            value={editForm.desc}
                            onChangeText={(text) => setEditForm({ ...editForm, desc: text })}
                        />

                        {/* Tanggal */}
                        <Text className="text-gray-500 mb-1">Tanggal</Text>
                        <TextInput
                            className="border p-2 rounded-lg mb-3"
                            value={editForm.date}
                            onChangeText={(text) => setEditForm({ ...editForm, date: text })}
                        />

                        {/* Lokasi */}
                        <Text className="text-gray-500 mb-1">Lokasi</Text>
                        <TextInput
                            className="border p-2 rounded-lg mb-4"
                            value={editForm.location}
                            onChangeText={(text) => setEditForm({ ...editForm, location: text })}
                        />

                        {/* Tombol Aksi */}
                        <View className="flex-row justify-between">
                            <TouchableOpacity
                                onPress={() => setEditModalVisible(false)}
                                className="px-4 py-2 bg-gray-300 rounded-lg"
                            >
                                <Text>Batal</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={async () => {
                                    try {
                                        const docRef = doc(db, 'contest', contestId);
                                        let updatedImageUrl = contest.image;

                                        // ✅ Jika gambar diubah (URI lokal berbeda dari yang lama)
                                        if (editForm.image && editForm.image !== contest.image && editForm.image.startsWith('file')) {
                                            const userStr = await AsyncStorage.getItem('user');
                                            const currentUser = userStr ? JSON.parse(userStr) : null;
                                            updatedImageUrl = await uploadOneImageToStorage(editForm.image, currentUser.uid);
                                        }

                                        await updateDoc(docRef, {
                                            desc: editForm.desc,
                                            date: editForm.date,
                                            location: editForm.location,
                                            image: updatedImageUrl,
                                        });

                                        setContest((prev: { desc: string; date: string; location: string; image: string }) => ({
                                            ...prev,
                                            ...editForm,
                                            image: updatedImageUrl,
                                        }));
                                        setEditModalVisible(false);
                                        Alert.alert('Berhasil', 'Data lomba berhasil diperbarui');
                                    } catch (err) {
                                        console.error('Gagal update:', err);
                                        Alert.alert('Error', 'Gagal memperbarui lomba');
                                    }
                                }}
                                className="px-4 py-2 bg-primaryOrange rounded-lg"
                            >
                                <Text className="text-white">Simpan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


        </SafeAreaView>
    );
};

export default DetailContestAdmin;

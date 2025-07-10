
import { sendNotificationToRole } from "@/api/api";
import ButtonPrimary from "@/components/elements/Button/ButtonPrimary";
import ButtonBack from "@/components/elements/buttonBack/ButtonBack";
import { db } from "@/lib/firebase/firebase";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams } from "expo-router";
import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Image,
    SafeAreaView,
    Text,
    TextInput,
    View,
} from "react-native";

// Type peserta (dari Firestore)
type Participant = {
    name: string;
    email: string;
    image?: string;
};

const DetailContestAdmin = () => {
    const { id } = useLocalSearchParams();
    const contestId: any = id

    const [contest, setContest] = useState<any>(null);
    const [userEmail, setUserEmail] = useState('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [dataUser, setDataUser]: any = useState();

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        const fetchUser = async () => {

            const userStr = await AsyncStorage.getItem('user');
            const user = userStr ? JSON.parse(userStr) : null;
            setUserEmail(user?.email || '');
            setDataUser(user);
        };
        fetchUser();
    }, []);


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
                            image: found.data().image || 'https://i.primage.cc/150',
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
                source={{ uri: participant.image || 'https://i.pravatar.cc/150' }}
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

    const handleJoinContest = async () => {
        try {
            const contestRef = doc(db, 'contest', contestId);

            if (!contest) return;

            const sudahDaftar = contest.userAudiens?.includes(userEmail);
            if (sudahDaftar) return;

            const updatedUserAudiens = [...(contest.userAudiens || []), userEmail];

            // Update ke Firestore
            await updateDoc(contestRef, {
                userAudiens: updatedUserAudiens,
            });

            await sendNotificationToRole('admin', `${userEmail} telah bergabung di lomba ${contest.desc}!`);
            await addDoc(collection(db, 'notifications'), {
                title: 'Laporan Baru',
                body: ` ${dataUser?.name} Telah bergabung di lomba ${contest.desc}!`,
                toRole: 'admin',
                typeNotif: 'contest',
                userName: dataUser?.name || 'User',
                image: dataUser?.image || 'image empty',
                fromUid: dataUser?.uid,
                contestId: contestId, // ✅ ID laporan dibawa ke notifikasi
                createdAt: new Date().toISOString(),
                read: false,
            });

            const docSnap = await getDoc(contestRef);
            // ✅ Update state lokal agar UI ikut berubah
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
                    image: found.data().image || 'https://i.primage.cc/150',
                } : { name, email: name };
            });

            setParticipants(peserta);

        } catch (err) {
            console.error('❌ Gagal daftar lomba:', err);
        }
    };

    const sudahDaftar: any = contest.userAudiens?.includes(userEmail);
    console.log('cukimai', id);

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

                    <View className="flex-row justify-start mb-4">
                        <ButtonPrimary disabled={sudahDaftar} className={`py-2 px-4 rounded-xl ${sudahDaftar ? 'bg-slate-400' : 'bg-primaryNavy'} `} text={sudahDaftar ? "Anda sudah daftar" : "Daftar Sekarang"} onPress={handleJoinContest} />
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
        </SafeAreaView>
    );
};

export default DetailContestAdmin;

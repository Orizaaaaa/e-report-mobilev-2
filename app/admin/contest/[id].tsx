
import { db } from "@/lib/firebase/firebase";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
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
    avatar?: string;
};

const DetailContestAdmin = () => {
    const { id } = useLocalSearchParams();
    const contestId: any = id

    const [contest, setContest] = useState<any>(null);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);

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

    return (
        <SafeAreaView className="flex-1 mb-10 py-12 px-3">
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
                        <Text className="text-gray-400 text-sm">Nama Lomba</Text>
                        <Text className="text-lg font-semibold">{contest.desc}</Text>
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
                        <Text className="text-gray-400 text-sm">Deskripsi</Text>
                        <Text>{contest.desc}</Text>
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

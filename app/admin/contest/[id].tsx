import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

type Participant = {
    id: string;
    name: string;
    email: string;
    lomba: string;
    status: string;
    avatar: string;
};

// Dummy data awal (anggap total data ada 30 tapi kita load per 10)
const allParticipants: Participant[] = Array.from({ length: 30 }, (_, index) => ({
    id: String(index + 1),
    name: `Peserta ${index + 1}`,
    email: `peserta${index + 1}@example.com`,
    lomba: index % 2 === 0 ? 'Lari 100m' : 'Catur',
    status: index % 3 === 0 ? 'Terverifikasi' : 'Belum Verifikasi',
    avatar: `https://i.pravatar.cc/150?img=${index + 1}`,
}));

const DetailContestAdmin = () => {

    const totalPeserta = 1000;
    const pesertaSaatIni = 700;
    const progress = Math.min(pesertaSaatIni / totalPeserta, 1);


    const PAGE_SIZE = 10;
    const [query, setQuery] = useState('');
    const [visibleData, setVisibleData] = useState<Participant[]>([]);
    const [page, setPage] = useState(1);

    const filteredData = allParticipants.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
    );

    useEffect(() => {
        setVisibleData(filteredData.slice(0, PAGE_SIZE));
        setPage(1);
    }, [query]);

    const loadMore = () => {
        const nextPage = page + 1;
        const start = 0;
        const end = nextPage * PAGE_SIZE;
        const nextData = filteredData.slice(start, end);
        if (nextData.length > visibleData.length) {
            setVisibleData(nextData);
            setPage(nextPage);
        }
    };

    const ParticipantCard = ({ participant }: any) => (
        <View className="bg-white rounded-xl px-3 py-2 mb-4 flex-row items-center shadow shadow-black/10">
            <Image
                source={{ uri: participant.avatar }}
                className="w-12 h-12 rounded-full mr-4"
            />
            <View className="flex-1">
                <Text className="text-base font-semibold">{participant.name}</Text>
            </View>
        </View>
    );

    return (
        <SafeAreaView className="flex-1 mb-10 py-12 px-3" >

            <View >

                <View className="h-52">
                    <Image
                        className="w-full h-full rounded-3xl"
                        source={require('../../../assets/images/study1.png')}
                        resizeMode="cover"
                    />
                </View>

                <View className="mt-7" >
                    <View className="mb-5" >
                        <Text className="text-gray-400 text-sm" >Nama Lomba</Text>
                        <Text>Lomba Mancing </Text>
                    </View>
                    <View className="mb-5" >
                        <Text className="text-gray-400 text-sm" >Tanggal Mulai Lomba</Text>
                        <Text>23 Februari 2023 </Text>
                    </View>

                    <View className="mb-5" >
                        <View className="flex-row justify-between mb-1">

                            <Text className="text-sm text-gray-800">
                                Peserta: {pesertaSaatIni} / {totalPeserta}
                            </Text>

                            <Text className="text-sm text-gray-800">
                                {Math.round(progress * 100)}%
                            </Text>
                        </View>

                        <View className="h-4 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-primaryOrange"
                                style={{ width: `${progress * 100}%` }}
                            />
                        </View>
                    </View>

                    <View className="mb-5" >
                        <Text className="text-gray-400" >Deskripsi</Text>
                        <Text>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ea animi aut dicta voluptates maxime error ipsam amet unde placeat vero ipsa sint adipisci id fugit repudiandae, beatae quasi totam impedit!</Text>
                    </View>

                    <View className="flex-row items-center gap-2 mb-4">
                        <View className="flex-1">
                            <TextInput
                                placeholder="Cari peserta..."
                                value={query}
                                onChangeText={setQuery}
                                className="bg-white p-3 rounded-full shadow shadow-black/10"
                            />
                        </View>

                        <MaterialCommunityIcons name="progress-download" size={33} color="black" />
                    </View>


                </View>

            </View>
            <FlatList
                className=""
                data={visibleData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <ParticipantCard
                        participant={item}
                    />
                )}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                ListEmptyComponent={
                    <Text className="text-center text-gray-500 mt-10">Peserta tidak ditemukan</Text>
                }
            />

        </SafeAreaView>
    );
};

export default DetailContestAdmin;

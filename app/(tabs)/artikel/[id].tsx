import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Dimensions, Image, Linking, ScrollView, Text, View } from 'react-native';

const dummyData: Record<string, {
    title: string;
    content: string;
    images: any[];
    location?: {
        latitude: number;
        longitude: number;
    };
}> = {
    "1": {
        title: "Cara Menyikat Gigi Yang Baik dan Benar Untuk Seluruh Keluarga",
        content: `Kita mungkin sudah menyikat gigi secara teratur, tapi apakah kita sudah melakukannya dengan benar? Simak cara menyikat gigi dengan benar, untuk Anda dan keluarga Anda!

Kebersihan gigi dan mulut memiliki peranan penting dalam meningkatkan kesehatan Anda secara keseluruhan. Dari bayi hingga manula, menjaga kebersihan gigi dan mulut sangatlah penting.

Tips Menggosok Gigi:
- Dua kali sehari selama 2 menit.
- Gunakan pasta gigi fluoride.
- Gunakan sikat gigi yang tepat.

Langkah-langkah Menyikat Gigi Yang Benar:
1. Tempatkan sikat gigi Anda pada sudut 45 derajat ke gusi.
2. Gerakkan sikat ke depan dan ke belakang dengan perlahan.
3. Sikat permukaan luar, dalam, dan permukaan mengunyah.
4. Sikat lidah Anda untuk mengurangi risiko bakteri.
5. Bilas mulut satu–dua kali saja agar fluoride tetap ada.`,
        images: require('../../../assets/images/artikle3.avif'),
    },
    "2": {
        title: "Apakah ibu hamil perlu rutin periksa gigi ?",
        content: `Di masa kehamilan , bukan hanya fisik dan mental yang harus diperhatikan, namun  kesehatan gigi dan mulut juga harus di perhatikan. Karena penyakit pada gigi dan mulut, seperti gigi berlubang dan radang gusi sering diderita oleh ibu hamil. Perawatan gigi dan mulut ibu hamil   bukan hanya ditujukan untuk kesehatan Ibu, melainkan juga untuk kesehatan janin. Masalah gigi dan mulut selama kehamilan dapat berdampak kelainan pertumbuhan janin hingga dapat menyebabkan kelainan kongenital, dan mempengaruhi proses persalinan.

Meningkatnya risiko gangguan gigi dan mulut  pada kehamilan disebabkan oleh adanya berbagai perubahan di dalam tubuh ibu hamil. Berikut beberapa masalah gigi dan mulut yang akan dialami ibu hamil :

1. Gingivitis, Periodontitis, dan Kegoyangan Gigi
Pregnancy gingivitis-periodontitis adalah penyakit periodontal yang dapat terjadi  pada beberapa ibu hamil. Terjadi inflamasi pada jaringan periodontal dan hiperplasia gingiva. Gusi membengkak dan mudah berdarah ini terutama disebabkan oleh peningkatan hormon estrogen. Peningkatan sirkulasi estrogen menyebabkan peningkatan permeabilitas kapiler yang meningkatkan kecenderungan paparan ibu hamil pada gingivitis. Gingivitis yang tidak terawat dapat berkembang menjadi periodontitis dan dapat menyebabkan gigi goyang. Penanganan yang dapat dilakukan adalah dengan melakukan kontrol plak dan karang gigi. Jika diperlukan dapat diberikan perawatan scaling, dan root planning. Penggunaan obat kumur, seperti chlorhexidine 0,12%, untuk mencegah gingivitis dan periodontitis yang dimasukan ke dalam kategori B menurut Food and Drug Administration dan dianggap aman digunakan oleh Ibu hamil, namun tidak di sarankan untuk ibu menyusui.

2. Oral Pregnancy Tumor
Oral pregnancy tumor atau disebut  juga dengan granuloma kehamilan atau epulis gravidarum, merupakan benjolan pada gingiva yang jinak. Terutama disebabkan karena kebersihan mulut yang buruk. Faktor penyebab lainnya adalah trauma yang menyebabkan pecahnya pembuluh darah, peningkatan hormon estrogen dan progesterone, dan infeksi virus. Kelainan ini dapat dicegah dengan pemeliharaan kesehatan gingiva yang baik dan benar.

3. Karies Dentin
Peningkatan kebutuhan kalsium pada ibu hamil terjadi pada masa kehamilan, sampai  masa menyusui. Peningkatan ini terjadi karena kalsium yang berasal dari ibu, diambil untuk kebutuhan perkembangan janin. Simpanan zat kalsium yang terdapat di tulang dan gigi ibu hamil yang terserap saat terjadi defisiensi, menyebabkan menurunnya kekuatan matriks anorganik penyusun gigi. Sehingga gigi ibu hamil akan cenderung mudah mengalami kerusakan gigi / lubang gigi. Serta peningkatan hormon progesterone pada masa kehamilan menyebabkan penurunan level plasma bikarbonat dan menyebabkan penurunan pH saliva, sehingga kondisi rongga mulut ibu hamil menjadi lebih asam. pH saliva adalah salah satu faktor utama untuk menjaga stabilitas enamel. Penurunan pH saliva juga meningkatkan pertumbuhan bakteri kariogenik sehingga menyebabkan ibu hamil lebih mudah mengalami karies dentin karena demineralisasi enamel gigi.
Selain itu, ibu hamil yang banyak mengonsumsi gula atau mengalami mual muntah yang berlebihan, akan mudah mengalami pertumbuhan bakteri kariogenik di dalam rongga mulut. Untuk mencegah penurunan pH yang terjadi karena peningkatan hormon ini, ibu hamil disarankan membatasi asupan makanan yang manis dan menyikat gigi secara rutin menggunakan pasta gigi mengandung fluoride, untuk menjaga kebersihan rongga mulut dan memperkuat enamel gigi.

4. Infeksi Jaringan Pendukung Gigi
Lubang gigi/ Karies gigi yang dibiarkan dan semakin dalam akan menyebabkan sakit gigi, dan kemungkinan infeksi terus berlanjut ke jaringan pendukung gigi. Dapat menyebabkan abses pada gigi, serta dapat menyebabkan kegoyangan pada gigi. Pada beberapa kasus gigi lubang yang parah diperlukan perawatan yang melibatkan pemeriksaan foto rontgen namun sebaiknya tidak dilakukan pada ibu hamil karena menyebabkan janin terpapar radiasi.

Tips untuk ibu hamil, untuk tetap menjaga kesehatan gigi dan mulut

a. Menggosok gigi secara teratur 2 kali sehari dengan pasta gigi berfloride, membersihkan sela gigi dengan benang gigi, kumur obat kumur chlorhexidine 0,12%, untuk mencegah gingivitis dan periodontitis, serta membiasakan kumur air putih setelah makan dan makan makanan bergizi dan kaya vitamin.

b. Kontrol rutin ke dokter gigi untuk pemeriksaan gigi dan mulut, bila perlu pembersihan karang gigi atau penambalan gigi. Tindakan penambalan  menggunakan glass-ionomer cement, resin komposit, inlay/onlay, atau mahkota porcelain. Sedangkan pencabutan gigi pada ibu hamil hanya dilakukan apabila sangat diperlukan dan disarankan untuk dilakukan pada trimester II, yaitu usia kehamilan 4-6 bulan.

c. Pemberian obat antibiotik dan antinyeri kategori B.

d. Mengkonsumsi makanan dan minuman kaya vitamin, vitamin tambahan ibu hamil. Serta tambahan tablet kalsium/ susu tinggi kalsium untuk menjaga kalsium ibu agar tetap tercukupi dan juga membentuk tulang dan gigi janin yang sehat dan kuat, juga memberi perlindungan kepada bayi. Agar terhindar dari berbagai infeksi dan gangguan selama tumbuh kembang.

e. Mengonsumsi permen karet rendah sukrosa (xilitol). Kondisi asam rongga mulut ibu hamil, karena faktor morning sickness menyebabkan demineralisasi yang mempercepat gigi berlubang.

Rangkuman Anjuran Perawatan Gigi dan Mulut pada Ibu Hamil

Trimester Pertama
– Pembatasan prosedur perawatan gigi hanya untuk perawatan yang sangat mendesak
– Menganjurkan untuk menjaga kebersihan gigi dan mulut
– Perawatan gigi dan mulut diutamakan pada profilaksis penyakit periodontal dan penanganan kegawatdaruratan
– Hindari penggunaan x-ray untuk pemeriksaan rutin dan hanya dilakukan ketika sangat dibutuhkan

Trimester Kedua
– Tetap melakukan kebiasaan rutin dalam menjaga kebersihan gigi dan mulut dan kontrol plak gigi
– Berbagai prosedur perawatan gigi aman untuk dilakukan pada trimester ini, jika diperlukan dapat dilakukan perawatan scaling, root planning, kuretase, penambalan gigi, perawatan saluran akar, dan pencabutan gigi
– Penggunaan x-ray tetap dihindari dan hanya dilakukan jika dibutuhkan dengan prosedur dan proteksi yang baik.

Trimester Ketiga
– Tetap melakukan  kebiasaan rutin dalam menjaga kebersihan gigi dan mulut dan kontrol plak gigi
– Scaling, root planning , kuretase, dan penanganan penyakit gigi dan mulut lain yang mendesak boleh dilakukan jika perlukan. Penggunaan x-ray tetap dihindari dan hanya dilakukan jika dibutuhkan dengan prosedur dan proteksi yang baik. Pertimbangkan untuk menunda prosedur perawatan gigi dan mulut yang tidak mendesak hingga pasca persalinan, jika usia kehamilan sudah diatas 32 minggu.`,
        images: require('../../../assets/images/artikle1.jpeg'),

    },
    "3": {
        title: "Kapan Waktu yang Tepat Bawa Anak ke Dokter Gigi?",
        content: `Kesehatan gigi dan mulut anak merupakan aspek penting dalam pertumbuhan dan perkembangan mereka. Salah satu pertanyaan yang sering muncul di benak orangtua adalah kapan waktu yang tepat untuk membawa anak ke dokter gigi. Dalam artikel ini, kita akan membahas hal tersebut serta pentingnya pemeriksaan gigi secara rutin sejak usia dini.

Pentingnya Kunjungan ke Dokter Gigi
Pemeriksaan gigi secara rutin tidak hanya membantu menjaga kesehatan gigi dan mulut anak, tetapi juga dapat mencegah masalah kesehatan yang lebih serius di kemudian hari. Menurut Dr. drg. Indra Bramanti, Sp.KGA (K).,M.Sc, seorang dosen di Fakultas Kedokteran Gigi Universitas Gadjah Mada (FKG UGM) yang menciptakan alat inovatif untuk mengatasi rasa cemas pada anak saat berkunjung ke dokter gigi. Ia mengatakan kunjungan pertama anak ke dokter gigi sebaiknya dilakukan sekitar usia 1 tahun, atau saat gigi pertama mereka muncul. Hal ini penting untuk memberikan pengalaman positif dan mengurangi kecemasan mereka.

Usia yang dianjurkan

Usia 1 Tahun: Seperti yang disebutkan oleh drg. Indra, usia 1 tahun adalah waktu yang tepat untuk kunjungan pertama ke dokter gigi. Pada usia ini, anak sudah mulai memiliki gigi susu yang pertama dan merupakan kesempatan baik bagi orangtua untuk berkonsultasi mengenai perawatan gigi yang tepat.
Setiap 6 Bulan: Setelah kunjungan pertama, disarankan agar anak melakukan pemeriksaan gigi minimal dua kali setahun. Ini membantu mendeteksi masalah gigi sejak dini, seperti gigi berlubang atau pertumbuhan yang tidak normal.
Ketika Gigi Berlubang atau Nyeri: Jika anak mengeluhkan nyeri gigi, gigi terlihat berlubang, atau ada tanda-tanda infeksi, segera bawa mereka ke dokter gigi. Tindakan cepat sangat penting untuk mengatasi masalah sebelum berkembang lebih serius.
Saat Gigi Permanen Muncul: Ketika gigi permanen mulai tumbuh, yaitu sekitar usia 6 tahun, penting untuk melakukan pemeriksaan lebih rutin. Gigi permanen rentan terhadap kerusakan, dan dokter gigi dapat memberikan nasihat mengenai kebersihan mulut yang baik.
Mengatasi Ketakutan Anak
Banyak anak merasa takut atau cemas ketika harus pergi ke dokter gigi. Sebagai orangtua, penting untuk mempersiapkan anak dengan cara yang menyenangkan. Ceritakan pengalaman positif dan tunjukkan bahwa dokter gigi adalah teman yang membantu menjaga kesehatan gigi mereka. “Dengan penggunaan alat inovatif yang kami kembangkan, kami berharap dapat membantu anak-anak merasa lebih tenang dan nyaman selama pemeriksaan. Menciptakan suasana yang ramah adalah kunci untuk mengatasi rasa cemas mereka,” ucap drg. Indra.

Kesimpulan
Membawa anak ke dokter gigi sejak dini adalah langkah penting dalam menjaga kesehatan gigi mereka. Dengan mengikuti rekomendasi di atas, orangtua dapat membantu anak mereka mengembangkan kebiasaan baik yang akan menguntungkan kesehatan gigi dan mulut mereka seumur hidup. Jangan ragu untuk berkonsultasi dengan dokter gigi mengenai pertanyaan atau kekhawatiran yang Anda miliki. Ingatlah, kesehatan gigi yang baik dimulai sejak usia dini. Dengan pengetahuan dan perhatian yang tepat, kita dapat memastikan anak-anak kita tumbuh dengan senyum yang sehat dan percaya diri.

Dengan menekankan pentingnya kesehatan gigi dan mulut anak sebagai bagian dari kesehatan secara keseluruhan turut mendukung Tujuan Pembangunan Berkelanjutan (SDGs) tujuan ke-3. Selain itu pendidikan tentang pentingnya perawatan gigi sejak dini juga turut mendukung SDGs tujuan ke-4 Pendidikan Berkualitas. Dengan memastikan semua anak mendapat akses perawatan gigi yang tepat turut berkontribusi mendukung SDGs tujuan ke-10 Mengurangi Ketidaksetaraan. Kerjasama antara orang tua dan profesional kesehatan (seperti dokter gigi) untuk mencapai tujuan kesehatan yang lebih baik bagi anak-anak juga turut mendukung SDGs tujuan ke-17 Kemitraan untuk Mencapai Tujuan.`,
        images: require('../../../assets/images/artikle2.jpg'),
    },
};

export default function DetailArtikel() {
    const { width } = Dimensions.get('window');
    const { id } = useLocalSearchParams();
    const [activeIndex, setActiveIndex] = useState(0);

    const artikel = dummyData[id as string];

    const openInGoogleMaps = () => {
        if (artikel?.location) {
            const { latitude, longitude } = artikel.location;
            const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
            Linking.openURL(url).catch(err => console.error('Gagal membuka Google Maps:', err));
        } else {
            alert('Lokasi tidak tersedia');
        }
    };

    if (!id) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-gray-500">Memuat artikel...</Text>
            </View>
        );
    }

    if (!artikel) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text className="text-lg text-red-500">Artikel tidak ditemukan.</Text>
            </View>
        );
    }

    return (
        <ScrollView className="pt-16 px-4 bg-white" style={{ width }} >
            <View className="mb-40">

                <Text className="text-2xl font-bold mb-4">{artikel.title}</Text>
                <View className='flex-row items-center mb-4 w-full h-52  overflow-hidden mt-3'>
                    <Image
                        className='w-full h-full mr-2 mb-1 rounded-2xl'
                        source={artikel.images}
                        resizeMode='cover'
                    />
                </View>

                {artikel.content.split('\n').map((para, idx) => (
                    <Text key={idx} className="mt-2 text-base text-justify leading-relaxed">
                        {para.trim()}
                    </Text>
                ))}
            </View>


        </ScrollView>
    );
}

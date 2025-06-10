import CaraoselCard from '@/components/fragments/CaraoselCard/CaraoselCard'
import LayoutPage from '@/components/fragments/layout/layoutPage/LayoutPage'
import { Feather, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

type Props = {}

const index = (props: Props) => {
    const pages = [
        { label: 'REGULER', value: 'regular' as const },
        { label: 'PRIORITAS', value: 'prioritas' as const },
        { label: 'SELESAI', value: 'selesai' as const },

    ];
    const [activePage, setActivePage] = React.useState(pages[0].value);
    const imagesCaraosel = [
        require('../../../assets/images/demo.png'),
        require('../../../assets/images/study1.png'),
        require('../../../assets/images/demo.png'),
    ];
    return (
        <LayoutPage padding='p-0'>
            <View className="bg-primaryNavy pb-14 pt-12 px-3 relative overflow-hidden">
                {/* Decorative circles using original className, assuming NativeWind handles transforms */}
                <View className="absolute z-0 w-[400px] h-[400px] rounded-full bg-white/10 left-1/2 -translate-x-1/2 top-10" />
                <View className="absolute z-0 w-[300px] h-[300px] rounded-full bg-white/10 -right-20 top-1/3" />

                <View className="relative z-10">

                    <View className="flex-row justify-between items-center mt-3 py-3 px-5 bg-primaryWhite rounded-2xl">
                        {pages.map((page) => (
                            <TouchableOpacity
                                key={page.value}
                                className={`py-2 px-4 rounded-full shadow-2xl ${activePage === page.value ? 'bg-primaryOrange' : ''}`}
                                onPress={() => setActivePage(page.value)}
                            >
                                <Text className={activePage === page.value ? 'text-white' : 'text-black'}>
                                    {page.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>



                    <View className="relative z-10 mt-5 flex-row items-center justify-between gap-2  ">
                        <View className="flex-1 h-14 px-3  flex-row items-center gap-2 bg-white rounded-full">
                            <Feather name="search" size={24} color="#FF840C" />
                            <TextInput
                                className="flex-1 text-gray-800"
                                placeholder="Cari..."

                            />
                        </View>

                        <View >
                            <View className=" mx-2 border-white rounded-xl">
                                <MaterialIcons name="notifications-none" size={25} color="#FF840C" />
                            </View>
                        </View>
                        <View >
                            <Feather name="menu" size={25} color="#FF840C" />
                        </View>
                    </View>


                </View>
            </View>

            {/* View pembungkus konten dari kode asli Anda */}
            <View className="bg-white rounded-t-3xl p-4 -mt-6">
                <Text>
                    <CaraoselCard imageCaraosel={imagesCaraosel} typeReport='REGULER' />
                </Text>
            </View>
        </LayoutPage>
    )
}

export default index
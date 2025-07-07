import { AntDesign, Feather, FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Dimensions, Image, Linking, Text, TouchableOpacity, View } from 'react-native'
import Carousel from 'react-native-reanimated-carousel'

type Props = {
    imageCaraosel: string[]
    desc: string
    location: {
        adress: string
        lat: number
        long: number
    }
    bukti_penyelesaian?: string
    typeReport: string
    status: string
    createdAt?: string
    reason?: string
    userName: string
    updatedAt: string
    anonim: boolean
}

const DetailReport = ({ imageCaraosel, desc, location, typeReport, status, createdAt, bukti_penyelesaian, reason, userName, updatedAt, anonim }: Props) => {
    const { width } = Dimensions.get('window')
    const [activeIndex, setActiveIndex] = useState(0)
    const [showImage, setShowImage] = useState(false);

    const openInGoogleMaps = () => {
        if (location?.lat && location?.long) {
            const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.long}`
            Linking.openURL(url).catch(err => console.error('Gagal membuka Google Maps:', err))
        } else {
            alert('Pengirim tidak mencantumkan latitude dan longtitude')
        }
    }

    const formatDate = (isoDate?: string) => {
        if (!isoDate) return ''
        const date = new Date(isoDate)
        return date.toLocaleString('id-ID', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    const showButtonSelesai = () => {
        setShowImage(prev => !prev);
    };


    const statusDisplay = (value: any) => {
        if (value === 'tidak valid') {
            return (
                <View className='flex-1'>
                    <Text className='text-sm font-thin'>Status aduan ini di tandai sebagai</Text>
                    <Text className='text-sm font-medium'>
                        Tidak valid<Text className='font-light'> oleh</Text> tim pemerintah
                    </Text>
                    {reason && <Text className='text-sm font-light'>Dengan alasan {reason}</Text>}
                    {updatedAt && (
                        <Text className='text-sm font-light'>{formatDate(updatedAt)}</Text>
                    )}
                </View>)
        } else if (value === 'selesai') {
            return (
                <View className='flex-1'>
                    <Text className='text-sm font-thin'>Status aduan ini adalah</Text>
                    <Text className='text-sm font-medium'>
                        Selesai,<Text className='font-light'> di selesaikan oleh</Text> tim pemerintah
                    </Text>
                    {updatedAt && (
                        <Text className='text-sm font-light'>{formatDate(updatedAt)}</Text>
                    )}
                </View>
            )
        } else if (value === 'di proses') {
            return (
                <View className='flex-1'>
                    <Text className='text-sm font-thin'>Status aduan ini adalah</Text>
                    <Text className='text-sm font-medium'>
                        Di proses,<Text className='font-light'> oleh</Text> tim pemerintah
                    </Text>
                    {updatedAt && (
                        <Text className='text-sm font-light'>{formatDate(updatedAt)}</Text>
                    )}
                </View>)
        } else if (value === 'menunggu') {
            return (
                <View className='flex-1'>
                    <Text className='text-sm font-thin'>Status aduan ini adalah</Text>
                    <Text className='text-sm font-medium'>
                        Menunggu,<Text className='font-light'> konfirmasi dari</Text> tim pemerintah
                    </Text>
                    {updatedAt && (
                        <Text className='text-sm font-light'>{formatDate(updatedAt)}</Text>
                    )}
                </View>
            )
        }
    }

    return (
        <View>
            <View className='my-7' style={{ position: 'relative', width: width - 29, height: 190 }}>
                <Carousel
                    loop
                    width={width - 23}
                    height={200}
                    data={imageCaraosel}
                    scrollAnimationDuration={100}
                    onSnapToItem={index => setActiveIndex(index)}
                    renderItem={({ item }: any) => (
                        <Image
                            source={{ uri: item }}
                            style={{ width: '100%', height: 200, borderRadius: 20 }}
                            resizeMode='cover'
                        />
                    )}
                />

                <View
                    style={{
                        position: 'absolute',
                        bottom: 10,
                        left: 0,
                        right: 0,
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {imageCaraosel.map((_, index) => (
                        <View
                            key={index}
                            style={{
                                width: index === activeIndex ? 16 : 8,
                                height: 8,
                                borderRadius: 4,
                                marginHorizontal: 4,
                                backgroundColor: index === activeIndex ? '#FB923C' : '#D1D5DB',
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: 0.3,
                                shadowRadius: 1,
                                elevation: 2,
                            }}
                        />
                    ))}
                </View>
            </View>

            <View>
                <Text className='text-gray-500 font-light mb-1'>Permasalahan</Text>
                <Text className='font-light'>{desc}</Text>

                <View className='my-3'>
                    <Text className='text-lg font-medium'>Lokasi Aduan</Text>
                </View>
            </View>

            <View className='flex-row justify-between items-start'>
                <View className='flex-1 pr-2'>
                    {/* Alamat selalu tampil */}
                    <Text className='font-light'>
                        {location?.adress || 'Alamat tidak tersedia'}
                    </Text>

                    {/* Tampilkan koordinat jika lat & long ada */}
                    {typeof location?.lat === 'number' && typeof location?.long === 'number' && (
                        <Text className='font-light text-sm mt-1 text-gray-400'>
                            Lat: {location.lat}, Long: {location.long}
                        </Text>
                    )}
                </View>

                {/* Icon map hanya muncul jika lat & long ada */}
                {typeof location?.lat === 'number' && typeof location?.long === 'number' && (
                    <TouchableOpacity className='ml-2' onPress={openInGoogleMaps}>
                        <FontAwesome5 name='map-marked-alt' size={20} color='#1E2A38' />
                    </TouchableOpacity>
                )}
            </View>




            <View className='my-3'>
                <Text className='text-lg font-medium'>Riwayat Status</Text>
            </View>

            <View className='flex-row justify-between items-end'>
                {statusDisplay(status)}

                <View className='items-end' >
                    <Text className={`py-1 px-2 border-2 ${typeReport === 'Reguler' ? 'border-primaryNavy text-primaryNavy' : 'border-primaryOrange text-primaryOrange'}  text-sm rounded-lg `}>
                        {typeReport?.toUpperCase()}
                    </Text>
                </View>
            </View>

            {anonim ?
                <View className='mt-7'>
                    <Text className='text-sm font-light'> Laporan ini di buat pada {formatDate(createdAt)}</Text>
                </View>
                :
                <View className='mt-7'>
                    <Text className='text-sm' >Laporan di buat oleh {userName}</Text>
                    {createdAt && (
                        <Text className='text-sm font-light'>{formatDate(createdAt)}</Text>
                    )}
                </View>}


            <View className='flex-row items-center justify-between bg-gray-200 rounded-2xl px-4 py-2 mt-7'>

                {/* Tidak Valid */}
                <View
                    className={`flex items-center px-2 py-1 rounded-lg ${status?.toLowerCase() === 'tidak valid' ? 'bg-primaryNavy' : ''
                        }`}
                >
                    <Feather name='x-circle' size={24} color={status?.toLowerCase() === 'tidak valid' ? 'white' : 'black'} />
                    <Text className={`text-sm ${status?.toLowerCase() === 'tidak valid' ? 'text-white' : 'text-primaryNavy'}`}>
                        Tidak valid
                    </Text>
                </View>

                {/* Menunggu */}
                <View
                    className={`flex items-center px-2 py-1 rounded-lg ${status?.toLowerCase() === 'menunggu' ? 'bg-primaryNavy' : ''
                        }`}
                >
                    <MaterialIcons name='pending-actions' size={24} color={status?.toLowerCase() === 'menunggu' ? 'white' : 'black'} />
                    <Text className={`text-sm ${status?.toLowerCase() === 'menunggu' ? 'text-white' : 'text-primaryNavy '}`}>
                        Menunggu
                    </Text>
                </View>

                {/* Diproses */}
                <View
                    className={`flex items-center px-2 py-1 rounded-lg ${status?.toLowerCase() === 'di proses' ? 'bg-primaryNavy' : ''
                        }`}
                >
                    <MaterialCommunityIcons
                        name='archive-cog-outline'
                        size={24}
                        color={status?.toLowerCase() === 'di proses' ? 'white' : 'black'}
                    />
                    <Text className={`text-sm ${status?.toLowerCase() === 'di proses' ? 'text-white' : 'text-primaryNavy'}`}>
                        Di proses
                    </Text>
                </View>

                {/* Selesai */}
                <View
                    className={`flex items-center px-2 py-1 rounded-lg ${status?.toLowerCase() === 'selesai' ? 'bg-primaryNavy' : ''
                        }`}
                >
                    <MaterialCommunityIcons
                        name='archive-check-outline'
                        size={24}
                        color={status?.toLowerCase() === 'selesai' ? 'white' : 'black'}
                    />
                    <Text className={`text-sm ${status?.toLowerCase() === 'selesai' ? 'text-white' : 'text-primaryNavy'}`}>
                        Selesai
                    </Text>
                </View>

            </View>

            {bukti_penyelesaian && (
                <View>
                    <TouchableOpacity
                        onPress={showButtonSelesai}
                        className='mt-7 flex-row items-center gap-3'
                    >
                        <Text className='text-gray-500 font-light text-sm'>
                            {showImage ? 'Tutup bukti penyelesaian' : 'Lihat bukti penyelesaian'}
                        </Text>
                        <AntDesign name={showImage ? 'caretup' : 'caretdown'} size={13} color="gray" />
                    </TouchableOpacity>

                    {showImage && (
                        <Image
                            className='mt-3'
                            source={{ uri: bukti_penyelesaian }}
                            style={{ width: '100%', height: 200, borderRadius: 20 }}
                            resizeMode='cover'
                        />
                    )}
                </View>
            )}



        </View>
    )
}

export default DetailReport

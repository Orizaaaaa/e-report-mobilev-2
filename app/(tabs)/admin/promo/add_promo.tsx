import { Feather } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Text, TouchableOpacity } from 'react-native'
import { View } from 'react-native-animatable'
import { ScrollView, TextInput } from 'react-native-gesture-handler'

type Props = {}

const add_promo = (props: Props) => {

    const [form, setForm] = useState({
        image: null,
        title: '',
        start_periode: '',
        end_periode: '',
        real_price: 0,
        price_promo: 0,
        des: ''

    });

    return (
        <ScrollView>
            <View className='p-5 mt-10' >
                <Text className='mb-3 text-gray-600' >Foto Promo</Text>
                <View className='flex justify-center items-center p-10 border-2 border-gray-200 rounded-xl' >
                    <Feather name="camera" size={24} color="#9ca3af" />
                </View>
            </View>

            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Judul Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.title}
                    onChangeText={(text) => setForm({ ...form, title: text })}
                />
            </View>

            {/* Start Periode */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Periode Mulai</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.start_periode}
                    onChangeText={(text) => setForm({ ...form, start_periode: text })}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            {/* End Periode */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Periode Selesai</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.end_periode}
                    onChangeText={(text) => setForm({ ...form, end_periode: text })}
                    placeholder="YYYY-MM-DD"
                />
            </View>

            {/* Real Price */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Harga Asli</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    keyboardType="numeric"
                    value={form.real_price.toString()}
                    onChangeText={(text) => setForm({ ...form, real_price: Number(text) })}
                />
            </View>

            {/* Price Promo */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Harga Promo</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    keyboardType="numeric"
                    value={form.price_promo.toString()}
                    onChangeText={(text) => setForm({ ...form, price_promo: Number(text) })}
                />
            </View>

            {/* Description */}
            <View className='px-5 mb-5'>
                <Text className='mb-1 text-gray-600'>Deskripsi</Text>
                <TextInput
                    className='p-3 border-2 border-gray-200 rounded-xl'
                    value={form.des}
                    onChangeText={(text) => setForm({ ...form, des: text })}
                    multiline
                    numberOfLines={4}
                />
            </View>

            <View className='flex justify-center items-center p-5' >
                <TouchableOpacity className='p-3 bg-[#FEDD3F] rounded-xl w-full' >
                    <Text className='text-center text-[#205072] font-medium' >Simpan</Text>
                </TouchableOpacity>
            </View>


        </ScrollView>
    )
}

export default add_promo
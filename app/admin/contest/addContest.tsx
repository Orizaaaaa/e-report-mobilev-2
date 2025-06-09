import ButtonPrimary from '@/components/elements/Button/ButtonPrimary'
import ButtonBack from '@/components/elements/buttonBack/ButtonBack'
import DescriptionInput from '@/components/elements/Input/DescriptionInput'
import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { SafeAreaView, ScrollView, Text, TextInput } from 'react-native'
import { View } from 'react-native-animatable'

type Props = {}

const addContest = (props: Props) => {
    const [form, setForm] = React.useState({ desc: '' });
    return (
        <SafeAreaView>
            <ScrollView className='pt-16 px-3'>
                <View className='flex-row items-center justify-between '>
                    <ButtonBack />
                    <Text className='text-lg font-medium'>Buat Lomba Baru</Text>
                    <Text>{''}</Text>
                </View>

                <View className='mt-7'>
                    <Text className='text-gray-500 mb-2'>Masukan Gambar Lomba</Text>
                    <View className='w-full  h-40 rounded-xl justify-center items-center border-2 border-dotted border-gray-400'>
                        <FontAwesome name="image" size={24} color="gray" />
                    </View>
                </View>

                <DescriptionInput
                    title='Masukan Deskripsi Lomba'
                    placeholderText='(Contoh) Lomba fotografi berhadiah... '
                    value={form.desc}
                    onChangeText={(text) => setForm(prev => ({ ...prev, desc: text }))}
                />

                <View className='flex-row justify-between w-full mt-7'>
                    <View className='w-[48%]'>
                        <Text className='mb-2 text-gray-500'>Jumlah Peserta</Text>
                        <TextInput className='border-2 border-gray-300 rounded-lg p-3 w-full' />
                    </View>
                    <View className='w-[48%]'>
                        <Text className='mb-2 text-gray-500'>Tanggal Mulai</Text>
                        <TextInput className='border-2 border-gray-300 rounded-lg p-3 w-full' />
                    </View>
                </View>

                <View className='mt-7 flex-row '>
                    <ButtonPrimary className='w-fit py-2 px-3 rounded-lg' text='Buat Lomba' onPress={() => {
                        console.log('tolol');
                    }} />
                </View>


            </ScrollView>
        </SafeAreaView>
    )
}

export default addContest
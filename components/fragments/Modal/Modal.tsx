import React from 'react'
import { Modal, View } from 'react-native'

type Props = {
    modalVisible: boolean
    onRequest: () => void
    children: React.ReactNode
}

const ModalCustom = ({ modalVisible, onRequest, children }: Props) => {
    return (
        <View className="flex-1 items-center justify-center bg-white">

            {/* Modal */}
            <Modal
                transparent
                animationType="fade"
                visible={modalVisible}
                onRequestClose={onRequest}
            >
                <View className="flex-1  items-center bg-black/50 mx-9 h-full">
                    <View className="bg-white p-6 rounded-2xl w-full items-center">
                        {children}
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default ModalCustom
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import React, { useRef } from 'react'

type Props = {
    children: React.ReactNode
    snap?: any
    onChange?: any
    ref: any
    index: number
}

const BottomSheetCustom = ({ children, snap, onChange, ref, index }: Props) => {
    const bottomSheetRef = useRef<BottomSheet>(null);

    return (
        <BottomSheet
            ref={ref}
            index={index}
            snapPoints={snap}
            onChange={onChange}
            enablePanDownToClose
        >
            <BottomSheetView className="p-4 ">
                {children}
            </BottomSheetView>
        </BottomSheet>
    )
}

export default BottomSheetCustom
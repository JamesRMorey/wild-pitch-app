import { StyleSheet, View, TouchableOpacity } from "react-native";
import ModalPopup from "./modal-popup";
import { COLOUR, SHADOW } from "../styles";
import { SETTING } from "../consts";
import { normalise } from "../functions/helpers";

type PropsType = { children: React.ReactNode, onClose: ()=>void, dismiss?: boolean }

export default function Modal({ children, onClose=()=>{}, dismiss=true } : PropsType) {

 
    return (
        <ModalPopup 
            visible={true} 
            onClose={onClose}
        >
            <TouchableOpacity 
                style={{ height: '100%' }} 
                onPress={onClose} 
                activeOpacity={dismiss ? 0.8 : 1}
            >
                <TouchableOpacity 
                    style={{ flex: 1, justifyContent: 'center', paddingBottom: SETTING.TOP_PADDING }} 
                    onPress={onClose} 
                    activeOpacity={dismiss ? 0.8 : 1}
                >
                    <View style={styles.modal}>
                        {children}
                    </View>
                </TouchableOpacity>
            </TouchableOpacity>
        </ModalPopup>
    )
}

const styles = StyleSheet.create({
    modal: {
        paddingHorizontal: normalise(30),
        paddingVertical: normalise(35),
        borderColor: COLOUR.white,
        backgroundColor: COLOUR.white,
        maxHeight: '100%',
        borderRadius: normalise(10),
        zIndex: 100,
        gap: normalise(15),
        ...SHADOW.lg
    },
})
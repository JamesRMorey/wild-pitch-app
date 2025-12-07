import { Modal, StyleSheet, TouchableOpacity } from "react-native";
import * as Animatable from 'react-native-animatable';
import { SETTING } from "../consts";
import { normalise } from "../utils/helpers";

type PropsType = { children: React.ReactNode, visible?: boolean, onClose: ()=>void, disabled?: boolean }

export default function ModalPopup({ children, visible=false, onClose=()=>{}, disabled=false } : PropsType) {
    
    return (
        <Modal 
            transparent 
            visible={visible}
        >
            <TouchableOpacity 
                activeOpacity={1} 
                onPress={onClose} 
                style={[
                    styles.overlay,
                ]} 
                disabled={disabled}
            >
                <TouchableOpacity activeOpacity={1} onPress={() => {}} disabled={disabled}>
                    <Animatable.View
                        useNativeDriver={true}
                        animation={'fadeIn'}
                    >
                        { children }
                    </Animatable.View>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1, 
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: normalise(20),
        paddingTop: SETTING.TOP_PADDING + normalise(30)
    }
})
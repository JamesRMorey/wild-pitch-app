import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { normalise } from "../../utils/helpers";
import { COLOUR, OPACITY, SHADOW, TEXT } from "../../styles";
import Icon from "../misc/icon";


export default function ActiveItemControls({ name, onPress } : { name: string, onPress: Function }) {

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => onPress()}
            activeOpacity={0.8}
        >
            <Text style={styles.text}>{name.slice(0,40)}{name.length > 40 && '...'}</Text>
            <Icon
                icon="close"
                size={normalise(22)}
                colour={COLOUR.black}
            />
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: normalise(5),
        backgroundColor: COLOUR.white,
        paddingRight: normalise(10),
        paddingLeft: normalise(15),
        paddingVertical: normalise(8),
        borderRadius: normalise(20),
        ...SHADOW.md
    },
    text: {
        ...TEXT.sm,
        ...TEXT.semiBold,
        color: COLOUR.black
    }
})
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY, TEXT } from "../../styles";
import { Ionicons as Icon } from '@react-native-vector-icons/ionicons';


export default function ActiveItemControls({ name, onPress } : { name: string, onPress: Function }) {

    return (
        <TouchableOpacity 
            style={styles.container}
            onPress={() => onPress()}
            activeOpacity={0.8}
        >
            <Text style={styles.text}>{name.slice(0,20)}...</Text>
            <Icon
                name="close"
                size={normalise(22)}
                color={COLOUR.white}
            />

        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
    container: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: normalise(5),
        backgroundColor: COLOUR.black + OPACITY[80],
        paddingRight: normalise(10),
        paddingLeft: normalise(15),
        paddingVertical: normalise(8),
        borderRadius: normalise(20),
    },
    text: {
        ...TEXT.sm,
        color: COLOUR.white
    }
})
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";

export default function Button ({ title, onPress, disabled=false, active=false } : { title: string, onPress: Function, disabled?: boolean, active?: boolean }) {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={styles.button}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Text style={styles.text}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOUR.black,
        paddingHorizontal: normalise(20),
        paddingVertical: normalise(10),
        borderRadius: normalise(50)
    },
    text: {
        color: COLOUR.white,
        ...TEXT.md,
        textAlign: 'center'
    }
})
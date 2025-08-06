import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";

export default function Button ({ title, onPress, disabled=false, active=false, style='standard' } : { title: string, onPress: Function, disabled?: boolean, active?: boolean, style?: string }) {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={[
                styles.button,
                style == 'large' && { paddingVertical: normalise(15) }
            ]}
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
        fontWeight: 600,
        textAlign: 'center'
    }
})
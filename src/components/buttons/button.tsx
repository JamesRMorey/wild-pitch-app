import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";

type PropsType = { title: string, onPress: Function, disabled?: boolean, active?: boolean, style?: 'primary' | 'secondary' | 'outline', flex?: boolean }
export default function Button ({ title, onPress, disabled=false, active=false, style='primary', flex=false } : PropsType) {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={[
                styles.button,
                style == 'secondary' && { backgroundColor: COLOUR.wp_orange[500] },
                style == 'outline' && { borderWidth: normalise(1), borderColor: COLOUR.wp_brown[700], backgroundColor: COLOUR.transparent },
                flex && { flex: 1 }
            ]}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Text style={[
                styles.text,
                style == 'outline' && { color: COLOUR.wp_brown[700] }
            ]}>{title}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOUR.wp_green[500],
        paddingHorizontal: normalise(20),
        paddingVertical: normalise(15),
        borderRadius: normalise(50)
    },
    text: {
        color: COLOUR.white,
        ...TEXT.md,
        fontWeight: 600,
        textAlign: 'center'
    }
})
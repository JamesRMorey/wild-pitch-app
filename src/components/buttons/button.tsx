import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../functions/helpers";
import Icon from "../misc/icon";

type PropsType = { title: string, onPress?: Function, disabled?: boolean, active?: boolean, style?: 'primary' | 'secondary' | 'tertiary' | 'outline', icon?: string, flex?: boolean }
export default function Button ({ title, onPress, disabled=false, active=false, style='primary', icon, flex=false } : PropsType) {

    return (
        <TouchableOpacity
            onPress={onPress ? ()=>onPress() : undefined}
            style={[
                styles.button,
                style == 'secondary' && { borderColor: COLOUR.wp_orange[500], backgroundColor: COLOUR.wp_orange[500] },
                style == 'tertiary' && { borderColor: COLOUR.wp_brown[500], backgroundColor: COLOUR.wp_brown[500] },
                style == 'outline' && { borderColor: COLOUR.wp_brown[700], backgroundColor: COLOUR.transparent },
                flex && { flex: 1 }
            ]}
            activeOpacity={0.8}
            disabled={disabled || !onPress}
        >
            <Text style={[
                styles.text,
                style == 'outline' && { color: COLOUR.wp_brown[700] }
            ]}>{title}</Text>
            {icon && 
            <Icon
                icon={icon}
                size={normalise(16)}
                colour={style == 'outline' ? COLOUR.wp_brown[700] : COLOUR.white}
            />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOUR.wp_green[500],
        paddingHorizontal: normalise(20),
        paddingVertical: normalise(15),
        borderRadius: normalise(50),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: normalise(10),
        borderWidth: normalise(1),
        borderColor: COLOUR.wp_green[500],
    },
    text: {
        color: COLOUR.white,
        ...TEXT.md,
        fontWeight: 600,
        textAlign: 'center'
    }
})
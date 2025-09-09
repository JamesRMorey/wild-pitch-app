import { StyleSheet, TouchableOpacity } from "react-native";
import { COLOUR, OPACITY, SHADOW } from "../../styles";
import Icon from "../misc/icon";

type PropsType = { icon: any, onPress: Function, disabled?: boolean, active?: boolean, iconOnly?: boolean, small?: boolean, shadow?: boolean, blocked?: boolean, style?: Object }
export default function IconButton({ icon, onPress, disabled=false, active=false, iconOnly=false, small=false, shadow=false, blocked=false, style={} } : PropsType) {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={[
                styles.button,
                active && styles.active,
                iconOnly && styles.iconOnly,
                disabled && styles.disabled,
                (shadow && !iconOnly) && styles.shadow,
                iconOnly ? { borderColor: COLOUR.transparent } : { borderColor : COLOUR.black + OPACITY[50] },
                style
            ]}
            activeOpacity={0.7}
            disabled={disabled || blocked}
        >
            <Icon
                icon={icon}
                size={small ? 20 : 20}
                colour={active ? COLOUR.white : COLOUR.black}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        aspectRatio: 1,
        height: 45,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOUR.white,
        borderRadius: 50,
    },
    active: {
        backgroundColor: COLOUR.black
    },
    iconOnly: {
        padding: 0,
        backgroundColor: COLOUR.transparent
    },
    disabled: {
        opacity: 0.6
    },
    shadow: {
        ...SHADOW.md
    }
})
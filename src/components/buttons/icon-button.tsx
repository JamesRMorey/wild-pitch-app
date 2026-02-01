import { StyleSheet, TouchableOpacity } from "react-native";
import { COLOUR, OPACITY, ROUNDED, SHADOW } from "../../styles";
import Icon from "../misc/icon";
import { normalise } from "../../utils/helpers";

type PropsType = { icon: any, onPress: Function, disabled?: boolean, active?: boolean, iconOnly?: boolean, small?: boolean, shadow?: boolean, blocked?: boolean, style?: Object, size?: number }
export default function IconButton({ icon, onPress, disabled=false, active=false, iconOnly=false, small=false, shadow=false, blocked=false, style={}, size=normalise(20) } : PropsType) {

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
                style,
                small && { width: normalise(30), height: normalise(30) }
            ]}
            activeOpacity={0.6}
            disabled={disabled || blocked}
        >
            <Icon
                icon={icon}
                size={size}
                colour={active ? COLOUR.white : COLOUR.black}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        aspectRatio: 1,
        height: normalise(45),
        width: normalise(45),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLOUR.white,
        ...ROUNDED.full
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
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLOUR, TEXT } from "../../styles";
import { normalise } from "../../utils/helpers";
import Icon from "../misc/icon";
import Loader from "../map/loader";

type PropsType = { title: string, onPress?: Function, disabled?: boolean, padding?: number, style?: 'primary' | 'secondary' | 'tertiary' | 'outline' | 'white', icon?: string, flex?: boolean, loading?: boolean }
export default function Button ({ title, onPress, disabled=false, style='primary', padding, icon, flex=false, loading=false } : PropsType) {

    return (
        <TouchableOpacity
            onPress={onPress ? ()=>onPress() : undefined}
            style={[
                styles.button,
                style == 'secondary' && { borderColor: COLOUR.wp_orange[500], backgroundColor: COLOUR.wp_orange[500] },
                style == 'tertiary' && { borderColor: COLOUR.wp_brown[500], backgroundColor: COLOUR.wp_brown[500] },
                style == 'outline' && { borderColor: COLOUR.wp_brown[700], backgroundColor: COLOUR.transparent },
                style == 'white' && { borderColor: COLOUR.white, backgroundColor: COLOUR.white },
                flex && { flex: 1 },
                padding ? { paddingVertical: padding } : null
            ]}
            activeOpacity={0.8}
            disabled={disabled || !onPress}
        >
            <Text style={[
                styles.text,
                style == 'outline' && { color: COLOUR.wp_brown[700] },
                style == 'white' && { color: COLOUR.black }
            ]}>{title}</Text>
            {icon && 
            <Icon
                icon={icon}
                size={normalise(16)}
                colour={style == 'outline' ? COLOUR.wp_brown[700] : COLOUR.white}
            />
            }
            {loading && (
                <Loader size={normalise(17)} colour={COLOUR.white}/>
            )}
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
        ...TEXT.md,
        color: COLOUR.white,
        fontWeight: 600,
        textAlign: 'center'
    }
})
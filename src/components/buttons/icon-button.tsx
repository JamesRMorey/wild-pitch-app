import { StyleSheet, TouchableOpacity } from "react-native";
import { SimpleLineIcons as Icon } from "@react-native-vector-icons/simple-line-icons";
import { COLOUR } from "../../styles";


export default function IconButton({ icon, onPress, disabled=false, active=false, iconOnly=false, small=false } : { icon: any, onPress: Function, disabled?: boolean, active?: boolean, iconOnly?: boolean, small?: boolean }) {

    return (
        <TouchableOpacity
            onPress={() => onPress()}
            style={[
                styles.button,
                active && styles.active,
                iconOnly && styles.iconOnly
            ]}
            activeOpacity={0.7}
            disabled={disabled}
        >
            <Icon
                name={icon}
                size={small ? 20 : 22}
                color={active ? COLOUR.white : COLOUR.black}
            ></Icon>
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
        borderRadius: 50
    },
    active: {
        backgroundColor: COLOUR.black
    },
    iconOnly: {
        padding: 0,
        width: 'auto',
        height: 'auto',
        backgroundColor: COLOUR.transparent
    }
})
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import { normalise } from "../../functions/helpers";
import { COLOUR, OPACITY } from "../../styles";

type PropsType = { text: string, onPress?: ()=>void, style?: any, colour: string, }
export default function PillCard({ text, onPress, colour=COLOUR.wp_green[500], style={} } : PropsType) {

    return (
        <TouchableOpacity 
            onPress={onPress}
            disabled={!onPress} 
            style={[
                styles.container, 
                colour && { borderColor: colour }, 
                style
            ]}
        >
            <Text>{ text }</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: { 
        borderWidth: normalise(2), 
        borderRadius: normalise(25), 
        overflow: "hidden",
        borderColor: COLOUR.wp_green[500],
        paddingHorizontal: normalise(15),
        paddingVertical: normalise(10)
    },
    overlay: {
        backgroundColor: COLOUR.black + OPACITY[30], 
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    }
});
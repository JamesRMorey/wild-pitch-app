import { View, TouchableOpacity, StyleSheet } from "react-native";
import { COLOUR } from "../../styles";
import { normalise } from "../../functions/helpers";


export default function Switch({ active, onPress } : { active: boolean, onPress: Function }) {

    return (
        <TouchableOpacity
            style={[
                styles.container,
                active && styles.active
            ]}
            onPress={() => onPress()}
        >
            <View style={styles.knob}></View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLOUR.gray[200],
        padding: normalise(2),
        borderRadius: normalise(30),
        width: normalise(65),
        borderWidth: normalise(1),
        borderColor: COLOUR.white
    },
    knob: {
        height: normalise(30),
        width: normalise(30),
        borderRadius: normalise(30),
        backgroundColor: COLOUR.white
    },
    active: {
        alignItems: 'flex-end',
        backgroundColor: COLOUR.green[500]
    }
});
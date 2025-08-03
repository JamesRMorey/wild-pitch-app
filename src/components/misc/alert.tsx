import { StyleSheet, Text, View } from "react-native"
import { normalise } from "../../functions/helpers"
import { SimpleLineIcons as Icon } from "@react-native-vector-icons/simple-line-icons"
import { COLOUR, OPACITY } from "../../styles"


export default function Alert ({ icon, text } : { icon: string, text: string }) {
    return (
        <View style={styles.container}>
            <Icon
                name={icon}
                size={normalise(30)}
            />
            <Text>{text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(20),
        backgroundColor: COLOUR.yellow[500] + OPACITY[50],
        borderRadius: normalise(15),
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(10)
    }
})
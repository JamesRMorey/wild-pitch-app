import { StyleSheet, View } from "react-native"
import { normalise } from "../../functions/helpers"
import { SimpleLineIcons as Icon } from "@react-native-vector-icons/simple-line-icons"
import { COLOUR, OPACITY } from "../../styles"


export default function IconBadge ({ icon, size='medium' } : { icon: string, size?: 'large'|'medium'|'small' }) {
    return (
        <View style={styles.container}>
            <Icon
                name={icon}
                size={
                    size == 'large' ? normalise(20) :
                    size == 'small' ? normalise(14) :
                    normalise(18)
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: normalise(10),
        backgroundColor: COLOUR.yellow[500] + OPACITY[50],
        borderRadius: normalise(30),
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1
    }
})
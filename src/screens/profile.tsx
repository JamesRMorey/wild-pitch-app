import { ScrollView, StyleSheet, View } from "react-native"
import { normalise } from "../functions/helpers"
import { COLOUR } from "../styles";


export default function ProfileScreen() {

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.white
    },
    scrollContainer: {
        padding: normalise(20)
    },
})
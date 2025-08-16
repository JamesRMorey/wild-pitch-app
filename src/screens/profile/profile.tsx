import { ScrollView, StyleSheet, View, Text } from "react-native"
import { normalise } from "../../functions/helpers"
import { COLOUR, TEXT } from "../../styles";
import { SETTING } from "../../consts";
import IconButton from "../../components/buttons/icon-button";


export default function ProfileScreen() {

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Profile</Text>
                <IconButton
                    icon={'add'}
                    iconOnly={true}
                />
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                <Text style={TEXT.h3}>Community</Text>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SETTING.TOP_PADDING,
        backgroundColor: COLOUR.white,
        paddingHorizontal: normalise(20),
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})
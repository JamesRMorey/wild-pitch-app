import { ScrollView, StyleSheet, View, Text } from "react-native"
import { normalise } from "../../functions/helpers"
import { COLOUR, TEXT } from "../../styles";
import { SETTING } from "../../consts";
import NothingHere from "../../components/misc/nothing-here";


export default function RoutesScreen() {

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={TEXT.h1}>Routes</Text>
            </View>
            <ScrollView
                contentContainerStyle={styles.scrollContainerContent}
                style={styles.scrollContainer}
            >
                <View style={styles.section}>
                    <NothingHere
                        title="Coming Soon"
                        text="We're hard at work building a route mapping tool for you so you don't get lost out there."
                    />
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: SETTING.TOP_PADDING,
        backgroundColor: COLOUR.white,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: normalise(10),
        paddingHorizontal: normalise(20),
        borderBottomWidth: normalise(2),
        borderBottomColor: COLOUR.wp_brown[100]
    },
    scrollContainer: {
        backgroundColor: COLOUR.wp_brown[100]
    },
    section: {
        padding: normalise(50),
        justifyContent: 'center',
        alignItems: 'center'
    }
})
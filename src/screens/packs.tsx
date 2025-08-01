import { ScrollView, StyleSheet, View } from "react-native"
import { PACK_GROUPS, SHEET } from "../consts"
import MapPackSheet from "../components/sheets/map-pack-sheet"
import { useMapPackContext } from "../contexts/map-pack-context"

export default function PacksScreen({}) {

    const { selectedPackGroup } = useMapPackContext();

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                
            </ScrollView>
            <MapPackSheet id={SHEET.MAP_PACKS} packGroup={selectedPackGroup}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    scrollContainer: {
        paddingTop: 50
    }
})
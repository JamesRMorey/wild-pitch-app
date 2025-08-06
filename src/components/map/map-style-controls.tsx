import { SHEET } from "../../consts"
import { StyleSheet, View } from "react-native"
import IconButton from "../buttons/icon-button";
import { SheetManager } from "react-native-actions-sheet";
import MapStyleSheet from "../../sheets/map-style-sheet";


export default function MapStyleControls() {

    const openStyleSheet = () => {
        SheetManager.show(SHEET.MAP_STYLES)
    }

    return (
        <View style={styles.container}>
            <IconButton
                icon={'layers'}
                onPress={() => openStyleSheet()}
                shadow={true}
            />
            <MapStyleSheet/>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 4
    },
    iconButton: {
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        overflow: 'hidden',
    },
    mapTypeIconImage: {
        height: 40,
        width: 40,
        aspectRatio: 1
    },
    active: {
        borderColor: 'white'
    }
});
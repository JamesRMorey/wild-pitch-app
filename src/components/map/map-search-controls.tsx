import { SHEET } from "../../consts"
import { StyleSheet, View } from "react-native"
import IconButton from "../buttons/icon-button";
import { SheetManager } from "react-native-actions-sheet";
import MapSearchSheet from "../../sheets/map-search-sheet";


export default function MapSearchControls() {

    const openSearchSheet = () => {
        SheetManager.show(SHEET.MAP_SEARCH)
    }

    return (
        <View style={styles.container}>
            <IconButton
                icon={'search-outline'}
                onPress={() => openSearchSheet()}
                shadow={true}
            />
            <MapSearchSheet />
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
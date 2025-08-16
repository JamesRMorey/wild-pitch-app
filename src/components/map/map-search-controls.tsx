import { SHEET } from "../../consts"
import { StyleSheet, View } from "react-native"
import IconButton from "../buttons/icon-button";
import { SheetManager } from "react-native-actions-sheet";


export default function MapSearchControls() {

    const openSearchSheet = () => {
        
    }

    return (
        <View style={styles.container}>
            
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
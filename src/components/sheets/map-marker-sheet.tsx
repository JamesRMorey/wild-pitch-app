import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { View, StyleSheet, Text } from "react-native";
import { MapMarker } from "../../types";
import { SHEET } from "../../consts";
import { COLOUR, TEXT } from "../../styles";
import { useMapActions } from "../../contexts/map-context";
import IconButton from "../buttons/icon-button";


export default function MapMarkerSheet ({ id=SHEET.MAP_MARKER, marker } : { id?: string, marker: MapMarker }) {

    if (!marker) return;

    const { flyTo, setActivePackGroup } = useMapActions();

    const close = () => {
        SheetManager.hide(id);
    }
    
    const showMarker = async () => {
        close();
        setTimeout(() => flyTo(marker.coordinate), 100)
    }

    const deleteMarker = async () => {

    }

    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            <View style={styles.container}>
                <View>
                    <View style={styles.titleContainer}>
                        <Text style={TEXT.h3}>Dropped Pin</Text>
                        <IconButton
                            icon={'trash'}
                            onPress={() => deleteMarker()}
                            iconOnly={true}
                        />
                    </View>
                    <Text style={TEXT.sm}>{marker.coordinate[0].toString().slice(0,10)}, {marker.coordinate[1].toString().slice(0,10)}</Text>
                </View>
                <Text style={TEXT.p}></Text>
            </View>
        </ActionSheet>
    )
}


const styles = StyleSheet.create({
    sheet: {
        backgroundColor: COLOUR.white,
        padding: 20,
    },
    container: {
        gap: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
});
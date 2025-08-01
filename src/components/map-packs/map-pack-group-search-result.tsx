import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MapPackGroup as MapPackGroupType } from "../../types";
import { delay, normalise } from "../../functions/helpers";
import { COLOUR, TEXT } from "../../styles";
import { SheetManager } from "react-native-actions-sheet";
import { SHEET } from "../../consts";
import { useMapPackContext } from "../../contexts/map-pack-context";
import { useMapActions } from "../../contexts/map-context";
import IconBadge from "../misc/icon-badge";


export default function MapPackGroupSearchResult({ group } : { group: MapPackGroupType }) {

    const { setSelectedPackGroup } = useMapPackContext();
    const { setActivePackGroup, flyTo } = useMapActions();

    const openPackSheet = async () => {
        setSelectedPackGroup(group);
        setActivePackGroup(group);

        SheetManager.hide(SHEET.MAP_SEARCH);

        await delay(500);
        SheetManager.show(SHEET.MAP_PACKS_SEARCH);

        flyTo(group.center);
    }

    
    return (
        <TouchableOpacity 
            style={styles.container}
            activeOpacity={0.8}
            onPress={() => openPackSheet()}
        >
            <View>
                <IconBadge
                    icon="flag"
                    size="small"
                />
            </View>
            <View style={styles.infoContainer}> 
                <Text style={TEXT.h3}>{ group.name }</Text>
                <Text style={TEXT.p}>{ group.description.slice(0,45) }...</Text>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: normalise(20),
        borderBottomWidth: normalise(1),
        borderBottomColor: COLOUR.gray[300],
        justifyContent: 'space-between',
        gap: normalise(10)
    },
    infoContainer: {
        flex: 1
    }
})
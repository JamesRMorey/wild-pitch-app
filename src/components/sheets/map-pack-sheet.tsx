import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import { View, StyleSheet, Text } from "react-native";
import { MapPackGroup } from "../../types";
import { SHEET } from "../../consts";
import { COLOUR, TEXT } from "../../styles";
import MapPack from "../map-packs/map-pack";
import { normalise } from "../../functions/helpers";
import IconButton from "../buttons/icon-button";
import { useMapContext } from "../../contexts/map-context";
import { useNavigation } from "@react-navigation/native";


export default function MapPackSheet ({ id=SHEET.MAP_PACKS, packGroup } : { id?: string, packGroup: MapPackGroup }) {

    if (!packGroup) return;

    const { flyTo, setActivePackGroup } = useMapContext();
    const navigation = useNavigation();

    const close = () => {
        SheetManager.hide(id);
    }
    
    const showRegion = async () => {
        setActivePackGroup(packGroup);
        close();

        navigation.navigate('map');
        setTimeout(() => flyTo(packGroup.center), 100)
    }

    return (
        <ActionSheet
            id={id}
            containerStyle={styles.sheet}
        >
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={TEXT.h2}>{ packGroup.name }</Text>
                    <IconButton
                        icon='map'
                        iconOnly={true}
                        onPress={() => showRegion()}
                    />
                </View>
                <Text style={TEXT.p}>{ packGroup.description }</Text>
                <View style={styles.packContainer}>
                    {packGroup.packs.map((pack, i) => {
                        return (
                            <MapPack
                                key={i}
                                pack={{
                                    bounds: packGroup.bounds,
                                    minZoom: packGroup.minZoom,
                                    maxZoom: packGroup.maxZoom,
                                    name: pack.name,
                                    styleURL: pack.styleURL
                                }}
                                size={pack.size}
                            />
                        )
                    })}
                </View>
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
    packContainer: {
        flexDirection: 'row',
        gap: normalise(15),
        backgroundColor: COLOUR.gray[100],
        borderRadius: normalise(15),
        padding: normalise(20)
    },
    buttons: {
        alignItems: 'flex-end'
    }
});
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import Alert from "../../components/misc/alert"
import { COLOUR, TEXT } from "../../styles"
import { normalise } from "../../functions/helpers"
import Button from "../../components/buttons/button"
import { NavigationProp, useFocusEffect } from "@react-navigation/native"
import { PACK_GROUPS, SHEET } from "../../consts"
import { useCallback, useState } from "react"
import { MapPack, MapPackGroup } from "../../types"
import Mapbox from "@rnmapbox/maps"
import OfflinePack from "@rnmapbox/maps/lib/typescript/src/modules/offline/OfflinePack"
import IconButton from "../../components/buttons/icon-button"
import { useMapPackGroups } from "../../hooks/useMapPackGroups"
import MapPackSheet from "../../sheets/map-pack-sheet"
import { SheetManager } from "react-native-actions-sheet"
import MapPackGroupCard from "../../components/cards/map-pack-group-card"

export default function PacksScreen({ navigation } : { navigation: any }) {

    const [offlinePacks, setOfflinePacks] = useState<Array<OfflinePack>>([]);
    const { mapPackGroups, get: getPackGroups } = useMapPackGroups();
    const [activeMapPackGroup, setActiveMapPackGroup] = useState<MapPackGroup>();
    
    const navigateToBuilder = () => {
        getPackGroups();
        // navigation.navigate('area-builder')
    }

    const updateOfflinePacks =  async() => {
        const offline = await Mapbox.offlineManager.getPacks();
        setOfflinePacks(offline);
    }

    const deletePack =  async( pack: OfflinePack ) => {
        await Mapbox.offlineManager.deletePack(pack.name);
        updateOfflinePacks();
    }

    const onPackGroupPress = (packGroup: MapPackGroup) => {
        setActiveMapPackGroup(packGroup);
        SheetManager.show(SHEET.MAP_PACKS_SAVED_PACKS)
    }


    useFocusEffect(
        useCallback(() => {
            updateOfflinePacks();
        }, [])
    );


    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
            >
                {mapPackGroups.length == 0 && (
                    <View style={styles.alertContainer}>
                        <Text style={TEXT.h2}>No areas yet?</Text>
                        <Text style={TEXT.p}>Press the button below to create your own area</Text>
                        <View style={styles.buttons}>
                            <Button
                                title="Create new area"
                                onPress={navigateToBuilder}
                            />
                        </View>
                    </View>
                )}
                <Text style={TEXT.h4}>{mapPackGroups.length} Areas Downloaded</Text>
                <View style={styles.packsContainer}>
                    {mapPackGroups.map((packGroup, i) => {
                        return (
                            <MapPackGroupCard
                                key={i}
                                mapPackGroup={packGroup}
                                onPress={() => onPackGroupPress(packGroup)}
                            />
                        )
                    })}
                </View>
            </ScrollView>
            <MapPackSheet
                id={SHEET.MAP_PACKS_SAVED_PACKS}
                packGroup={activeMapPackGroup}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOUR.white
    },
    scrollContainer: {
        padding: normalise(20),
    },
    alertContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: normalise(15)
    },
    buttons: {
        marginTop: normalise(15)
    },
    packsContainer: {
    }
})